'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SettingsModal from '@/components/ui/SettingsModal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

// Lazy load NavBar since it's not critical for first paint
const NavBar = dynamic(() => import('@/components/ui/NavBar'), {
  loading: () => null, // No loading spinner for smoother experience
});

type LayoutClientProps = {
  navItems: Array<{ label: string; href: string; ariaLabel?: string }>;
  children: React.ReactNode;
};

const LayoutClient = ({ navItems, children }: LayoutClientProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Assicurati che siamo lato client prima di mostrare il loading
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Inizializza smooth scroll solo dopo che il loading è completato
  const smoothScrollEnabled = !isLoading && isClient;
  const { getLenis } = useSmoothScroll(smoothScrollEnabled);

  // Forza un refresh di Lenis quando viene attivato
  useEffect(() => {
    if (smoothScrollEnabled) {
      // Piccolo delay per assicurarsi che il DOM sia completamente renderizzato
      const timer = setTimeout(() => {
        const lenis = getLenis();
        if (lenis) {
          // Forza un refresh di Lenis
          lenis.resize();
        }
      }, 200);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [smoothScrollEnabled, getLenis]);

  return (
    <>
      {/* Loading Screen - mostra solo lato client */}
      {isClient && isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main Content - renderizzato solo dopo il loading e lato client */}
      {isClient && !isLoading && (
        <div>
          {/* Page Content */}
          {children}

          {/* NavBar */}
          <NavBar
            logo="/assets/images/LogoBianco.webp"
            logoAlt="Lorenzo Saini Art"
            items={navItems}
            baseColor="#060010"
            pillColor="#fff"
            hoveredPillTextColor="#fff"
            pillTextColor="#060010"
            initialLoadAnimation={true}
            onSettingsClick={() => setIsSettingsOpen(true)}
          />

          {/* Settings Modal - Rendered at document level for proper centering */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      )}

      {/* Fallback durante l'hydration per evitare layout shift */}
      {!isClient && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black/60 font-lavener text-sm">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LayoutClient;
