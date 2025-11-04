'use client';

import type { LoadingScreenHandle } from '@/components/ui/LoadingScreen';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LoadingScreen } from '@/components/ui';

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
 */
export default function HomeClient({ children }: HomeClientProps) {
  const loadingScreenRef = useRef<LoadingScreenHandle>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client before using portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading screen on mount, then hide it after animation
  useEffect(() => {
    const hideLoadingScreen = async () => {
      // Wait for entrance animation (~2.8s), then exit starts immediately
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 2800);
        return () => clearTimeout(timer);
      });
      await loadingScreenRef.current?.hide();
    };

    hideLoadingScreen();
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
