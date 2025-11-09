import createMiddleware from 'next-intl/middleware';
import { routing } from './src/lib/i18n/routing';

// Create next-intl middleware with routing configuration
// This ensures consistent locale detection between server and client
// and prevents hydration mismatch errors
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes (/api/*)
  // - Static files (/_next/*, /favicon.ico, etc.)
  // - Image optimization files
  matcher: ['/', '/(it|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
