'use client';

import type { CameraIrisHandle } from '@/components/ui/CameraIris';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { CameraIris } from '@/components/ui/CameraIris';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SettingsModal from '@/components/ui/SettingsModal';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

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
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const irisRef = useRef<CameraIrisHandle>(null);

  // ScrollSmoother refs
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  // Assicurati che siamo lato client prima di mostrare il loading
  useEffect(() => {
    setIsClient(true);

    // Check if user has visited before (session storage)
    // Skip loading screen for returning visitors in the same session
    if (typeof window !== 'undefined' && sessionStorage) {
      const visited = sessionStorage.getItem('portfolio_visited');
      if (visited === 'true') {
        setHasVisitedBefore(true);
        setIsLoading(false); // Skip loading for returning visitors
      } else {
        // Mark as visited for future page navigations in this session
        sessionStorage.setItem('portfolio_visited', 'true');
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Initialize ScrollSmoother only when content is loaded and client-side
  useGSAP(
    () => {
      if (!isClient || isLoading) {
        return;
      }

      const smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current!,
        content: smoothContentRef.current!,
        smooth: 1.5, // Smoothness (1-3 recommended)
        effects: true, // Enable data-speed and data-lag effects
        normalizeScroll: true, // Prevent momentum scrolling conflicts
      });

      return () => {
        smoother?.kill();
      };
    },
    {
      dependencies: [isClient, isLoading],
      scope: smoothWrapperRef,
    },
  );

  return (
    <>
      {/* Camera Iris Transition - Rendered at root level to persist during LoadingScreen unmount */}
      <CameraIris
        ref={irisRef}
        color="#060010"
        duration={1.0}
        onHalfway={handleLoadingComplete}
      />

      {/* Loading Screen - mostra solo lato client e solo per nuovi visitatori */}
      {isClient && isLoading && !hasVisitedBefore && (
        <LoadingScreen onComplete={handleLoadingComplete} irisRef={irisRef} />
      )}

      {/* Main Content - renderizzato solo dopo il loading e lato client */}
      {isClient && !isLoading && (
        <div id="smooth-wrapper" ref={smoothWrapperRef}>
          <div id="smooth-content" ref={smoothContentRef}>
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
