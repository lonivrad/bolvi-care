import { describe, it, expect, beforeEach } from 'vitest';
// Import the session mock FIRST so `@/lib/auth` is mocked before any route
// handler (which imports `auth`) is loaded.
import { asUser, asGuest } from './helpers/session';
import { req, ctx, json } from './helpers/http';
import {
  createFamily,
  createCaregiver,
  createCareRecipient,
  createBooking,
  createVisit,
  createConversation,
  addToCareTeam,
} from './factories';

import * as careRecipientsRoute from '@/app/api/care-recipients/route';
import * as careRecipientIdRoute from '@/app/api/care-recipients/[id]/route';
import * as bookingsRoute from '@/app/api/bookings/route';
import * as bookingIdRoute from '@/app/api/bookings/[id]/route';
import * as vitalsRoute from '@/app/api/visits/[id]/vitals/route';
import * as medicationsRoute from '@/app/api/visits/[id]/medications/route';
import * as tasksRoute from '@/app/api/visits/[id]/tasks/route';
import * as photosRoute from '@/app/api/visits/[id]/photos/route';
import * as timelineRoute from '@/app/api/visits/[id]/timeline/route';
import * as checkInRoute from '@/app/api/visits/[id]/check-in/route';
import * as checkOutRoute from '@/app/api/visits/[id]/check-out/route';
import * as messagesRoute from '@/app/api/messages/route';
import * as conversationRoute from '@/app/api/messages/[conversationId]/route';

// A full two-tenant world. Tenant A owns a care recipient, a confirmed booking
// with an assigned caregiver, and a visit. Tenant B is a completely separate
// family + caregiver that must never reach A's PHI.
async function twoTenants() {
  const familyA = await createFamily({ name: 'Alice A' });
  const caregiverA = await createCaregiver({ name: 'Carol A' }); // assigned to A's booking
  const recipientA = await createCareRecipient(familyA.family.id, { name: 'Grandpa A' });
  const bookingA = await createBooking({
    familyProfileId: familyA.family.id,
    caregiverProfileId: caregiverA.caregiver.id,
    careRecipientId: recipientA.id,
  });
  const visitA = await createVisit(bookingA.id, recipientA.id);

  const familyB = await createFamily({ name: 'Bob B' });
  const caregiverB = await createCaregiver({ name: 'Dave B' }); // unrelated to A

  return { familyA, caregiverA, recipientA, bookingA, visitA, familyB, caregiverB };
}

describe('Authorization — cross-tenant PHI isolation', () => {
  describe('Care recipients', () => {
    it('Family B cannot GET Family A’s care recipient (403)', async () => {
      const { recipientA, familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await careRecipientIdRoute.GET(req(`/api/care-recipients/${recipientA.id}`), ctx({ id: recipientA.id }));
      expect(res.status).toBe(403);
    });

    it('Family B cannot PATCH Family A’s care recipient (403)', async () => {
      const { recipientA, familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await careRecipientIdRoute.PATCH(
        req(`/api/care-recipients/${recipientA.id}`, { method: 'PATCH', body: { name: 'Hijacked' } }),
        ctx({ id: recipientA.id })
      );
      expect(res.status).toBe(403);
    });

    it('Family B cannot DELETE Family A’s care recipient (403)', async () => {
      const { recipientA, familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await careRecipientIdRoute.DELETE(
        req(`/api/care-recipients/${recipientA.id}`, { method: 'DELETE' }),
        ctx({ id: recipientA.id })
      );
      expect(res.status).toBe(403);
    });

    it('an unrelated caregiver cannot GET Family A’s care recipient (403)', async () => {
      const { recipientA, caregiverB } = await twoTenants();
      asUser(caregiverB.user);
      const res = await careRecipientIdRoute.GET(req(`/api/care-recipients/${recipientA.id}`), ctx({ id: recipientA.id }));
      expect(res.status).toBe(403);
    });

    it('Family B’s list never includes Family A’s care recipient', async () => {
      const { familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await careRecipientsRoute.GET();
      expect(res.status).toBe(200);
      const body = await json<{ data: { name: string }[] }>(res);
      expect(body.data).toHaveLength(0);
    });

    it('a caregiver cannot create a care recipient (403 — families only)', async () => {
      const { caregiverB } = await twoTenants();
      asUser(caregiverB.user);
      const res = await careRecipientsRoute.POST(
        req('/api/care-recipients', { method: 'POST', body: { name: 'Nope' } })
      );
      expect(res.status).toBe(403);
    });

    // Positive controls -------------------------------------------------------
    it('the owning family CAN read its own care recipient (200)', async () => {
      const { recipientA, familyA } = await twoTenants();
      asUser(familyA.user);
      const res = await careRecipientIdRoute.GET(req(`/api/care-recipients/${recipientA.id}`), ctx({ id: recipientA.id }));
      expect(res.status).toBe(200);
      const body = await json<{ data: { name: string } }>(res);
      expect(body.data.name).toBe('Grandpa A');
    });

    it('a care-teamed Care Partner CAN read the scoped care recipient (200)', async () => {
      const { recipientA, familyA, caregiverB } = await twoTenants();
      // caregiverB is legitimately added to Family A's care team.
      await addToCareTeam(familyA.family.id, caregiverB.caregiver.id);
      asUser(caregiverB.user);
      const res = await careRecipientIdRoute.GET(req(`/api/care-recipients/${recipientA.id}`), ctx({ id: recipientA.id }));
      expect(res.status).toBe(200);
    });
  });

  describe('Bookings', () => {
    it('Family B cannot GET Family A’s booking (403)', async () => {
      const { bookingA, familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await bookingIdRoute.GET(req(`/api/bookings/${bookingA.id}`), ctx({ id: bookingA.id }));
      expect(res.status).toBe(403);
    });

    it('an unrelated caregiver cannot GET Family A’s booking (403)', async () => {
      const { bookingA, caregiverB } = await twoTenants();
      asUser(caregiverB.user);
      const res = await bookingIdRoute.GET(req(`/api/bookings/${bookingA.id}`), ctx({ id: bookingA.id }));
      expect(res.status).toBe(403);
    });

    it('Family B cannot PATCH (transition) Family A’s booking (403)', async () => {
      const { bookingA, familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await bookingIdRoute.PATCH(
        req(`/api/bookings/${bookingA.id}`, { method: 'PATCH', body: { status: 'CANCELLED' } }),
        ctx({ id: bookingA.id })
      );
      expect(res.status).toBe(403);
    });

    it('Family B cannot cancel Family A’s booking (403)', async () => {
      const { bookingA, familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await bookingIdRoute.PATCH(
        req(`/api/bookings/${bookingA.id}`, { method: 'PATCH', body: { action: 'cancel', reason: 'OTHER' } }),
        ctx({ id: bookingA.id })
      );
      expect(res.status).toBe(403);
    });

    it('Family B’s booking list never includes Family A’s booking', async () => {
      const { familyB } = await twoTenants();
      asUser(familyB.user);
      const res = await bookingsRoute.GET(req('/api/bookings'));
      expect(res.status).toBe(200);
      const body = await json<{ data: unknown[] }>(res);
      expect(body.data).toHaveLength(0);
    });

    // Positive controls -------------------------------------------------------
    it('the owning family CAN read its own booking (200)', async () => {
      const { bookingA, familyA } = await twoTenants();
      asUser(familyA.user);
      const res = await bookingIdRoute.GET(req(`/api/bookings/${bookingA.id}`), ctx({ id: bookingA.id }));
      expect(res.status).toBe(200);
    });

    it('the assigned caregiver CAN read the booking (200)', async () => {
      const { bookingA, caregiverA } = await twoTenants();
      asUser(caregiverA.user);
      const res = await bookingIdRoute.GET(req(`/api/bookings/${bookingA.id}`), ctx({ id: bookingA.id }));
      expect(res.status).toBe(200);
    });
  });

  describe('Visit records (vitals / medications / tasks / photos / timeline)', () => {
    // GET endpoints: family B and unrelated caregiver are locked out; the
    // owning family and the assigned caregiver get in.
    it('Family B cannot GET any of Family A’s visit records (403)', async () => {
      const { visitA, familyB } = await twoTenants();
      asUser(familyB.user);
      for (const route of [vitalsRoute, medicationsRoute, tasksRoute, photosRoute, timelineRoute]) {
        const res = await route.GET(req(`/api/visits/${visitA.id}/x`), ctx({ id: visitA.id }));
        expect(res.status).toBe(403);
      }
    });

    it('an unrelated caregiver cannot GET any of Family A’s visit records (403)', async () => {
      const { visitA, caregiverB } = await twoTenants();
      asUser(caregiverB.user);
      for (const route of [vitalsRoute, medicationsRoute, tasksRoute, photosRoute, timelineRoute]) {
        const res = await route.GET(req(`/api/visits/${visitA.id}/x`), ctx({ id: visitA.id }));
        expect(res.status).toBe(403);
      }
    });

    it('an unrelated caregiver cannot POST vitals/medications/tasks/photos to Family A’s visit (403)', async () => {
      const { visitA, caregiverB } = await twoTenants();
      asUser(caregiverB.user);
      const attempts: Array<[typeof vitalsRoute, unknown]> = [
        [vitalsRoute, { heartRate: 80 }],
        [medicationsRoute, { medicationName: 'Aspirin', dosage: '81mg' }],
        [tasksRoute, { taskType: 'hygiene', taskName: 'Bath' }],
        [photosRoute, { photoUrl: 'https://example.test/p.jpg' }],
      ];
      for (const [route, body] of attempts) {
        const res = await route.POST(
          req(`/api/visits/${visitA.id}/x`, { method: 'POST', body }),
          ctx({ id: visitA.id })
        );
        expect(res.status).toBe(403);
      }
    });

    it('a family member cannot POST vitals (403 — caregivers only)', async () => {
      const { visitA, familyA } = await twoTenants();
      asUser(familyA.user);
      const res = await vitalsRoute.POST(
        req(`/api/visits/${visitA.id}/vitals`, { method: 'POST', body: { heartRate: 80 } }),
        ctx({ id: visitA.id })
      );
      expect(res.status).toBe(403);
    });

    // Positive controls -------------------------------------------------------
    it('the owning family CAN GET its visit timeline (200)', async () => {
      const { visitA, familyA } = await twoTenants();
      asUser(familyA.user);
      const res = await timelineRoute.GET(req(`/api/visits/${visitA.id}/timeline`), ctx({ id: visitA.id }));
      expect(res.status).toBe(200);
    });

    it('the assigned caregiver CAN GET visit vitals (200)', async () => {
      const { visitA, caregiverA } = await twoTenants();
      asUser(caregiverA.user);
      const res = await vitalsRoute.GET(req(`/api/visits/${visitA.id}/vitals`), ctx({ id: visitA.id }));
      expect(res.status).toBe(200);
    });

    it('the assigned caregiver CAN POST vitals (200)', async () => {
      const { visitA, caregiverA } = await twoTenants();
      asUser(caregiverA.user);
      const res = await vitalsRoute.POST(
        req(`/api/visits/${visitA.id}/vitals`, { method: 'POST', body: { heartRate: 72, temperature: 98.6 } }),
        ctx({ id: visitA.id })
      );
      expect(res.status).toBe(200);
    });
  });

  describe('Visit check-in / check-out', () => {
    it('a family member cannot check in or out (403 — caregivers only)', async () => {
      const { visitA, familyA } = await twoTenants();
      asUser(familyA.user);
      const inRes = await checkInRoute.POST(
        req(`/api/visits/${visitA.id}/check-in`, { method: 'POST', body: { latitude: 47.6, longitude: -122.3 } }),
        ctx({ id: visitA.id })
      );
      const outRes = await checkOutRoute.POST(
        req(`/api/visits/${visitA.id}/check-out`, { method: 'POST', body: { latitude: 47.6, longitude: -122.3 } }),
        ctx({ id: visitA.id })
      );
      expect(inRes.status).toBe(403);
      expect(outRes.status).toBe(403);
    });

    it('an unrelated caregiver cannot check in to Family A’s visit (rejected)', async () => {
      const { visitA, caregiverB } = await twoTenants();
      asUser(caregiverB.user);
      const res = await checkInRoute.POST(
        req(`/api/visits/${visitA.id}/check-in`, { method: 'POST', body: { latitude: 47.6, longitude: -122.3 } }),
        ctx({ id: visitA.id })
      );
      // Not assigned → the check-in flow refuses (400), never mutating the visit.
      expect(res.status).toBe(400);
      const body = await json(res);
      expect(body.error).toMatch(/not assigned/i);
    });
  });

  describe('Messages', () => {
    it('a non-participant cannot GET a conversation’s messages (403)', async () => {
      const { familyA, caregiverA, familyB } = await twoTenants();
      const { conversation } = await createConversation([familyA.user.id, caregiverA.user.id]);
      asUser(familyB.user);
      const res = await conversationRoute.GET(
        req(`/api/messages/${conversation.id}`),
        ctx({ conversationId: conversation.id })
      );
      expect(res.status).toBe(403);
    });

    it('a non-participant cannot POST into a conversation (403)', async () => {
      const { familyA, caregiverA, familyB } = await twoTenants();
      const { conversation } = await createConversation([familyA.user.id, caregiverA.user.id]);
      asUser(familyB.user);
      const res = await conversationRoute.POST(
        req(`/api/messages/${conversation.id}`, { method: 'POST', body: { content: 'let me in' } }),
        ctx({ conversationId: conversation.id })
      );
      expect(res.status).toBe(403);
    });

    it('a non-participant’s conversation list does not include the conversation', async () => {
      const { familyA, caregiverA, familyB } = await twoTenants();
      await createConversation([familyA.user.id, caregiverA.user.id]);
      asUser(familyB.user);
      const res = await messagesRoute.GET(req('/api/messages'));
      expect(res.status).toBe(200);
      const body = await json<{ data: unknown[] }>(res);
      expect(body.data).toHaveLength(0);
    });

    // Positive controls -------------------------------------------------------
    it('a participant CAN read the conversation (200)', async () => {
      const { familyA, caregiverA } = await twoTenants();
      const { conversation } = await createConversation([familyA.user.id, caregiverA.user.id]);
      asUser(familyA.user);
      const res = await conversationRoute.GET(
        req(`/api/messages/${conversation.id}`),
        ctx({ conversationId: conversation.id })
      );
      expect(res.status).toBe(200);
    });

    it('a participant CAN post into the conversation (201)', async () => {
      const { familyA, caregiverA } = await twoTenants();
      const { conversation } = await createConversation([familyA.user.id, caregiverA.user.id]);
      asUser(caregiverA.user);
      const res = await conversationRoute.POST(
        req(`/api/messages/${conversation.id}`, { method: 'POST', body: { content: 'On my way' } }),
        ctx({ conversationId: conversation.id })
      );
      expect(res.status).toBe(201);
    });
  });

  describe('Unauthenticated access', () => {
    beforeEach(() => asGuest());

    it('rejects unauthenticated PHI reads with 401', async () => {
      const { recipientA, bookingA, visitA } = await twoTenants();
      asGuest();
      const calls = [
        careRecipientIdRoute.GET(req(`/api/care-recipients/${recipientA.id}`), ctx({ id: recipientA.id })),
        careRecipientsRoute.GET(),
        bookingIdRoute.GET(req(`/api/bookings/${bookingA.id}`), ctx({ id: bookingA.id })),
        vitalsRoute.GET(req(`/api/visits/${visitA.id}/vitals`), ctx({ id: visitA.id })),
        timelineRoute.GET(req(`/api/visits/${visitA.id}/timeline`), ctx({ id: visitA.id })),
        messagesRoute.GET(req('/api/messages')),
      ];
      for (const res of await Promise.all(calls)) {
        expect(res.status).toBe(401);
      }
    });
  });
});
