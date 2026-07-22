import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';
import { NextRequest } from 'next/server';
// Session mock first (see helpers/session.ts) — keeps the module graph loadable
// under Vitest even though this route never calls auth().
import './helpers/session';
import { prisma } from '@/lib/db';
import { createFamily, createCaregiver, createCareRecipient, createBooking } from './factories';

import * as webhookRoute from '@/app/api/payments/webhook/route';

const WEBHOOK_SECRET = 'whsec_test_dummy';
const stripe = new Stripe('sk_test_dummy');

/** Build a webhook request, signing the payload unless a raw signature is given. */
function webhookRequest(event: unknown, signature?: string): NextRequest {
  const payload = JSON.stringify(event);
  const header =
    signature ?? stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  return new NextRequest('http://localhost:3000/api/payments/webhook', {
    method: 'POST',
    body: payload,
    headers: { 'stripe-signature': header },
  });
}

function succeededEvent(bookingId: string, id = 'evt_test_succeeded') {
  return {
    id,
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_1',
        object: 'payment_intent',
        metadata: { bookingId },
        payment_method_types: ['card'],
      },
    },
  };
}

async function bookingWithPayment() {
  const family = await createFamily();
  const caregiver = await createCaregiver();
  const recipient = await createCareRecipient(family.family.id);
  const booking = await createBooking({
    familyProfileId: family.family.id,
    caregiverProfileId: caregiver.caregiver.id,
    careRecipientId: recipient.id,
  });
  const payment = await prisma.payment.create({
    data: { bookingId: booking.id, payerId: family.user.id, amount: booking.total, status: 'PENDING' },
  });
  return { family, booking, payment };
}

describe('Payment webhook — signature verification', () => {
  it('rejects a payload with an invalid signature (400)', async () => {
    const res = await webhookRoute.POST(webhookRequest(succeededEvent('bk_x'), 'not-a-valid-signature'));
    expect(res.status).toBe(400);
  });

  it('rejects a request with no stripe-signature header (400)', async () => {
    const bareReq = new NextRequest('http://localhost:3000/api/payments/webhook', {
      method: 'POST',
      body: JSON.stringify(succeededEvent('bk_x')),
    });
    const res = await webhookRoute.POST(bareReq);
    expect(res.status).toBe(400);
  });
});

describe('Payment webhook — payment_intent.succeeded', () => {
  it('marks the payment COMPLETED on a validly signed event (200)', async () => {
    const { booking } = await bookingWithPayment();
    const res = await webhookRoute.POST(webhookRequest(succeededEvent(booking.id)));
    expect(res.status).toBe(200);

    const payment = await prisma.payment.findUnique({ where: { bookingId: booking.id } });
    expect(payment!.status).toBe('COMPLETED');
    expect(payment!.processedAt).not.toBeNull();
  });

  it('is idempotent on replay: the payment stays a single COMPLETED record', async () => {
    const { booking } = await bookingWithPayment();

    const first = await webhookRoute.POST(webhookRequest(succeededEvent(booking.id, 'evt_1')));
    const replay = await webhookRoute.POST(webhookRequest(succeededEvent(booking.id, 'evt_1')));
    expect(first.status).toBe(200);
    expect(replay.status).toBe(200);

    // Replaying updates the same row by unique bookingId — it never creates a
    // second payment, and the amount/state are unchanged.
    const payments = await prisma.payment.findMany({ where: { bookingId: booking.id } });
    expect(payments).toHaveLength(1);
    expect(payments[0].status).toBe('COMPLETED');
    expect(payments[0].amount).toBe(booking.total);
  });
});
