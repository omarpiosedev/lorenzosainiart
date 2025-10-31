/**
 * GSAP animation constants
 * Centralized durations and easings for consistent animations
 */
export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  verySlow: 2.0,
} as const;

/**
 * Custom easing functions for GSAP
 */
export const EASINGS = {
  smooth: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  easeOutCubic: (t: number) => 1 - (1 - t) ** 3,
  easeInOutCubic: (t: number) => t < 0.5
    ? 4 * t * t * t
    : 1 - (-2 * t + 2) ** 3 / 2,
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type Easing = keyof typeof EASINGS;
