import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createBookingPaymentIntent, createStripeCustomer } from '@/lib/stripe';
import { createPaymentIntentSchema } from '@/lib/validations';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// POST /api/payments/create-intent - Create a payment intent for a booking
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const validatedFields = createPaymentIntentSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const { bookingId } = validatedFields.data;

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        familyProfile: {
          include: {
            user: true,
          },
        },
        caregiverProfile: {
          include: {
            payoutInfo: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      return notFoundResponse('Booking not found');
    }

    // Verify user owns this booking
    if (
      booking.familyProfile.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return forbiddenResponse();
    }

    // Check booking status
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
      return badRequestResponse('Cannot pay for this booking');
    }

    // Check if payment already exists
    if (booking.payment?.status === 'COMPLETED') {
      return badRequestResponse('This booking has already been paid');
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;

    // Check if family has a payment method with Stripe customer
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        familyProfileId: booking.familyProfileId,
        stripePaymentMethodId: { not: null },
      },
    });

    if (existingPaymentMethod?.stripePaymentMethodId) {
      // Retrieve the customer from the payment method
      const { getPaymentMethod } = await import('@/lib/stripe');
      const pm = await getPaymentMethod(existingPaymentMethod.stripePaymentMethodId);
      stripeCustomerId = pm.customer as string;
    } else {
      // Create a new Stripe customer
      const customer = await createStripeCustomer({
        email: booking.familyProfile.user.email,
        name: booking.familyProfile.user.name,
        userId: booking.familyProfile.userId,
      });
      stripeCustomerId = customer.id;
    }

    // Create payment intent
    const paymentIntent = await createBookingPaymentIntent({
      amount: booking.total,
      customerId: stripeCustomerId,
      caregiverId: booking.caregiverProfileId,
      bookingId: booking.id,
    });

    // Create or update payment record
    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          status: 'PENDING',
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          payerId: booking.familyProfile.userId,
          payeeId: booking.caregiverProfile.userId,
          amount: booking.total,
          platformFee: booking.platformFee,
          payeeAmount: booking.subtotal - booking.platformFee,
          status: 'PENDING',
          stripePaymentIntentId: paymentIntent.id,
        },
      });
    }

    return successResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: booking.total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
