'use client';

import type { LoadingScreenHandle } from '@/components/ui/LoadingScreen';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LoadingScreen } from '@/components/ui';
import { useHomeLoading } from '@/contexts/HomeLoadingContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

type HomeClientProps = {
  children: React.ReactNode;
};

/**
 * HomeClient - Wrapper for home page with LoadingScreen
 *
 * Shows LoadingScreen ALWAYS when entering home page:
 * - On page load/refresh
 * - When navigating from other pages
 *
 * Uses React Portal to render LoadingScreen directly in body,
 * bypassing parent transform that breaks position:fixed
 *
 * CRITICAL iOS FIX:
 * - Locks body scroll during loading to prevent "impazzito" scrolling in notch/Dynamic Island
 * - Resets scroll position to top before showing loading screen
 * - Calls ScrollTrigger.refresh() after loading completes to recalculate all animations
 */
export default function HomeClient({ children }: HomeClientProps) {
  const loadingScreenRef = useRef<LoadingScreenHandle>(null);
  const [mounted, setMounted] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const previousScrollY = useRef<number>(0);
  const pathname = usePathname();
  const { setIsHomeLoading } = useHomeLoading();

  // CRITICAL: Navigation counter ensures unique key on EVERY navigation
  // pathname alone doesn't work because returning to same route = same key
  const [navigationKey, setNavigationKey] = useState(0);

  // CRITICAL: Set home loading state to hide Footer in LayoutClient
  // Use useLayoutEffect to run BEFORE browser paint (prevents footer flash)
  useLayoutEffect(() => {
    setIsHomeLoading(true);
  }, [setIsHomeLoading]);

  // Separate effect for mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Increment navigation key whenever pathname changes
  // This ensures component remounts EVERY time, even when returning to same route
  useEffect(() => {
    setNavigationKey(prev => prev + 1);
    // Reset content visibility on navigation
    setIsContentVisible(false);
  }, [pathname]);

  // Show loading screen on mount, then hide it after animation
  // BEST PRACTICE: Use useGSAP for ScrollTrigger.refresh() to ensure proper cleanup
  useGSAP(() => {
    // CRITICAL: Save current scroll position before locking
    previousScrollY.current = window.scrollY;

    // CRITICAL: Reset scroll to top BEFORE loading screen appears
    // This prevents iOS Safari from showing content "scrolling impazzito" behind loading screen
    window.scrollTo(0, 0);

    // CRITICAL iOS FIX: Lock body scroll during loading screen
    // Prevents seeing content scroll in notch/Dynamic Island area
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.width = '100%';

    let contentVisibilityTimer: NodeJS.Timeout | null = null;

    const hideLoadingScreen = async () => {
      // Show content slightly before LoadingScreen exit for smooth transition
      contentVisibilityTimer = setTimeout(() => {
        setIsContentVisible(true);
      }, 2600); // Show content 200ms before LoadingScreen exit starts

      // Wait for entrance animation (~2.8s), then exit starts immediately
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 2800);
        return () => clearTimeout(timer);
      });
      await loadingScreenRef.current?.hide();

      // CRITICAL: Restore body scroll AFTER loading screen is hidden
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // CRITICAL iOS FIX: Ensure we're at top after unlocking scroll
      window.scrollTo(0, 0);

      // CRITICAL: Set home loading to false - this will show Footer in LayoutClient
      setIsHomeLoading(false);

      // CRITICAL: Refresh all ScrollTrigger instances after loading completes
      // Context7 GSAP Best Practice: Use requestAnimationFrame for precise timing
      // This recalculates all scroll-based animations with correct layout dimensions
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        // CRITICAL FIX: Multi-stage refresh for production reliability
        // Race condition fix: Components create ScrollTriggers at different times
        // Production: lazy loading, code splitting, Suspense = variable timing
        // Solution: Multiple refreshes at strategic intervals to catch ALL ScrollTriggers

        // Stage 1: Immediate refresh for fast-mounting components (100ms)
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);

        // Stage 2: Medium delay for lazy-loaded components (300ms)
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 300);

        // Stage 3: Final safety net for very late components (600ms)
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 600);
      });
    };

    hideLoadingScreen();

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      // CRITICAL: Reset loading state when navigating away from home
      setIsHomeLoading(false);
      if (contentVisibilityTimer) {
        clearTimeout(contentVisibilityTimer);
      }
      // ScrollTrigger cleanup is automatic with useGSAP
    };
  }, { dependencies: [setIsHomeLoading] });

  // CRITICAL: Hydration Guard Pattern - prevents footer flash
  // Return ONLY LoadingScreen during SSR/hydration, children render AFTER mount
  // This prevents any content (including footer) from being visible before LoadingScreen
  return (
    <>
      {/* Use portal to render LoadingScreen directly in body, bypassing transform hierarchy */}
      {mounted && createPortal(
        <LoadingScreen ref={loadingScreenRef} />,
        document.body,
      )}
      {/* CRITICAL: Don't render children until mounted to prevent footer flash */}
      {mounted && (
        <div
          key={navigationKey}
          style={{
            opacity: isContentVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
