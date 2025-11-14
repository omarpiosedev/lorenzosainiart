'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { createContext, use, useLayoutEffect, useMemo, useState } from 'react';

type HomeLoadingContextType = {
  isHomeLoading: boolean;
  setIsHomeLoading: (loading: boolean) => void;
};

const HomeLoadingContext = createContext<HomeLoadingContextType | undefined>(undefined);

export function HomeLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // ✅ FIX: Always initialize to false (safe default)
  // This ensures other pages (blog, contact, aboutme) render correctly on first client-side navigation
  // Previous bug: initialized with Boolean(isHomePage) caused race condition during navigation
  const [isHomeLoading, setIsHomeLoading] = useState(false);

  // ✅ FIX: Use useLayoutEffect instead of useEffect for SYNCHRONOUS state updates
  // React docs: "useLayoutEffect fires before the browser repaints the screen"
  // This prevents race condition where components render with stale isHomeLoading value
  // Critical for preventing blank pages on first navigation from Home → Blog/Contact/AboutMe
  useLayoutEffect(() => {
    const isCurrentlyHomePage = pathname.includes('/home') || pathname.match(/^\/(it|en)\/?$/);
    if (isCurrentlyHomePage) {
      // Entering home page - hide Footer immediately for LoadingScreen
      setIsHomeLoading(true);
    } else {
      // Leaving home page - show Footer for blog/contact/other pages
      setIsHomeLoading(false);
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
