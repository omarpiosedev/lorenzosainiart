'use client';

import type { LoadingScreenHandle } from '@/components/ui/LoadingScreen';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LoadingScreen } from '@/components/ui';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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
  const previousScrollY = useRef<number>(0);

  // Ensure we're on the client before using portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading screen on mount, then hide it after animation
  useEffect(() => {
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

    let refreshTimer: NodeJS.Timeout | null = null;

    const hideLoadingScreen = async () => {
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

      // CRITICAL: Refresh all ScrollTrigger instances after loading completes
      // This recalculates all scroll-based animations with correct layout dimensions
      // Without this, animations break because ScrollTrigger was initialized while
      // loading screen covered the page (wrong calculations)
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100); // Small delay to ensure DOM is fully painted
    };

    hideLoadingScreen();

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, []);

  return (
    <>
      {/* Use portal to render LoadingScreen directly in body, bypassing transform hierarchy */}
      {mounted && createPortal(
        <LoadingScreen ref={loadingScreenRef} />,
        document.body,
      )}
      {children}
    </>
  );
}
