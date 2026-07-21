import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Payment features will not work.');
}

// Only create Stripe client if API key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      // @ts-expect-error - API version mismatch
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  : null;

// Helper to create a payment intent for a booking.
// Bolvi (the agency) bills the family directly for care; there is no platform
// fee split or transfer to the caregiver — Care Partners are paid via payroll.
export async function createBookingPaymentIntent({
  amount,
  customerId,
  caregiverId,
  bookingId,
  metadata = {},
}: {
  amount: number; // in cents
  customerId: string;
  caregiverId: string;
  bookingId: string;
  metadata?: Record<string, string>;
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    metadata: {
      bookingId,
      caregiverId,
      ...metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

// Helper to create a Stripe customer
export async function createStripeCustomer({
  email,
  name,
  userId,
}: {
  email: string;
  name: string;
  userId: string;
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer;
}

// Helper to attach a payment method to a customer
export async function attachPaymentMethod({
  paymentMethodId,
  customerId,
}: {
  paymentMethodId: string;
  customerId: string;
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  return paymentMethod;
}

// Helper to retrieve payment method details
export async function getPaymentMethod(paymentMethodId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  return paymentMethod;
}

// Helper to list customer payment methods
export async function listPaymentMethods(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

// Helper to create a refund
export async function createRefund({
  paymentIntentId,
  amount,
  reason,
}: {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amount && { amount }),
    ...(reason && { reason }),
  });

  return refund;
}

// Webhook signature verification
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}
