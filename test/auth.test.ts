import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
// Import the session mock first: it replaces @/lib/auth (which otherwise pulls
// in next-auth and fails to load under Vitest) while keeping hashPassword real.
import { asGuest } from './helpers/session';
import { req, json } from './helpers/http';
import { prisma } from '@/lib/db';
import { createUser } from './factories';

import * as signupRoute from '@/app/api/auth/signup/route';
import * as verifyEmailRoute from '@/app/api/auth/verify-email/route';
import * as forgotPasswordRoute from '@/app/api/auth/forgot-password/route';
import * as resetPasswordRoute from '@/app/api/auth/reset-password/route';
import * as usersMeRoute from '@/app/api/users/me/route';
import * as careRecipientsRoute from '@/app/api/care-recipients/route';

const HOUR = 60 * 60 * 1000;

describe('Auth — signup', () => {
  it('creates a family user with a family profile and a hashed password (201)', async () => {
    const res = await signupRoute.POST(
      req('/api/auth/signup', {
        method: 'POST',
        body: { role: 'FAMILY', name: 'New Fam', email: 'fam@example.test', password: 'Sup3rSecret!' },
      })
    );
    expect(res.status).toBe(201);

    const user = await prisma.user.findUnique({
      where: { email: 'fam@example.test' },
      include: { familyProfile: true },
    });
    expect(user).not.toBeNull();
    expect(user!.role).toBe('FAMILY');
    expect(user!.familyProfile).not.toBeNull();
    // Password is stored hashed, never in plaintext.
    expect(user!.passwordHash).toBeTruthy();
    expect(user!.passwordHash).not.toBe('Sup3rSecret!');
    expect(await bcrypt.compare('Sup3rSecret!', user!.passwordHash!)).toBe(true);
    expect(await bcrypt.compare('wrong-password', user!.passwordHash!)).toBe(false);
  });

  it('creates a caregiver user with a caregiver profile (201)', async () => {
    const res = await signupRoute.POST(
      req('/api/auth/signup', {
        method: 'POST',
        body: { role: 'CAREGIVER', name: 'New CP', email: 'cp@example.test', password: 'Sup3rSecret!' },
      })
    );
    expect(res.status).toBe(201);
    const user = await prisma.user.findUnique({
      where: { email: 'cp@example.test' },
      include: { caregiverProfile: true },
    });
    expect(user!.role).toBe('CAREGIVER');
    expect(user!.caregiverProfile).not.toBeNull();
  });

  it('rejects a duplicate email (409)', async () => {
    await createUser({ email: 'dupe@example.test' });
    const res = await signupRoute.POST(
      req('/api/auth/signup', {
        method: 'POST',
        body: { role: 'FAMILY', name: 'Dupe', email: 'dupe@example.test', password: 'Sup3rSecret!' },
      })
    );
    expect(res.status).toBe(409);
  });

  it('rejects a too-short password (400)', async () => {
    const res = await signupRoute.POST(
      req('/api/auth/signup', {
        method: 'POST',
        body: { role: 'FAMILY', name: 'Shorty', email: 'short@example.test', password: 'short' },
      })
    );
    expect(res.status).toBe(400);
  });
});

describe('Auth — email verification', () => {
  it('verifies an email with a valid, unexpired token', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: null,
        verificationToken: 'valid-token',
        verificationTokenExpiry: new Date(Date.now() + 24 * HOUR),
      },
    });

    const res = await verifyEmailRoute.GET(req('/api/auth/verify-email?token=valid-token'));
    expect(res.status).toBe(200);

    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated!.emailVerified).not.toBeNull();
    expect(updated!.verificationToken).toBeNull();
  });

  it('rejects an unknown token (400)', async () => {
    const res = await verifyEmailRoute.GET(req('/api/auth/verify-email?token=nope'));
    expect(res.status).toBe(400);
  });

  it('rejects an expired token (400) and leaves the email unverified', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: null,
        verificationToken: 'expired-token',
        verificationTokenExpiry: new Date(Date.now() - HOUR),
      },
    });

    const res = await verifyEmailRoute.GET(req('/api/auth/verify-email?token=expired-token'));
    expect(res.status).toBe(400);
    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated!.emailVerified).toBeNull();
  });

  it('rejects a request with no token (400)', async () => {
    const res = await verifyEmailRoute.GET(req('/api/auth/verify-email'));
    expect(res.status).toBe(400);
  });
});

describe('Auth — password reset', () => {
  it('issues a reset token for a known email (and keeps a ~1h expiry)', async () => {
    const user = await createUser({ email: 'reset@example.test' });
    const res = await forgotPasswordRoute.POST(
      req('/api/auth/forgot-password', { method: 'POST', body: { email: 'reset@example.test' } })
    );
    expect(res.status).toBe(200);

    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated!.resetToken).toBeTruthy();
    expect(updated!.resetTokenExpiry).not.toBeNull();
    const msRemaining = updated!.resetTokenExpiry!.getTime() - Date.now();
    expect(msRemaining).toBeGreaterThan(0);
    expect(msRemaining).toBeLessThanOrEqual(HOUR + 5000);
  });

  it('does not reveal whether an unknown email exists, and issues no token (200)', async () => {
    const res = await forgotPasswordRoute.POST(
      req('/api/auth/forgot-password', { method: 'POST', body: { email: 'ghost@example.test' } })
    );
    expect(res.status).toBe(200);
    expect(await prisma.user.findUnique({ where: { email: 'ghost@example.test' } })).toBeNull();
  });

  it('consumes a valid reset token, rehashes the password, and clears the token', async () => {
    const user = await createUser({ email: 'consume@example.test', password: 'OldPassword1!' });
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: 'reset-token', resetTokenExpiry: new Date(Date.now() + HOUR) },
    });

    const res = await resetPasswordRoute.POST(
      req('/api/auth/reset-password', { method: 'POST', body: { token: 'reset-token', password: 'BrandNew1!' } })
    );
    expect(res.status).toBe(200);

    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updated!.resetToken).toBeNull();
    expect(updated!.resetTokenExpiry).toBeNull();
    expect(await bcrypt.compare('BrandNew1!', updated!.passwordHash!)).toBe(true);
    expect(await bcrypt.compare('OldPassword1!', updated!.passwordHash!)).toBe(false);
  });

  it('rejects an expired reset token (400) and leaves the password unchanged', async () => {
    const user = await createUser({ email: 'expired-reset@example.test', password: 'OldPassword1!' });
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: 'stale-token', resetTokenExpiry: new Date(Date.now() - HOUR) },
    });

    const res = await resetPasswordRoute.POST(
      req('/api/auth/reset-password', { method: 'POST', body: { token: 'stale-token', password: 'BrandNew1!' } })
    );
    expect(res.status).toBe(400);
    const updated = await prisma.user.findUnique({ where: { id: user.id } });
    expect(await bcrypt.compare('OldPassword1!', updated!.passwordHash!)).toBe(true);
  });

  it('rejects an unknown reset token (400)', async () => {
    const res = await resetPasswordRoute.POST(
      req('/api/auth/reset-password', { method: 'POST', body: { token: 'does-not-exist', password: 'BrandNew1!' } })
    );
    expect(res.status).toBe(400);
  });
});

describe('Auth — protected routes reject unauthenticated requests (401)', () => {
  it('GET /api/users/me → 401 without a session', async () => {
    asGuest();
    const res = await usersMeRoute.GET();
    expect(res.status).toBe(401);
  });

  it('GET /api/care-recipients → 401 without a session', async () => {
    asGuest();
    const res = await careRecipientsRoute.GET();
    expect(res.status).toBe(401);
  });
});
