import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './lib/i18n/routing';

// MIGRATED: Renamed from createMiddleware -> still using the same function
// The function name from next-intl remains the same; only our export name changed
const handleI18nRouting = createMiddleware(routing);

// MIGRATED: Renamed from 'middleware' to 'proxy' (Next.js 16 convention)
// The "middleware" concept has been renamed to "proxy" in Next.js 16
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude Sanity Studio from i18n routing
  if (pathname.startsWith('/studio')) {
    return NextResponse.next();
  }

  // Let next-intl handle all locale routing (including root redirects to default locale)
  // Home page is now directly at /[locale] (no /home suffix needed)
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
