import { vi } from 'vitest';
import type { UserRole, UserStatus } from '@prisma/client';

// Route handlers call `auth()` from `@/lib/auth` to resolve the session. We
// replace the whole module with a self-contained mock: `auth` is a fn tests
// drive to set the "current user", and the password helpers are the real
// bcrypt implementation (re-declared here so we never import the actual
// module, which pulls in next-auth and fails to load under Vitest).
//
// Importing this module registers the mock, so test files MUST import it
// before any route handler under test.
const hoisted = vi.hoisted(() => ({
  authMock: vi.fn(async (): Promise<unknown> => null),
}));
export const authMock = hoisted.authMock;

vi.mock('@/lib/auth', async () => {
  const bcrypt = (await import('bcryptjs')).default;
  return {
    auth: authMock,
    hashPassword: (password: string) => bcrypt.hash(password, 12),
    verifyPassword: (password: string, hash: string) => bcrypt.compare(password, hash),
  };
});

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

interface UserLike {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  status?: UserStatus;
}

export function sessionFor(user: UserLike): { user: SessionUser } {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? 'Test User',
      role: user.role,
      status: user.status ?? ('ACTIVE' as UserStatus),
    },
  };
}

/** Make auth() resolve to this user for subsequent handler calls. */
export function asUser(user: UserLike): void {
  authMock.mockResolvedValue(sessionFor(user));
}

/** Make auth() resolve to no session (unauthenticated request). */
export function asGuest(): void {
  authMock.mockResolvedValue(null);
}
