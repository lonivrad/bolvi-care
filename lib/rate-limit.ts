// Rate limiting for abuse-prone credential endpoints (login, signup).
//
// Production uses a DURABLE store (Upstash Redis) so limits hold across the many
// isolated serverless instances Vercel runs. When Upstash isn't configured
// (local dev), it falls back to a per-process in-memory limiter — fine for a
// single dev server, NOT safe for production (each instance counts separately).
//
// Failure mode (Redis unreachable): FAIL OPEN by default — a store hiccup lets
// auth through rather than locking everyone out. Set RATE_LIMIT_FAIL_OPEN=false
// to fail closed instead. Trade-off: while open, the endpoint is unthrottled.
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type RateLimitKind = 'login' | 'signup';

// Sliding-window budgets, keyed by client IP.
const LIMITS: Record<RateLimitKind, { max: number; windowMs: number; duration: `${number} m` }> = {
  login: { max: 10, windowMs: 15 * 60 * 1000, duration: '15 m' },
  signup: { max: 5, windowMs: 60 * 60 * 1000, duration: '60 m' },
};

const FAIL_OPEN = process.env.RATE_LIMIT_FAIL_OPEN !== 'false';

// The Vercel Upstash integration injects UPSTASH_REDIS_REST_URL/TOKEN; accept
// the KV_* aliases too in case the store was linked as Vercel KV.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

/** True when the durable (Upstash) store is configured. False = in-memory dev fallback. */
export const isDurableRateLimit = redis !== null;

const durable = redis
  ? {
      login: new Ratelimit({
        redis,
        prefix: 'rl:login',
        limiter: Ratelimit.slidingWindow(LIMITS.login.max, LIMITS.login.duration),
      }),
      signup: new Ratelimit({
        redis,
        prefix: 'rl:signup',
        limiter: Ratelimit.slidingWindow(LIMITS.signup.max, LIMITS.signup.duration),
      }),
    }
  : null;

// --- In-memory fallback (local dev only) ---
const memory = new Map<string, number[]>();
function memoryLimit(kind: RateLimitKind, id: string) {
  const { max, windowMs } = LIMITS[kind];
  const key = `${kind}:${id}`;
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  memory.set(key, hits);
  return { ok: hits.length <= max, remaining: Math.max(0, max - hits.length) };
}

export interface RateLimitResult {
  ok: boolean;
  remaining?: number;
  retryAfterSeconds?: number;
}

/** Consume one token for `kind` against `id` (typically the client IP). */
export async function rateLimit(kind: RateLimitKind, id: string): Promise<RateLimitResult> {
  // The integration suite exercises route logic, not throttling — never limit it.
  if (process.env.NODE_ENV === 'test') return { ok: true };

  if (durable) {
    try {
      const res = await durable[kind].limit(id);
      return {
        ok: res.success,
        remaining: res.remaining,
        retryAfterSeconds: res.success
          ? undefined
          : Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)),
      };
    } catch (err) {
      console.error(`[rate-limit] durable store error — failing ${FAIL_OPEN ? 'open' : 'closed'}:`, err);
      return { ok: FAIL_OPEN };
    }
  }
  // Local dev fallback.
  return memoryLimit(kind, id);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? '127.0.0.1';
}
