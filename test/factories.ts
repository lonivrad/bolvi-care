import bcrypt from 'bcryptjs';
import { UserRole, UserStatus, BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/db';

// Monotonic counter so factory-created records are unique within a test run
// even before a truncate (e.g. two tenants created in the same test).
let seq = 0;
const uid = () => `${Date.now()}-${++seq}`;

export const TEST_PASSWORD = 'Test1234!';

export async function createUser(opts: {
  role?: UserRole;
  email?: string;
  name?: string;
  password?: string | null;
  status?: UserStatus;
  emailVerified?: Date | null;
} = {}) {
  const password = opts.password === undefined ? TEST_PASSWORD : opts.password;
  return prisma.user.create({
    data: {
      email: opts.email ?? `user-${uid()}@example.test`,
      name: opts.name ?? 'Test User',
      role: opts.role ?? UserRole.FAMILY,
      status: opts.status ?? UserStatus.ACTIVE,
      emailVerified: opts.emailVerified ?? new Date(),
      passwordHash: password ? await bcrypt.hash(password, 10) : null,
    },
  });
}

/** A family user + their FamilyProfile. */
export async function createFamily(opts: { email?: string; name?: string } = {}) {
  const user = await createUser({ role: UserRole.FAMILY, ...opts });
  const family = await prisma.familyProfile.create({
    data: { userId: user.id, city: 'Everett', state: 'WA' },
  });
  return { user, family };
}

/** A caregiver (Care Partner) user + their CaregiverProfile. */
export async function createCaregiver(opts: { email?: string; name?: string } = {}) {
  const user = await createUser({ role: UserRole.CAREGIVER, ...opts });
  const caregiver = await prisma.caregiverProfile.create({
    data: { userId: user.id, hourlyRate: 4500, city: 'Everett', state: 'WA' },
  });
  return { user, caregiver };
}

export async function createCareRecipient(
  familyProfileId: string,
  opts: { name?: string } = {}
) {
  return prisma.careRecipient.create({
    data: { familyProfileId, name: opts.name ?? 'Care Recipient' },
  });
}

export async function createBooking(opts: {
  familyProfileId: string;
  caregiverProfileId: string;
  careRecipientId: string;
  status?: BookingStatus;
  hourlyRate?: number;
  estimatedHours?: number;
}) {
  const hourlyRate = opts.hourlyRate ?? 4500;
  const estimatedHours = opts.estimatedHours ?? 4;
  const subtotal = hourlyRate * estimatedHours;
  const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + estimatedHours * 60 * 60 * 1000);
  return prisma.booking.create({
    data: {
      familyProfileId: opts.familyProfileId,
      caregiverProfileId: opts.caregiverProfileId,
      careRecipientId: opts.careRecipientId,
      status: opts.status ?? BookingStatus.CONFIRMED,
      scheduledStart: start,
      scheduledEnd: end,
      hourlyRate,
      estimatedHours,
      subtotal,
      // Agency billing: no platform fee — total equals subtotal.
      total: subtotal,
    },
  });
}

export async function createVisit(bookingId: string, careRecipientId: string) {
  return prisma.visit.create({ data: { bookingId, careRecipientId } });
}

/** A DIRECT conversation between the given users, with a seed message. */
export async function createConversation(userIds: string[], senderId?: string) {
  const conversation = await prisma.conversation.create({
    data: {
      participants: { create: userIds.map((userId) => ({ userId })) },
    },
  });
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: senderId ?? userIds[0],
      content: 'Seed message',
    },
  });
  return { conversation, message };
}
