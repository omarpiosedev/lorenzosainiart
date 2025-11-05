'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import Footer from '@/components/ui/Footer';
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
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);

  // ScrollSmoother refs
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);

  // Page transition: animate content on route change
  useGSAP(
    () => {
      // Skip animation on initial mount
      if (isInitialMountRef.current) {
        isInitialMountRef.current = false;
        previousPathnameRef.current = pathname;
        return;
      }

      // Skip if pathname hasn't changed
      if (pathname === previousPathnameRef.current) {
        return;
      }

      // CRITICAL iOS FIX: Kill all ScrollTrigger instances before page transition
      // This prevents ScrollTrigger from interfering with navigation animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // Animate new page entering from bottom - VERY SMOOTH
      if (smoothContentRef.current) {
        // CRITICAL: Reset scroll position to top BEFORE animation for new page
        // This ensures consistent scroll state across page transitions
        window.scrollTo({ top: 0, behavior: 'instant' });

        gsap.fromTo(
          smoothContentRef.current,
          {
            yPercent: 100, // Start below viewport
            opacity: 0.8,
          },
          {
            yPercent: 0, // End at normal position
            opacity: 1,
            duration: 0.9, // Smooth, not too fast
            ease: 'expo.out', // Very smooth exponential easing
            overwrite: true, // Cancel any previous animations
            onComplete: () => {
              // CRITICAL iOS FIX: Refresh ScrollTrigger after page transition completes
              // This allows new page's ScrollTrigger instances to recalculate with correct layout
              setTimeout(() => {
                ScrollTrigger.refresh();
              }, 50);
            },
          },
        );
      }

      previousPathnameRef.current = pathname;
    },
    {
      dependencies: [pathname],
      scope: smoothWrapperRef,
    },
  );

  // Initialize ScrollSmoother for smooth scrolling experience
  useGSAP(
    () => {
      // Detect mobile/tablet for optimized smooth scrolling
      const isMobile = window.matchMedia('(max-width: 1023px)').matches;

      // CRITICAL: Enable normalizeScroll on mobile to fix ScrollTrigger pin stuttering
      // while maintaining smooth native scroll feel with optimized config.
      // This fixes iOS Safari bugs that cause pinned elements to "jump" or "stutter"
      // during scrolling. normalizeScroll() is GSAP's workaround for browser bugs.
      if (isMobile) {
        ScrollTrigger.normalizeScroll({
          allowNestedScroll: true, // Permette scroll nidificato per UX migliore
          lockAxis: false, // Non blocca l'asse per scroll più naturale
          type: 'touch', // Solo touch per mobile (no wheel/pointer)
        });

        // Configura ScrollTrigger per iOS Safari
        ScrollTrigger.config({
          ignoreMobileResize: true, // Ignora resize da address bar iOS
        });

        return () => {
          ScrollTrigger.normalizeScroll(false);
        };
      }

      // Desktop only: create smooth scrolling experience
      const smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current!,
        content: smoothContentRef.current!,
        smooth: 1.2,
        effects: true, // Enable parallax effects on desktop
        normalizeScroll: false, // Keep disabled on desktop to prevent conflicts with ScrollSmoother
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
      {/* Main Content Wrapper with Smooth Scrolling */}
      <div
        id="smooth-wrapper"
        ref={smoothWrapperRef}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <div
          id="smooth-content"
          ref={smoothContentRef}
          style={{
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {/* Page Content - Animated on route change */}
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
