import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Portfolio site internationalization configuration
// Supports Italian and English locales with automatic locale negotiation

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Use dynamic import with explicit path resolution
  const messages = await import(`../../locales/${locale}.json`);

  return {
    locale,
    messages,
  };
});
