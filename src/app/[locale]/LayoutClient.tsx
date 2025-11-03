'use client';

import type { CameraIrisHandle } from '@/components/ui/CameraIris';
import type { LoadingScreenHandle } from '@/components/ui/LoadingScreen';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { CameraIris, LoadingScreen } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import SettingsModal from '@/components/ui/SettingsModal';
import { usePageTransition } from '@/hooks/usePageTransition';

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
  const irisRef = useRef<CameraIrisHandle>(null);
  const loadingScreenRef = useRef<LoadingScreenHandle>(null);

  // ScrollSmoother refs
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  // Enable page transitions with Camera Iris
  usePageTransition(irisRef);

  // Hide loading screen after initial mount
  useEffect(() => {
    const hideLoadingScreen = async () => {
      // Wait for entrance animation (~2.8s), then exit starts immediately
      // Total animation: ~4 seconds (entrance + exit)
      await new Promise(resolve => setTimeout(resolve, 2800));
      await loadingScreenRef.current?.hide();
    };

    hideLoadingScreen();
  }, []);

  // Initialize ScrollSmoother for smooth scrolling experience
  useGSAP(
    () => {
      // Detect mobile/tablet for optimized smooth scrolling
      const isMobile = window.matchMedia('(max-width: 1023px)').matches;

      // Disable ScrollSmoother on mobile - native touch scrolling performs better
      // Mobile devices have optimized native scroll and ScrollSmoother causes:
      // - iOS address bar glitching with normalizeScroll
      // - Touch device freezes when normalizeScroll + smoothTouch are combined
      // - Performance issues on older devices (iPhone 6s, Galaxy Tab A)
      if (isMobile) {
        return;
      }

      // Desktop only: create smooth scrolling experience
      const smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current!,
        content: smoothContentRef.current!,
        smooth: 1.2,
        effects: true, // Enable parallax effects on desktop
        normalizeScroll: false, // Removed to prevent conflicts
      });

      return () => {
        smoother?.kill();
      };
    },
    {
      scope: smoothWrapperRef,
    },
  );

  return (
    <>
      {/* Loading Screen - Shown on initial page load */}
      <LoadingScreen ref={loadingScreenRef} />

      {/* Camera Iris Transition - Rendered at root level for global page transitions */}
      <CameraIris ref={irisRef} color="#060010" duration={0.6} />

      {/* Main Content Wrapper with Smooth Scrolling */}
      <div id="smooth-wrapper" ref={smoothWrapperRef}>
        <div id="smooth-content" ref={smoothContentRef}>
          {/* Page Content */}
          {children}

          {/* Footer - Inside smooth-content so it scrolls with the page */}
          <Footer />
        </div>

        {/* NavBar - OUTSIDE smooth-content so fixed positioning works */}
        {/* GSAP ScrollSmoother best practice: fixed elements must be siblings to smooth-content, not children */}
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

        {/* Settings Modal - Also outside smooth-content for proper fixed positioning */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </>
  );
};

export default LayoutClient;
