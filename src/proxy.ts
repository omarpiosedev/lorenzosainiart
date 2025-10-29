import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/I18nRouting';

// MIGRATED: Renamed from createMiddleware -> still using the same function
// The function name from next-intl remains the same; only our export name changed
const handleI18nRouting = createMiddleware(routing);

// MIGRATED: Renamed from 'middleware' to 'proxy' (Next.js 16 convention)
// The "middleware" concept has been renamed to "proxy" in Next.js 16
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle root redirect to default locale with /home
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/home`, request.url));
  }

  // Handle locale root redirects (e.g., /it -> /it/home, /en -> /en/home)
  const localeMatch = pathname.match(/^\/([^/]+)$/);
  if (localeMatch && localeMatch[1] && routing.locales.includes(localeMatch[1])) {
    return NextResponse.redirect(new URL(`${pathname}/home`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
