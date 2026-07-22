import { describe, it, expect } from 'vitest';
// Session mock first (see helpers/session.ts).
import { asUser } from './helpers/session';
import { req, ctx } from './helpers/http';
import { prisma } from '@/lib/db';
import {
  createFamily,
  createCaregiver,
  createCareRecipient,
  createBooking,
  createVisit,
} from './factories';
import {
  createAuditLog,
  auditCareRecipientAccess,
  AUDIT_ACTIONS,
  ENTITY_TYPES,
} from '@/lib/hipaa/audit';

import * as careRecipientsRoute from '@/app/api/care-recipients/route';
import * as bookingIdRoute from '@/app/api/bookings/[id]/route';
import * as vitalsRoute from '@/app/api/visits/[id]/vitals/route';

const recent = (d: Date) => Date.now() - d.getTime() < 60_000;

describe('HIPAA audit logger — direct helpers', () => {
  it('writes an AuditLog row with actor, action, entity, and timestamp', async () => {
    const { user } = await createFamily();
    await createAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: AUDIT_ACTIONS.PHI_VIEW,
      entityType: ENTITY_TYPES.CARE_RECIPIENT,
      entityId: 'cr-123',
      phiAccessed: true,
      sensitivityLevel: 'HIGH',
    });

    const log = await prisma.auditLog.findFirst({ where: { entityId: 'cr-123' } });
    expect(log).not.toBeNull();
    expect(log!.action).toBe('PHI_VIEW');
    expect(log!.entityType).toBe('CareRecipient');
    expect(log!.userId).toBe(user.id);
    expect(log!.userEmail).toBe(user.email);
    expect(recent(log!.createdAt)).toBe(true);
  });

  it('auditCareRecipientAccess records the correct namespaced action', async () => {
    const { user } = await createFamily();
    await auditCareRecipientAccess(user.id, user.email, 'cr-999', 'UPDATE', { name: 'Changed' });

    const log = await prisma.auditLog.findFirst({ where: { entityId: 'cr-999' } });
    expect(log!.action).toBe('CARE_RECIPIENT_UPDATE');
    expect(log!.entityType).toBe('CareRecipient');
    expect(log!.userId).toBe(user.id);
  });
});

describe('HIPAA audit logger — PHI routes emit audit trails', () => {
  it('creating a care recipient writes a CREATE_CARE_RECIPIENT audit row', async () => {
    const { user } = await createFamily();
    asUser(user);

    const res = await careRecipientsRoute.POST(
      req('/api/care-recipients', { method: 'POST', body: { name: 'Grandma' } })
    );
    expect(res.status).toBe(201);
    const created = (await res.json()).data as { id: string };

    const log = await prisma.auditLog.findFirst({
      where: { action: 'CREATE_CARE_RECIPIENT', entityId: created.id },
    });
    expect(log).not.toBeNull();
    expect(log!.entityType).toBe('CareRecipient');
    expect(log!.userId).toBe(user.id);
    expect(log!.userEmail).toBe(user.email);
    expect(recent(log!.createdAt)).toBe(true);
  });

  it('cancelling a booking writes a CANCEL_BOOKING audit row for the actor', async () => {
    const { user, family } = await createFamily();
    const caregiver = await createCaregiver();
    const recipient = await createCareRecipient(family.id);
    const booking = await createBooking({
      familyProfileId: family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
    });
    asUser(user);

    const res = await bookingIdRoute.PATCH(
      req(`/api/bookings/${booking.id}`, { method: 'PATCH', body: { action: 'cancel', reason: 'OTHER' } }),
      ctx({ id: booking.id })
    );
    expect(res.status).toBe(200);

    const log = await prisma.auditLog.findFirst({
      where: { action: 'CANCEL_BOOKING', entityId: booking.id },
    });
    expect(log).not.toBeNull();
    expect(log!.entityType).toBe('Booking');
    expect(log!.userId).toBe(user.id);
  });

  it('recording vitals writes a PHI_UPDATE audit row against the visit', async () => {
    const { family } = await createFamily();
    const caregiver = await createCaregiver();
    const recipient = await createCareRecipient(family.id);
    const booking = await createBooking({
      familyProfileId: family.id,
      caregiverProfileId: caregiver.caregiver.id,
      careRecipientId: recipient.id,
    });
    const visit = await createVisit(booking.id, recipient.id);
    asUser(caregiver.user);

    const res = await vitalsRoute.POST(
      req(`/api/visits/${visit.id}/vitals`, { method: 'POST', body: { heartRate: 72 } }),
      ctx({ id: visit.id })
    );
    expect(res.status).toBe(200);

    const log = await prisma.auditLog.findFirst({
      where: { action: 'PHI_UPDATE', entityType: 'Visit', entityId: visit.id },
    });
    expect(log).not.toBeNull();
    expect(log!.userId).toBe(caregiver.user.id);
    expect(recent(log!.createdAt)).toBe(true);
  });
});
