/**
 * Responsive breakpoints
 * Matches Tailwind CSS breakpoints
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Helper function to check if viewport width is at or above a breakpoint
 */
export const isBreakpoint = (width: number, breakpoint: Breakpoint): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};
