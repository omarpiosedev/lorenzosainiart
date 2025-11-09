'use client';

import type { ScrollSmoother } from 'gsap/ScrollSmoother';
import { createContext, use } from 'react';

/**
 * Context for accessing ScrollSmoother instance globally
 * Allows components to programmatically scroll to elements
 *
 * @example
 * const smoother = useSmoothScroll();
 * smoother?.scrollTo('#contact', true, 'top center');
 */
export const SmoothScrollContext = createContext<ScrollSmoother | null>(null);

/**
 * Hook to access ScrollSmoother instance
 * Returns null on mobile (where ScrollSmoother is disabled)
 *
 * @returns ScrollSmoother instance or null
 */
export function useSmoothScroll() {
  return use(SmoothScrollContext);
}
