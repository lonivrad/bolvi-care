// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { scrubSentryEvent, scrubSentryBreadcrumb } from '@/lib/sentry-scrub';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Scrub PHI from error payloads: strip sensitive headers, remove IP,
    // drop request body/query string, redact dynamic ID segments from URLs.
    beforeSend: scrubSentryEvent,

    // Drop breadcrumbs pointing at PHI-bearing routes; redact IDs from the rest.
    beforeBreadcrumb: scrubSentryBreadcrumb,
  });
}
