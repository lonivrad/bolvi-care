import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db';
import { createFamily, createCareRecipient } from './factories';

// Verifies the harness itself: DB connectivity, factories, and that the
// per-test truncate leaves each test with a clean slate.
describe('test harness', () => {
  it('connects to the test database and creates isolated tenants', async () => {
    const a = await createFamily();
    const b = await createFamily();
    expect(a.user.id).not.toBe(b.user.id);

    const recipient = await createCareRecipient(a.family.id, { name: 'Grandma' });
    expect(recipient.familyProfileId).toBe(a.family.id);

    const count = await prisma.careRecipient.count();
    expect(count).toBe(1);
  });

  it('starts from an empty database (truncate ran between tests)', async () => {
    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.careRecipient.count()).toBe(0);
  });
});
