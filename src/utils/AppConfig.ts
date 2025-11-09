import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'always';

// Portfolio site configuration
export const AppConfig = {
  name: 'Portfolio Site',
  locales: ['it', 'en'],
  defaultLocale: 'it', // Italian is the primary locale
  localePrefix,
};

export const getBaseUrl = () => {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
};
