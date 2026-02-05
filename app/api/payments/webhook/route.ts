import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { constructWebhookEvent, createTransfer } from '@/lib/stripe';
import Stripe from 'stripe';

// Stripe webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer;
        await handleTransferCreated(transfer);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId, caregiverId, platformFee } = paymentIntent.metadata;

  if (!bookingId) {
    console.error('Missing bookingId in payment intent metadata');
    return;
  }

  // Update payment record
  const payment = await prisma.payment.update({
    where: { bookingId },
    data: {
      status: 'COMPLETED',
      processedAt: new Date(),
      method: (paymentIntent.payment_method_types?.[0] === 'card' ? 'CARD' : 'BANK_ACCOUNT') as 'CARD' | 'BANK_ACCOUNT',
    },
  });

  // Get booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      familyProfile: {
        include: { user: true },
      },
      caregiverProfile: {
        include: {
          user: true,
          payoutInfo: true,
        },
      },
    },
  });

  if (!booking) {
    console.error('Booking not found for payment:', bookingId);
    return;
  }

  // If caregiver has a connected Stripe account, transfer funds
  if (booking.caregiverProfile.payoutInfo?.stripeAccountId) {
    const transferAmount = payment.payeeAmount;

    try {
      await createTransfer({
        amount: transferAmount,
        destinationAccountId: booking.caregiverProfile.payoutInfo.stripeAccountId,
        bookingId,
      });
    } catch (error) {
      console.error('Failed to create transfer:', error);
      // Log for manual processing
    }
  }

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: booking.familyProfile.userId,
        type: 'PAYMENT_SENT',
        title: 'Payment Successful',
        message: `Your payment of $${(payment.amount / 100).toFixed(2)} was successful.`,
        actionUrl: `/dashboard/family/bookings/${bookingId}`,
        data: { bookingId, paymentId: payment.id },
      },
      {
        userId: booking.caregiverProfile.userId,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received',
        message: `You received a payment of $${(payment.payeeAmount / 100).toFixed(2)}.`,
        actionUrl: `/dashboard/caregiver/earnings`,
        data: { bookingId, paymentId: payment.id },
      },
    ],
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      action: 'PAYMENT_COMPLETED',
      entityType: 'Payment',
      entityId: payment.id,
      newValues: {
        bookingId,
        amount: payment.amount,
        platformFee: payment.platformFee,
      },
    },
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId } = paymentIntent.metadata;

  if (!bookingId) {
    return;
  }

  // Update payment record
  await prisma.payment.update({
    where: { bookingId },
    data: {
      status: 'FAILED',
    },
  });

  // Get booking to notify family
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      familyProfile: true,
    },
  });

  if (booking) {
    await prisma.notification.create({
      data: {
        userId: booking.familyProfile.userId,
        type: 'SYSTEM_ALERT',
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please try again or use a different payment method.',
        actionUrl: `/dashboard/family/bookings/${bookingId}`,
        data: { bookingId },
      },
    });
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  const { userId } = account.metadata || {};

  if (!userId) {
    return;
  }

  // Update caregiver payout info
  await prisma.payoutInfo.updateMany({
    where: {
      stripeAccountId: account.id,
    },
    data: {
      stripeAccountStatus: account.charges_enabled ? 'active' : 'pending',
    },
  });

  // Notify caregiver if account is now active
  if (account.charges_enabled) {
    const caregiverProfile = await prisma.caregiverProfile.findFirst({
      where: {
        payoutInfo: {
          stripeAccountId: account.id,
        },
      },
    });

    if (caregiverProfile) {
      await prisma.notification.create({
        data: {
          userId: caregiverProfile.userId,
          type: 'VERIFICATION_APPROVED',
          title: 'Payment Account Active',
          message: 'Your payment account is now active. You can start receiving payments!',
          actionUrl: '/dashboard/caregiver/earnings',
        },
      });
    }
  }
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  const { bookingId } = transfer.metadata || {};

  if (!bookingId) {
    return;
  }

  // Update payment with transfer ID
  await prisma.payment.update({
    where: { bookingId },
    data: {
      stripeTransferId: transfer.id,
    },
  });
}
