import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { constructWebhookEvent } from '@/lib/stripe';
import Stripe from 'stripe';

// Stripe webhook handler.
// Bolvi (the agency) bills the family directly for care. There is no Stripe
// Connect transfer to the caregiver and no in-app payout — Care Partners are
// W-2 employees paid through an external payroll provider.
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
  const { bookingId } = paymentIntent.metadata;

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

  // Get booking to notify the family
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      familyProfile: {
        include: { user: true },
      },
    },
  });

  if (!booking) {
    console.error('Booking not found for payment:', bookingId);
    return;
  }

  // Notify the family that their payment to the agency succeeded
  await prisma.notification.create({
    data: {
      userId: booking.familyProfile.userId,
      type: 'PAYMENT_SENT',
      title: 'Payment Successful',
      message: `Your payment of $${(payment.amount / 100).toFixed(2)} was successful.`,
      actionUrl: `/dashboard/family/bookings/${bookingId}`,
      data: { bookingId, paymentId: payment.id },
    },
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
