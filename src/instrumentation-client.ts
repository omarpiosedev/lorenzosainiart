// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Sentry client-side only when explicitly needed
// This function can be called dynamically to reduce initial bundle size
export function initSentryClient() {
  if (process.env.NEXT_PUBLIC_SENTRY_DISABLED || typeof window === 'undefined') {
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

    // Add optional integrations for additional features
    integrations: [
      // Only enable replay in development or with very low sampling
      Sentry.replayIntegration({
        // Mask all text and inputs for privacy
        maskAllText: isProduction,
        maskAllInputs: isProduction,
        // Block media for performance
        blockAllMedia: true,
      }),
      Sentry.consoleLoggingIntegration({
        // Reduce noise in production
        levels: isDevelopment ? ['error', 'warn', 'info'] : ['error'],
      }),
    ],

    // Only send PII in development for privacy
    sendDefaultPii: !isProduction,

    // Conservative performance monitoring (lower in production)
    tracesSampleRate: isDevelopment ? 1.0 : 0.05,

    // Very conservative session replay sampling for privacy and performance
    replaysSessionSampleRate: 0.0,

    // Only capture replays on errors in development
    replaysOnErrorSampleRate: isDevelopment ? 0.1 : 0.0,

    // Disable logs on client side for performance
    _experiments: { enableLogs: false },

    // Debug only in development
    debug: isDevelopment,

    // Filter out noise from common sources
    beforeSend(event, _hint) {
      // Filter out extension errors
      if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
        frame => frame.filename?.includes('extension://')
          || frame.filename?.includes('moz-extension://')
          || frame.filename?.includes('chrome-extension://'),
      )) {
        return null;
      }

      // Filter out network errors that might be caused by ad blockers
      if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
        return null;
      }

      return event;
    },
  });

  if (isDevelopment) {
    Spotlight.init();
  }
}

// Auto-initialize for counter page that has interactive functionality
if (typeof window !== 'undefined' && window.location.pathname.includes('/counter')) {
  initSentryClient();
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
