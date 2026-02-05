export { PostHogProvider, PostHogPageView } from './provider';
export {
  posthog,
  initPostHog,
  identifyUser,
  resetUser,
  trackEvent,
  trackPageView,
  isFeatureEnabled,
  getFeatureFlag,
  analyticsEvents,
  trackSignUp,
  trackBookingCreated,
  trackSearch,
} from './client';
