// Shared Sentry scrubbing helpers.
//
// This app handles PHI, so error payloads and breadcrumbs must never carry
// patient data off to Sentry. These helpers are used by all three Sentry
// configs (client, server, edge) so the behavior is identical everywhere.

import type { Breadcrumb, ErrorEvent } from '@sentry/nextjs';

// Route prefixes whose traffic can carry PHI. Breadcrumbs pointing at these
// are dropped entirely rather than redacted, since even the shape of the
// request (timing, method, status) is sensitive here.
const PHI_ROUTE_PREFIXES = [
  '/api/visits', // also covers /api/visits/[id]/{vitals,medications,photos,tasks,...}
  '/api/care-recipients',
  '/api/medications',
  '/api/messages',
  '/api/photos',
];

// A path segment that looks like an identifier: numeric, UUID, Prisma cuid,
// or any long opaque token. These get replaced with `[id]` so URLs keep their
// shape for grouping without leaking the specific record referenced.
const ID_SEGMENT =
  /^(?:\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|c[a-z0-9]{20,}|[A-Za-z0-9_-]{16,})$/i;

const REDACTED = '[redacted]';

function extractPath(url: string): string {
  try {
    return new URL(url, 'http://scrub.invalid').pathname;
  } catch {
    return url.split('?')[0];
  }
}

/** True if the URL targets a route that can carry PHI. */
export function isPhiUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const path = extractPath(url);
  return PHI_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + '/')
  );
}

function redactPath(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment && ID_SEGMENT.test(segment) ? '[id]' : segment))
    .join('/');
}

/**
 * Redact dynamic ID segments from a URL and drop its query string.
 * Absolute URLs keep their origin; relative URLs stay relative.
 */
export function redactUrl(url: string | undefined | null): string | undefined {
  if (!url) return url ?? undefined;
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(url);
  try {
    const parsed = new URL(url, 'http://scrub.invalid');
    const path = redactPath(parsed.pathname);
    return isAbsolute ? parsed.origin + path : path;
  } catch {
    return redactPath(url.split('?')[0]);
  }
}

/**
 * Scrub a Sentry error event before it is sent: strip sensitive headers, drop
 * request body and query string, and redact dynamic segments from the URL.
 */
export function scrubSentryEvent(event: ErrorEvent): ErrorEvent {
  if (event.user) {
    delete event.user.ip_address;
  }

  if (event.request) {
    if (event.request.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    if (event.request.url) {
      event.request.url = redactUrl(event.request.url);
    }
    if ('query_string' in event.request) {
      event.request.query_string = REDACTED;
    }
    if ('data' in event.request) {
      // Request bodies on this app routinely contain PHI (vitals, notes,
      // messages). Never ship them.
      event.request.data = REDACTED;
    }
  }

  return event;
}

/**
 * Scrub a breadcrumb before it is recorded: drop anything pointing at a
 * PHI-bearing route, and redact dynamic segments from every other URL.
 */
export function scrubSentryBreadcrumb(
  breadcrumb: Breadcrumb
): Breadcrumb | null {
  const data = breadcrumb.data;
  if (!data) return breadcrumb;

  // http/fetch/xhr breadcrumbs carry the request URL in data.url.
  // navigation breadcrumbs carry data.from / data.to.
  for (const key of ['url', 'from', 'to'] as const) {
    const value = data[key];
    if (typeof value !== 'string') continue;
    if (isPhiUrl(value)) return null; // drop the whole breadcrumb
    data[key] = redactUrl(value);
  }

  return breadcrumb;
}
