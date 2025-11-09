'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';

import { SmoothScrollContext } from '@/contexts/SmoothScrollContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

type SmoothScrollProps = {
  children: React.ReactNode;
  /**
   * Fixed elements (e.g., NavBar, Modals) that should be OUTSIDE smooth-content
   * but INSIDE smooth-wrapper to maintain position:fixed behavior
   */
  fixedElements?: React.ReactNode;
  /**
   * Duration in seconds for scroll to "catch up" to native position
   * @default 1.2
   */
  smooth?: number;
  /**
   * Enable parallax effects via data-speed and data-lag attributes
   * @default true
   */
  effects?: boolean;
  /**
   * Smooth scroll duration on touch devices (0.1 = fast, false = disabled)
   * @default false
   */
  smoothTouch?: boolean | number;
  /**
   * Enable on mobile devices (NOT recommended for performance)
   * @default false
   */
  enableOnMobile?: boolean;
  /**
   * Ref for smooth-content div (for page transitions)
   */
  contentRef?: React.RefObject<HTMLDivElement>;
};

/**
 * ScrollSmoother wrapper component for smooth scrolling experience
 *
 * Features:
 * - Desktop-only by default (mobile uses native scroll)
 * - Parallax effects via data-speed and data-lag attributes
 * - Respects prefers-reduced-motion
 * - Provides Context for programmatic scrolling
 * - Auto cleanup on unmount
 *
 * @example
 * <SmoothScroll smooth={1.2} effects={true}>
 *   <div data-speed="0.5">Slow parallax</div>
 *   <div data-lag="0.3">Lazy scroll</div>
 * </SmoothScroll>
 */
export default function SmoothScroll({
  children,
  fixedElements,
  smooth = 1.2,
  effects = true,
  smoothTouch = false,
  enableOnMobile = false,
  contentRef,
}: SmoothScrollProps) {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const internalContentRef = useRef<HTMLDivElement>(null);
  // Use external ref if provided, otherwise use internal
  const smoothContentRef = contentRef || internalContentRef;
  const [smootherInstance, setSmootherInstance] = useState<ScrollSmoother | null>(null);

  // Initialize ScrollSmoother (desktop only by default)
  useGSAP(
    () => {
      // ALWAYS configure ScrollTrigger globally
      ScrollTrigger.config({
        ignoreMobileResize: true, // Ignore iOS address bar resize
      });

      // Check if mobile/tablet
      const isMobile = window.matchMedia('(max-width: 1023px)').matches;

      // Check if user prefers reduced motion (accessibility)
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      // Skip ScrollSmoother if:
      // - Mobile and not explicitly enabled
      // - User prefers reduced motion
      if ((isMobile && !enableOnMobile) || prefersReducedMotion) {
        return;
      }

      // Desktop (or mobile if enabled): Create smooth scrolling experience
      const smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current!,
        content: smoothContentRef.current!,
        smooth, // Duration to catch up to scroll position
        effects, // Enable data-speed and data-lag parallax
        smoothTouch, // Smooth on touch devices
        normalizeScroll: true, // ✅ Force scroll on JS thread for sync
        ignoreMobileResize: true, // Ignore mobile keyboard resize
        // Callbacks for debugging (optional)
        // onUpdate: (self) => console.log('Progress:', self.progress),
        // onStop: () => console.log('Scroll stopped'),
      });

      // Save instance to state for Context
      setSmootherInstance(smoother);

      // Cleanup on unmount
      return () => {
        smoother?.kill();
        setSmootherInstance(null);
      };
    },
    {
      scope: smoothWrapperRef,
      dependencies: [smooth, effects, smoothTouch, enableOnMobile],
    },
  );

  return (
    <SmoothScrollContext value={smootherInstance}>
      <div
        id="smooth-wrapper"
        ref={smoothWrapperRef}
        style={{
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          id="smooth-content"
          ref={smoothContentRef}
          style={{
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {children}
        </div>

        {/* Fixed elements (NavBar, Modals) OUTSIDE smooth-content */}
        {/* This allows position:fixed to work correctly with ScrollSmoother */}
        {fixedElements}
      </div>
    </SmoothScrollContext>
  );
}
