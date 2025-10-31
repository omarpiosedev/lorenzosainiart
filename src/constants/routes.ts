/**
 * Application routes
 * Centralized route paths for type safety
 */
export const ROUTES = {
  HOME: '/',
  PORTFOLIO: '/portfolio',
  BLOG: '/blog',
  ABOUT: '/aboutme',
  CONTACT: '/contact',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
