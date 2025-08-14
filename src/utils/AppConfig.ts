import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'always';

// Portfolio site configuration
export const AppConfig = {
  name: 'Portfolio Site',
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,
};
