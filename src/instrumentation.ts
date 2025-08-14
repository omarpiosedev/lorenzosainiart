import * as Sentry from '@sentry/nextjs';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const sentryOptions: Sentry.NodeOptions | Sentry.EdgeOptions = {
  // Sentry DSN
  dsn: process.env.SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.SENTRY_RELEASE,

  // Enable Spotlight in development
  spotlight: isDevelopment,

  integrations: [
    Sentry.consoleLoggingIntegration({
      // Disable in production to reduce noise
      levels: isDevelopment ? ['error', 'warn', 'info'] : ['error'],
    }),
  ],

  // Only send PII in non-production environments for privacy
  sendDefaultPii: !isProduction,

  // Performance monitoring sample rates (lower in production to reduce overhead)
  tracesSampleRate: isDevelopment ? 1.0 : 0.1,

  // Enable logs to be sent to Sentry (only in production)
  _experiments: { enableLogs: isProduction },

  // Debug mode only in development
  debug: isDevelopment,

  // Filter out noise from common bots and extensions
  beforeSend(event) {
    // Filter out known bot traffic
    const userAgent = event.request?.headers?.['user-agent'];
    if (userAgent && /bot|crawler|spider|indexer/i.test(userAgent)) {
      return null;
    }

    // Filter out extension errors
    if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
      frame => frame.filename?.includes('extension://') || frame.filename?.includes('moz-extension://'),
    )) {
      return null;
    }

    return event;
  },
};

export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js Sentry configuration
      Sentry.init(sentryOptions);
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge Sentry configuration
      Sentry.init(sentryOptions);
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
