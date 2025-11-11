'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { createContext, use, useEffect, useMemo, useState } from 'react';

type HomeLoadingContextType = {
  isHomeLoading: boolean;
  setIsHomeLoading: (loading: boolean) => void;
};

const HomeLoadingContext = createContext<HomeLoadingContextType | undefined>(undefined);

export function HomeLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // CRITICAL FIX: Initialize isHomeLoading based on current pathname
  // If we're on home page (/it/home, /en/home, /it, /en), start with loading=true
  // This prevents Footer flash by hiding it BEFORE first render
  const isHomePage = pathname.includes('/home') || pathname.match(/^\/(it|en)\/?$/);
  const [isHomeLoading, setIsHomeLoading] = useState(Boolean(isHomePage));

  // CRITICAL: Monitor pathname changes and set isHomeLoading immediately when navigating TO home
  // This prevents Footer flash when navigating from other pages (e.g., /portfolio) to /home
  // IMPORTANT: Only triggers when pathname changes (NOT when isHomeLoading changes)
  useEffect(() => {
    const isCurrentlyHomePage = pathname.includes('/home') || pathname.match(/^\/(it|en)\/?$/);
    if (isCurrentlyHomePage) {
      // Entering home page - hide Footer immediately for LoadingScreen
      setIsHomeLoading(true);
    }
  }, [pathname]); // Only pathname, NOT isHomeLoading (to avoid loop)

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ isHomeLoading, setIsHomeLoading }),
    [isHomeLoading],
  );

  return (
    <HomeLoadingContext value={contextValue}>
      {children}
    </HomeLoadingContext>
  );
}

export function useHomeLoading() {
  const context = use(HomeLoadingContext);
  if (context === undefined) {
    throw new Error('useHomeLoading must be used within a HomeLoadingProvider');
  }
  return context;
}
