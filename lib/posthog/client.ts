'use client';

import posthog from 'posthog-js';

// Initialize PostHog
export function initPostHog() {
  if (typeof window === 'undefined') return;

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn('POSTHOG_KEY is not set. Analytics will not work.');
    return;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We'll capture manually for SPAs
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',

    // Privacy settings - important for healthcare
    respect_dnt: true,
    opt_out_capturing_by_default: false,

    // Sanitize URLs to remove sensitive params
    sanitize_properties: (properties) => {
      if (properties['$current_url']) {
        // Remove sensitive query params from URLs
        const url = new URL(properties['$current_url']);
        const sensitiveParams = ['token', 'code', 'state', 'session'];
        sensitiveParams.forEach(param => url.searchParams.delete(param));
        properties['$current_url'] = url.toString();
      }
      return properties;
    },

    // Loaded callback
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        // Disable in development unless explicitly enabled
        // posthog.opt_out_capturing();
      }
    },
  });
}

// Export posthog instance
export { posthog };

// Helper to identify users
export function identifyUser(userId: string, properties?: {
  email?: string;
  name?: string;
  role?: 'FAMILY' | 'CAREGIVER' | 'ADMIN';
  createdAt?: string;
}) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.identify(userId, {
    ...properties,
    // Don't include sensitive PII
  });
}

// Reset user identity (on logout)
export function resetUser() {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.reset();
}

// Track custom events
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(eventName, properties);
}

// Track page views (for SPA navigation)
export function trackPageView(url?: string) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture('$pageview', {
    $current_url: url || window.location.href,
  });
}

// Feature flags
export function isFeatureEnabled(flagKey: string): boolean {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return false;
  return posthog.isFeatureEnabled(flagKey) ?? false;
}

export function getFeatureFlag(flagKey: string): string | boolean | undefined {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return undefined;
  return posthog.getFeatureFlag(flagKey);
}

// Pre-defined events for the care platform
export const analyticsEvents = {
  // Auth events
  SIGN_UP_STARTED: 'sign_up_started',
  SIGN_UP_COMPLETED: 'sign_up_completed',
  LOGIN: 'login',
  LOGOUT: 'logout',

  // Search events
  CAREGIVER_SEARCH: 'caregiver_search',
  CAREGIVER_VIEW: 'caregiver_view',
  CAREGIVER_CONTACT: 'caregiver_contact',

  // Booking events
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',

  // Visit events
  VISIT_CHECK_IN: 'visit_check_in',
  VISIT_CHECK_OUT: 'visit_check_out',

  // Payment events
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',

  // Messaging events
  MESSAGE_SENT: 'message_sent',
  CONVERSATION_STARTED: 'conversation_started',

  // Review events
  REVIEW_SUBMITTED: 'review_submitted',

  // Profile events
  PROFILE_UPDATED: 'profile_updated',
  AVAILABILITY_UPDATED: 'availability_updated',
} as const;

// Helper functions for common events
export function trackSignUp(role: 'FAMILY' | 'CAREGIVER') {
  trackEvent(analyticsEvents.SIGN_UP_COMPLETED, { role });
}

export function trackBookingCreated(bookingDetails: {
  caregiverId: string;
  serviceType: string;
  duration: number;
  total: number;
}) {
  trackEvent(analyticsEvents.BOOKING_COMPLETED, {
    ...bookingDetails,
    // Remove PII, keep aggregate data
  });
}

export function trackSearch(filters: {
  location?: string;
  services?: string[];
  priceRange?: [number, number];
  resultCount: number;
}) {
  trackEvent(analyticsEvents.CAREGIVER_SEARCH, {
    hasLocation: !!filters.location,
    serviceCount: filters.services?.length || 0,
    hasPriceFilter: !!filters.priceRange,
    resultCount: filters.resultCount,
  });
}
