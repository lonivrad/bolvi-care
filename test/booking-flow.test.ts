import { describe, it, expect } from 'vitest';
// Session mock first (see helpers/session.ts).
import { asUser } from './helpers/session';
import { req, ctx, json } from './helpers/http';
import { prisma } from '@/lib/db';
import {
  createFamily,
  createCaregiver,
  createCareRecipient,
  createBooking,
} from './factories';

import * as bookingsRoute from '@/app/api/bookings/route';
import * as bookingIdRoute from '@/app/api/bookings/[id]/route';

// A family that owns a care recipient plus an assignable caregiver.
async function bookingParties() {
  const family = await createFamily();
  const caregiver = await createCaregiver();
  const recipient = await createCareRecipient(family.family.id);
  return { family, caregiver, recipient };
}

function future(hoursFromNow: number) {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

async function transition(bookingId: string, status: string, actor: Parameters<typeof asUser>[0]) {
  asUser(actor);
  return bookingIdRoute.PATCH(
    req(`/api/bookings/${bookingId}`, { method: 'PATCH', body: { status } }),
    ctx({ id: bookingId })
  );
}

describe('Booking flow — creation', () => {
  it('bills the family the subtotal with no platform fee (total === subtotal)', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    asUser(family.user);

    const res = await bookingsRoute.POST(
      req('/api/bookings', {
        method: 'POST',
        body: {
          caregiverProfileId: caregiver.caregiver.id,
          careRecipientId: recipient.id,
          scheduledStart: future(48),
          scheduledEnd: future(52), // 4 hours
          services: ['companionship'],
        },
      })
    );
    expect(res.status).toBe(201);
    const booking = (await json<{ data: Record<string, number> }>(res)).data;

    // Agency model: the family pays exactly the subtotal — no platform fee split.
    expect(booking.total).toBe(booking.subtotal);
    expect(booking).not.toHaveProperty('platformFee');

    // And the subtotal is a straight hourlyRate × hours (4500 × 4 = 18000 cents).
    const persisted = await prisma.booking.findUnique({ where: { id: (booking as unknown as { id: string }).id } });
    expect(persisted!.subtotal).toBe(persisted!.hourlyRate * persisted!.estimatedHours);
    expect(persisted!.total).toBe(persisted!.subtotal);
  });
});

describe('Booking flow — state transitions', () => {
  it('walks PENDING → CONFIRMED → IN_PROGRESS → COMPLETED', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    const booking = await createBooking({
      familyProfileId: family.family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
      status: 'PENDING',
    });

    const confirm = await transition(booking.id, 'CONFIRMED', caregiver.user);
    expect(confirm.status).toBe(200);

    const start = await transition(booking.id, 'IN_PROGRESS', caregiver.user);
    expect(start.status).toBe(200);

    const complete = await transition(booking.id, 'COMPLETED', caregiver.user);
    expect(complete.status).toBe(200);

    const finalState = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(finalState!.status).toBe('COMPLETED');
    // Starting a visit materialises a Visit row.
    expect(await prisma.visit.findUnique({ where: { bookingId: booking.id } })).not.toBeNull();
  });

  it('rejects an illegal transition (PENDING → COMPLETED) with 400', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    const booking = await createBooking({
      familyProfileId: family.family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
      status: 'PENDING',
    });

    const res = await transition(booking.id, 'COMPLETED', caregiver.user);
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body.error).toMatch(/cannot transition/i);
    // State is unchanged.
    expect((await prisma.booking.findUnique({ where: { id: booking.id } }))!.status).toBe('PENDING');
  });

  it('rejects any transition out of a terminal CANCELLED booking (400)', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    const booking = await createBooking({
      familyProfileId: family.family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
      status: 'CANCELLED',
    });

    const res = await transition(booking.id, 'CONFIRMED', caregiver.user);
    expect(res.status).toBe(400);
  });

  it('forbids a family from confirming a booking (403 — caregivers only)', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    const booking = await createBooking({
      familyProfileId: family.family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
      status: 'PENDING',
    });

    const res = await transition(booking.id, 'CONFIRMED', family.user);
    expect(res.status).toBe(403);
  });
});

describe('Booking flow — cancellation', () => {
  it('cancels a booking >24h out with a full refund', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    const booking = await createBooking({
      familyProfileId: family.family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
      status: 'CONFIRMED',
      // createBooking schedules the start ~24h out; nudge it clearly beyond 24h.
    });
    // Ensure the start is comfortably more than 24h away for a full refund.
    await prisma.booking.update({
      where: { id: booking.id },
      data: { scheduledStart: new Date(Date.now() + 72 * 60 * 60 * 1000) },
    });
    asUser(family.user);

    const res = await bookingIdRoute.PATCH(
      req(`/api/bookings/${booking.id}`, { method: 'PATCH', body: { action: 'cancel', reason: 'NO_LONGER_NEEDED' } }),
      ctx({ id: booking.id })
    );
    expect(res.status).toBe(200);

    const persisted = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(persisted!.status).toBe('CANCELLED');

    const cancellation = await prisma.cancellation.findUnique({ where: { bookingId: booking.id } });
    expect(cancellation).not.toBeNull();
    expect(cancellation!.refundAmount).toBe(booking.total);
  });

  it('refuses to cancel a COMPLETED booking (400)', async () => {
    const { family, caregiver, recipient } = await bookingParties();
    const booking = await createBooking({
      familyProfileId: family.family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
      status: 'COMPLETED',
    });
    asUser(family.user);

    const res = await bookingIdRoute.PATCH(
      req(`/api/bookings/${booking.id}`, { method: 'PATCH', body: { action: 'cancel', reason: 'OTHER' } }),
      ctx({ id: booking.id })
    );
    expect(res.status).toBe(400);
  });
});
