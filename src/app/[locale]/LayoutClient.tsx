'use client';

import type { BackgroundMusicHandle } from '@/components/ui/BackgroundMusic';
import type { LoadingScreenHandle } from '@/components/ui/LoadingScreen';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import BackgroundMusic from '@/components/ui/BackgroundMusic';
import FloatingNavBar from '@/components/ui/FloatingNavBar';
import Footer from '@/components/ui/Footer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import SettingsModal from '@/components/ui/SettingsModal';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

type LayoutClientProps = {
  children: React.ReactNode;
  navItems: Array<{ label: string; href: string; ariaLabel?: string }>;
};

const LayoutClient = ({ children, navItems }: LayoutClientProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasLoadingCompleted, setHasLoadingCompleted] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);
  const isFirstLoadRef = useRef(true); // Track if this is first app load vs client navigation

  // LoadingScreen and BackgroundMusic refs
  const loadingScreenRef = useRef<LoadingScreenHandle>(null);
  const backgroundMusicRef = useRef<BackgroundMusicHandle>(null);

  // Check if current page is home (any locale)
  const isHomePage = pathname === '/it' || pathname === '/en' || pathname === '/it/' || pathname === '/en/';

  // ScrollSmoother refs
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  const smootherInstanceRef = useRef<ScrollSmoother | null>(null);

  // Video transition refs
  const videoTransitionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoEndHandlerRef = useRef<(() => void) | null>(null);
  const isVideoTransitionActiveRef = useRef(false);
  const targetPathRef = useRef<string | null>(null);

  // BEST PRACTICE: Use contextSafe for GSAP animations in event handlers
  const { contextSafe } = useGSAP({ scope: videoTransitionRef });

  // Show loading screen ONLY on first load/reload if on home page
  // Skip LoadingScreen during client-side navigation to home (use normal page transition)
  useEffect(() => {
    if (isHomePage && isFirstLoadRef.current) {
      // First load on home page: show LoadingScreen, content hidden
      setShowLoadingScreen(true);
      setHasLoadingCompleted(false);
    } else {
      // Not home page OR client navigation to home: skip loading screen, show content immediately
      setShowLoadingScreen(false);
      setHasLoadingCompleted(true);
    }

    // Mark first load as complete after initial check
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
    }
  }, [isHomePage]);

  // Handle Join button click from LoadingScreen
  const handleJoinClick = async () => {
    try {
      // Start background music
      if (backgroundMusicRef.current) {
        await backgroundMusicRef.current.start();
      }

      // Small delay for music to start
      await new Promise(resolve => setTimeout(resolve, 300));

      // CRITICAL: Mark loading as completed BEFORE exit animation
      // This makes home page mount INSTANTLY while LoadingScreen animates out on top
      setHasLoadingCompleted(true);

      // CRITICAL: Wait for React to actually PAINT the home page before starting exit animation
      // Triple requestAnimationFrame ensures browser has fully rendered the new content:
      // Frame 1: React schedules re-render
      // Frame 2: React commits changes to DOM
      // Frame 3: Browser paints the home page
      // Frame 4: NOW safe to start exit animation - home is visible underneath
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Reset scroll position to top
              if (smootherInstanceRef.current) {
                smootherInstanceRef.current.scrollTop(0);
              } else {
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
              resolve();
            });
          });
        });
      });

      // Play exit animation (home page is now fully painted underneath)
      if (loadingScreenRef.current) {
        await loadingScreenRef.current.hide();
      }

      // AFTER animation completes, unmount LoadingScreen from DOM
      setShowLoadingScreen(false);
    } catch {
      // On error, still mount home and hide loading screen
      setHasLoadingCompleted(true);

      // CRITICAL: Reset scroll position even on error
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (smootherInstanceRef.current) {
            smootherInstanceRef.current.scrollTop(0);
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        });
      });

      if (loadingScreenRef.current) {
        await loadingScreenRef.current.hide();
      }

      setShowLoadingScreen(false);
    }
  };

  // Listen for video transition events from child components
  useEffect(() => {
    // ✅ BEST PRACTICE: Wrap GSAP animations with contextSafe for proper cleanup
    // contextSafe is stable and doesn't need to be in dependencies array
    const handleVideoTransition = contextSafe((event: CustomEvent<{ targetUrl: string }>) => {
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

      // When video ends, navigate to new page (overlay stays SOLID)
      // Fade-out happens ONLY when new page pathname is confirmed (see useEffect below)
      const handleVideoEnd = () => {
        // Save target path for later verification
        targetPathRef.current = targetUrl;

        // Navigate to new page (overlay remains opacity: 1)
        router.push(targetUrl);

        // Clean up video event listener immediately
        if (videoRef.current && videoEndHandlerRef.current) {
          try {
            videoRef.current.removeEventListener('ended', videoEndHandlerRef.current);
          } catch {
            // Silently ignore
          }
          videoEndHandlerRef.current = null;
        }
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
    });

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
    // ✅ contextSafe is stable and omitted from dependencies to prevent unnecessary re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // CRITICAL: Video transition overlay fade-out
  // Only fade out when new page pathname is confirmed and fully rendered
  // BEST PRACTICE: Use useGSAP for GSAP animations with dependencies
  useGSAP(() => {
    // Check if video transition is active and pathname matches target
    if (!isVideoTransitionActiveRef.current || !targetPathRef.current) {
      return;
    }

    // Verify pathname matches target (navigation completed)
    if (pathname !== targetPathRef.current) {
      return;
    }

    // CRITICAL: Wait for new page to fully mount and render
    // Triple requestAnimationFrame ensures browser has painted the new page
    // Frame 1: Route change starts
    // Frame 2: React mounts new page
    // Frame 3: Browser paints new page
    // Frame 4: NOW safe to fade out overlay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Final check that refs still exist
          if (!videoTransitionRef.current) {
            return;
          }

          const overlay = videoTransitionRef.current;

          // NOW fade out overlay - new page is fully rendered
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              // Mark video transition as complete
              isVideoTransitionActiveRef.current = false;
              targetPathRef.current = null;
            },
          });
        });
      });
    });
  }, { dependencies: [pathname], scope: videoTransitionRef });

  // Page transition: Smooth Crossfade with exit + enter animations
  // GSAP Best Practice 2025: Cinematic crossfade for premium UX
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

      // CRITICAL: Pause ScrollSmoother during page transition
      // This prevents ScrollSmoother from interfering with the page transition animation
      // Context7 GSAP docs: ScrollSmoother.paused() prevents "catch up" during custom animations
      const wasSmootherActive = !!smootherInstanceRef.current;
      if (smootherInstanceRef.current) {
        smootherInstanceRef.current.paused(true);
      }

      // Smooth Crossfade Transition Implementation
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
            // CRITICAL FIX: Wait for async content (Suspense boundaries) to resolve
            // Blog/About pages use async server components that need time to render
            // Delay animation start to ensure content is in DOM before animating
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // Double rAF ensures React has painted the new content

                // SMOOTH CROSSFADE: Create master timeline for coordinated exit + enter
                const masterTimeline = gsap.timeline({
                  onComplete: () => {
                    // CRITICAL: Use requestAnimationFrame for precise timing
                    // Context7 GSAP docs: rAF ensures browser has painted before refresh/resume
                    requestAnimationFrame(() => {
                      // Resume ScrollSmoother FIRST (if it was active)
                      if (wasSmootherActive && smootherInstanceRef.current) {
                        smootherInstanceRef.current.paused(false);
                      }

                      // THEN refresh ScrollTrigger to recalculate positions
                      // This allows new page's ScrollTrigger instances to work correctly
                      ScrollTrigger.refresh();

                      // CRITICAL FIX: Multi-stage refresh for production reliability
                      // Race condition fix: Components create ScrollTriggers at different times
                      // Production: lazy loading, code splitting, Suspense = variable timing
                      // Solution: Multiple refreshes at strategic intervals to catch ALL ScrollTriggers

                      // Stage 1: Immediate refresh for fast-mounting components (100ms)
                      setTimeout(() => {
                        ScrollTrigger.refresh();
                      }, 100);

                      // Stage 2: Medium delay for lazy-loaded components (300ms)
                      setTimeout(() => {
                        ScrollTrigger.refresh();
                      }, 300);

                      // Stage 3: Final safety net for very late components (600ms)
                      // This ensures even the slowest-mounting ScrollTriggers work in production
                      setTimeout(() => {
                        ScrollTrigger.refresh();
                      }, 600);
                    });
                  },
                });

                // ENTER ANIMATION: Pure fade with blur (no movement, no scale)
                // GSAP Best Practice: Use opacity only (GPU accelerated)
                // will-change hint for browser optimization
                gsap.set(mainContent, { willChange: 'opacity' });

                masterTimeline.fromTo(
                  mainContent,
                  {
                    opacity: 0, // Start invisible
                  },
                  {
                    opacity: 1, // Fully visible
                    duration: 1.2, // Slower for ultra-smooth feel
                    ease: 'power4.out', // GSAP Best Practice: power4 = butter smooth deceleration
                    clearProps: 'willChange', // Cleanup will-change when done
                  },
                  0, // Start immediately (no delay)
                );

                // Add subtle blur effect during transition for cinematic quality
                // Blur starts at 8px and goes to 0 for glass-like smoothness
                masterTimeline.fromTo(
                  mainContent,
                  {
                    filter: 'blur(8px)',
                  },
                  {
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power2.out',
                  },
                  0, // Run parallel with main animation
                );
              });
            });
          } else {
            // Fallback: animate entire content if data-main-content not found
            // CRITICAL FIX: Same double rAF for async content
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const masterTimeline = gsap.timeline({
                  onComplete: () => {
                    requestAnimationFrame(() => {
                      if (wasSmootherActive && smootherInstanceRef.current) {
                        smootherInstanceRef.current.paused(false);
                      }
                      ScrollTrigger.refresh();

                      setTimeout(() => {
                        ScrollTrigger.refresh();
                      }, 100);
                      setTimeout(() => {
                        ScrollTrigger.refresh();
                      }, 300);
                      setTimeout(() => {
                        ScrollTrigger.refresh();
                      }, 600);
                    });
                  },
                });

                gsap.set(smoothContentRef.current, { willChange: 'opacity' });

                masterTimeline.fromTo(
                  smoothContentRef.current,
                  {
                    opacity: 0,
                  },
                  {
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power4.out',
                    clearProps: 'willChange',
                  },
                  0,
                );

                masterTimeline.fromTo(
                  smoothContentRef.current,
                  {
                    filter: 'blur(8px)',
                  },
                  {
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power2.out',
                  },
                  0,
                );
              });
            });
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
        smooth: 1, // Match original demo config
        effects: true, // Enable parallax effects on desktop
        normalizeScroll: true, // Match original demo config
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
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          {/* Main Content Wrapper - Animated on route change */}
          {/* CRITICAL: Only render children AFTER LoadingScreen completes on home page
              This ensures the home page content doesn't mount until user clicks "Join".
              On non-home pages, children render immediately (hasLoadingCompleted = true). */}
          <div data-main-content>
            {hasLoadingCompleted ? children : null}
          </div>

          {/* Footer - Inside smooth-content but OUTSIDE data-main-content */}
          {/* This prevents footer from being animated during page transitions */}
          {/* CRITICAL: Exclude footer from portfolio page AND during LoadingScreen on home */}
          {/* Wrapped in Suspense for Cache Components compatibility (new Date() usage) */}
          {!pathname.includes('/portfolio') && hasLoadingCompleted && (
            <Suspense fallback={<div className="h-96" />}>
              <Footer />
            </Suspense>
          )}
        </div>

        {/* FloatingNavBar - OUTSIDE smooth-content so fixed positioning works */}
        {/* GSAP ScrollSmoother best practice: fixed elements must be siblings to smooth-content, not children */}
        <FloatingNavBar
          logo="/assets/images/LogoBianco.webp"
          logoAlt="Lorenzo Saini Art"
          items={navItems}
        />

        {/* Background Music Player - Fixed positioning outside smooth-content */}
        <BackgroundMusic ref={backgroundMusicRef} src="/assets/music/gymnopedie-n1-200688.mp3" />

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

      {/* Preview Wrapper - Sibling of smooth-content for fixed positioning (3D Carousel previews) */}
      {/* This matches the original demo structure where previews are outside smooth-content */}
      <div id="preview-wrapper" />

      {/* Loading Screen - Shows on every reload when on home page (z-index: 10001, above video overlay) */}
      {/* CRITICAL: Use showLoadingScreen (not hasLoadingCompleted) to keep LoadingScreen mounted during exit animation */}
      {showLoadingScreen && (
        <LoadingScreen ref={loadingScreenRef} onJoinClick={handleJoinClick} />
      )}
    </>
  );
};

export default LayoutClient;
