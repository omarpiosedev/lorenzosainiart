/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  defaultLocale: 'it',
  supportedLocales: ['it', 'en'],
  siteName: 'Lorenzo Saini Art',
  siteDescription: 'Creative portfolio showcasing photography, video, and art',
} as const;

/**
 * Smooth scrolling configuration (Lenis)
 */
export const SCROLL_CONFIG = {
  lenisDuration: 1.2,
  lenisEasing: 'smooth' as const,
  touchMultiplier: 2,
  wheelMultiplier: 1,
} as const;
