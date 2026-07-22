import { NextRequest, NextResponse } from 'next/server';
import { handlers } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const { GET } = handlers;

// Throttle credential-login attempts (credential stuffing) by client IP before
// delegating to Auth.js. Every other auth POST (csrf, signout, session) passes
// straight through untouched.
export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);

  if (pathname.endsWith('/callback/credentials')) {
    const { ok, retryAfterSeconds } = await rateLimit('login', clientIp(req));
    if (!ok) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a few minutes and try again.' },
        {
          status: 429,
          headers: retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : undefined,
        }
      );
    }
  }

  return handlers.POST(req);
}
