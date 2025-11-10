'use client';

import type { ReactNode } from 'react';
import { createContext, use, useState } from 'react';

type HomeLoadingContextType = {
  isHomeLoading: boolean;
  setIsHomeLoading: (loading: boolean) => void;
};

const HomeLoadingContext = createContext<HomeLoadingContextType | undefined>(undefined);

export function HomeLoadingProvider({ children }: { children: ReactNode }) {
  const [isHomeLoading, setIsHomeLoading] = useState(false);

  return (
    <HomeLoadingContext value={{ isHomeLoading, setIsHomeLoading }}>
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
