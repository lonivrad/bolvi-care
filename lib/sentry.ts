import * as Sentry from '@sentry/nextjs';

// Initialize Sentry (called from instrumentation files)
export function initSentry() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn('SENTRY_DSN is not set. Error tracking will not work.');
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Set sampling rate for profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Filter out sensitive data
    beforeSend(event) {
      // Filter out PII from error events
      if (event.user) {
        delete event.user.ip_address;
      }

      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extension errors
      /extensions\//i,
      /^chrome-extension:\/\//i,
      // Network errors that are expected
      /Failed to fetch/i,
      /NetworkError/i,
      /AbortError/i,
      // User cancelled navigation
      /cancelled/i,
    ],

    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  });
}

// Helper to capture exceptions with context
export function captureException(
  error: Error,
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  }
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.error('Sentry not configured. Error:', error);
    return;
  }

  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
}

// Helper to capture messages
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: Record<string, unknown>
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log(`[${level}] ${message}`, context);
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureMessage(message, level);
  });
}

// Helper to set user context
export function setUserContext(user: {
  id: string;
  email?: string;
  role?: string;
} | null) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } else {
    Sentry.setUser(null);
  }
}

// Helper for breadcrumbs
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level,
  });
}

// Helper to start a transaction for performance monitoring
export function startTransaction(
  name: string,
  operation: string
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return {
      finish: () => {},
      startChild: () => ({ finish: () => {} }),
    };
  }

  return Sentry.startInactiveSpan({
    name,
    op: operation,
  });
}

// Export Sentry for direct usage if needed
export { Sentry };
