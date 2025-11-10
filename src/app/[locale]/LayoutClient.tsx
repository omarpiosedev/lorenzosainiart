'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Footer from '@/components/ui/Footer';
import SettingsModal from '@/components/ui/SettingsModal';
import { useHomeLoading } from '@/contexts/HomeLoadingContext';

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
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);
  const { isHomeLoading } = useHomeLoading();

  // CRITICAL: Track if we're on initial home page mount to prevent footer flash
  // Initialize to true if current path is home, false otherwise
  const [isHomeInitialMount, setIsHomeInitialMount] = useState(() => {
    return pathname.match(/^\/(it|en)(\/home)?$/) !== null;
  });

  // ScrollSmoother refs
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const smootherInstanceRef = useRef<ScrollSmoother | null>(null);

  // Video transition refs
  const videoTransitionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoEndHandlerRef = useRef<(() => void) | null>(null);
  const isVideoTransitionActiveRef = useRef(false);

  // CRITICAL: Reset home initial mount flag when navigating TO home
  // This prevents footer flash when navigating from other pages to home
  useEffect(() => {
    const isHomePage = pathname.match(/^\/(it|en)(\/home)?$/) !== null;
    if (isHomePage && !isHomeInitialMount) {
      setIsHomeInitialMount(true);
    }
  }, [pathname, isHomeInitialMount]);

  // CRITICAL: Clear home initial mount flag when loading finishes
  // This allows footer to appear after LoadingScreen completes
  useEffect(() => {
    if (isHomeInitialMount && !isHomeLoading) {
      setIsHomeInitialMount(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHomeLoading]);

  // Listen for video transition events from child components
  useEffect(() => {
    const handleVideoTransition = (event: CustomEvent<{ targetUrl: string }>) => {
      const { targetUrl } = event.detail;

      if (!videoRef.current || !videoTransitionRef.current) {
        return;
      }

      const video = videoRef.current;
      const overlay = videoTransitionRef.current;

      // Clean up previous event listener if exists
      if (videoEndHandlerRef.current && video) {
        try {
          video.removeEventListener('ended', videoEndHandlerRef.current);
        } catch {
          // Silently ignore if already removed
        }
        videoEndHandlerRef.current = null;
      }

      // Kill any existing GSAP animations on overlay to prevent conflicts
      gsap.killTweensOf(overlay);

      // Mark video transition as active to disable normal page transitions
      isVideoTransitionActiveRef.current = true;

      // Reset video
      video.currentTime = 0;

      // Show overlay with video IMMEDIATELY (no fade)
      gsap.set(overlay, { opacity: 1 });

      // When video ends, navigate to new page then fade out overlay
      const handleVideoEnd = () => {
        // Navigate to new page
        router.push(targetUrl);

        // Check if refs still exist before animating
        if (!videoTransitionRef.current) {
          return;
        }

        const currentOverlay = videoTransitionRef.current;

        // Fade out overlay after navigation
        gsap.to(currentOverlay, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            // Mark video transition as complete
            isVideoTransitionActiveRef.current = false;

            // Final cleanup after animation completes
            if (videoRef.current && videoEndHandlerRef.current) {
              try {
                videoRef.current.removeEventListener('ended', videoEndHandlerRef.current);
              } catch {
                // Silently ignore
              }
              videoEndHandlerRef.current = null;
            }
          },
        });
      };

      videoEndHandlerRef.current = handleVideoEnd;
      video.addEventListener('ended', handleVideoEnd);

      // Start video
      video
        .play()
        .catch(() => {
          // If autoplay fails, navigate immediately
          router.push(targetUrl);
        });
    };

    window.addEventListener(
      'videoTransition' as any,
      handleVideoTransition as EventListener,
    );

    return () => {
      window.removeEventListener(
        'videoTransition' as any,
        handleVideoTransition as EventListener,
      );

      // Clean up video event listener on unmount
      if (videoEndHandlerRef.current && videoRef.current) {
        try {
          videoRef.current.removeEventListener('ended', videoEndHandlerRef.current);
        } catch {
          // Silently ignore if node is already removed
        }
        videoEndHandlerRef.current = null;
      }

      // Kill any pending GSAP animations
      if (videoTransitionRef.current) {
        gsap.killTweensOf(videoTransitionRef.current);
      }
    };
  }, [router]);

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

      // Skip if video transition is active (video handles the transition)
      if (isVideoTransitionActiveRef.current) {
        previousPathnameRef.current = pathname;
        return;
      }

      // CRITICAL iOS FIX: Kill all ScrollTrigger instances before page transition
      // This prevents ScrollTrigger from interfering with navigation animations
      ScrollTrigger.getAll().forEach((trigger) => {
        try {
          trigger.kill();
        } catch {
          // Silently ignore if trigger is already killed
        }
      });

      // Animate new page entering from bottom - VERY SMOOTH
      if (smoothContentRef.current) {
        try {
          // CRITICAL: Reset scroll position to top BEFORE animation for new page
          // Desktop: Use ScrollSmoother.scrollTop() for virtual scroll
          // Mobile: Use window.scrollTo() for native scroll
          if (smootherInstanceRef.current) {
            smootherInstanceRef.current.scrollTop(0); // Instant scroll to top
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }

          // Get main content (children) - exclude footer from page transition animation
          const mainContent = smoothContentRef.current.querySelector('[data-main-content]');

          if (mainContent) {
            // Animate ONLY main content, not footer
            gsap.fromTo(
              mainContent,
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
          } else {
            // Fallback: animate entire content if data-main-content not found
            gsap.fromTo(
              smoothContentRef.current,
              {
                yPercent: 100,
                opacity: 0.8,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'expo.out',
                overwrite: true,
                onComplete: () => {
                  setTimeout(() => {
                    ScrollTrigger.refresh();
                  }, 50);
                },
              },
            );
          }
        } catch {
          // Silently ignore if elements are no longer in DOM
        }
      }

      previousPathnameRef.current = pathname;

      // CRITICAL: Complete cleanup to prevent DOM errors during navigation
      // Kill page transition tweens BEFORE React unmounts
      return () => {
        if (smoothContentRef.current) {
          const mainContent = smoothContentRef.current.querySelector('[data-main-content]');
          if (mainContent) {
            gsap.killTweensOf(mainContent);
          }
          gsap.killTweensOf(smoothContentRef.current);
        }
      };
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

      // CRITICAL: Configure ScrollTrigger for mobile iOS Safari
      // Using anticipatePin in individual ScrollTriggers instead of normalizeScroll
      // to maintain native smooth scroll while fixing pin jittering
      if (isMobile) {
        ScrollTrigger.config({
          ignoreMobileResize: true, // Ignora resize da address bar iOS
        });
        return;
      }

      // Desktop only: create smooth scrolling experience
      const smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current!,
        content: smoothContentRef.current!,
        smooth: 1.2,
        effects: true, // Enable parallax effects on desktop
        normalizeScroll: false, // Keep disabled on desktop to prevent conflicts with ScrollSmoother
      });

      // Save ScrollSmoother instance for scroll-to-top on navigation
      smootherInstanceRef.current = smoother;

      return () => {
        smoother?.kill();
        smootherInstanceRef.current = null;
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
          {/* Main Content Wrapper - Animated on route change */}
          <div data-main-content>
            {children}
          </div>

          {/* Footer - Inside smooth-content but OUTSIDE data-main-content */}
          {/* This prevents footer from being animated during page transitions */}
          {/* CRITICAL: Exclude footer from portfolio page */}
          {/* For home page: hide footer during initial mount AND during LoadingScreen */}
          {/* isHomeInitialMount prevents footer flash on page reload */}
          {!pathname.includes('/portfolio') && !isHomeLoading && !isHomeInitialMount && <Footer />}
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

      {/* Global Video Transition Overlay - Always on top */}
      <div
        ref={videoTransitionRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0,
          zIndex: 999999,
        }}
      >
        <video
          ref={videoRef}
          src="/assets/videos/Partendo_da_questo_202511072313_klq88.mp4"
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      </div>
    </>
  );
};

export default LayoutClient;
