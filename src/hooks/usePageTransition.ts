'use client';

import type { CameraIrisHandle } from '@/components/ui/CameraIris';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * usePageTransition - Hook for managing page transition animations
 *
 * Automatically triggers Camera Iris transition when route changes.
 * Handles initial mount, route changes, and cleanup.
 *
 * @param transitionRef - Ref to CameraIrisHandle for controlling animations
 * @param enabled - Enable/disable transitions (default: true)
 *
 * @example
 * const irisRef = useRef<CameraIrisHandle>(null)
 * usePageTransition(irisRef)
 */
export function usePageTransition(
  transitionRef: React.RefObject<CameraIrisHandle | null>,
  enabled = true,
) {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    // Skip transition on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousPathnameRef.current = pathname;
      return;
    }

    // Skip if disabled or pathname hasn't changed
    if (!enabled || pathname === previousPathnameRef.current) {
      return;
    }

    // Trigger transition animation
    const triggerTransition = async () => {
      try {
        await transitionRef.current?.transition();
      } catch (error) {
        console.error('Page transition error:', error);
      }
    };

    triggerTransition();
    previousPathnameRef.current = pathname;
  }, [pathname, enabled, transitionRef]);
}
