'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

export type LoadingScreenHandle = {
  hide: () => Promise<void>;
};

type LoadingScreenProps = {
  onJoinClick?: () => void;
};

/**
 * LoadingScreen - Initial page load animation with resource tracking
 *
 * Displays animated Polaroid photos floating around the Lorenzo Saini logo.
 * Tracks critical resources (fonts, images) and shows "Join" button when ready.
 * Logo rotates during loading as a visual indicator.
 */
export const LoadingScreen = ({ ref, onJoinClick }: LoadingScreenProps & { ref?: React.RefObject<LoadingScreenHandle | null> }) => {
  const t = useTranslations('LoadingScreen');

  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const blurLayerRef = useRef<HTMLDivElement>(null);
  const joinButtonRef = useRef<HTMLButtonElement>(null);
  const logoRotationTweenRef = useRef<gsap.core.Tween | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [areAnimationsComplete, setAreAnimationsComplete] = useState(false);
  const [areResourcesLoaded, setAreResourcesLoaded] = useState(false);

  // Track ALL site resources loading (COMPLETE page load)
  useEffect(() => {
    let mounted = true;

    const checkResources = async () => {
      try {
        // Wait for window.load event - fires when ALL resources are loaded:
        // - HTML document
        // - Stylesheets
        // - Scripts
        // - Images
        // - Fonts
        // - Iframes
        // - Everything!
        if (document.readyState !== 'complete') {
          await new Promise<void>((resolve) => {
            const handler = () => {
              resolve();
              window.removeEventListener('load', handler);
            };
            window.addEventListener('load', handler);
          });
        }

        // Extra safety: ensure fonts are ready (usually already loaded by window.load)
        await document.fonts.ready;

        // Small delay to ensure React hydration is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        if (mounted) {
          setAreResourcesLoaded(true);
        }
      } catch {
        // On error, still mark as loaded (graceful degradation)
        if (mounted) {
          setAreResourcesLoaded(true);
        }
      }
    };

    checkResources();

    return () => {
      mounted = false;
    };
  }, []);

  // Show Join button when BOTH conditions are met:
  // 1. Entrance animations completed
  // 2. Resources loaded
  useEffect(() => {
    if (areAnimationsComplete && areResourcesLoaded) {
      setIsReady(true);
    }
  }, [areAnimationsComplete, areResourcesLoaded]);

  // Expose hide() method via ref
  useImperativeHandle(ref, () => ({
    hide: () => {
      return new Promise<void>((resolve) => {
        if (!containerRef.current || !iconRef.current || !photosRef.current) {
          resolve();
          return;
        }

        // Kill all continuous animations before exit
        const photos = photosRef.current.querySelectorAll('.polaroid-photo');
        if (logoRotationTweenRef.current) {
          logoRotationTweenRef.current.kill();
          logoRotationTweenRef.current = null;
        }
        gsap.killTweensOf([iconRef.current, ...Array.from(photos)]);

        // Create exit timeline
        const exitTl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
              containerRef.current.style.filter = 'none'; // Reset filter
            }
            resolve();
          },
        });

        // Fade out bottom shadow layer first
        if (blurLayerRef.current) {
          exitTl.to(blurLayerRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.inOut',
          });
        }

        // Fade out Join button if visible
        if (joinButtonRef.current) {
          exitTl.to(
            joinButtonRef.current,
            {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: 'power2.in',
            },
            0,
          );
        }

        // Photos get pushed up with container (synchronized exit) - ~1.2s total
        exitTl.to(
          [...Array.from(photos), iconRef.current],
          {
            y: '-=50vh', // Push photos up relative to their position
            opacity: 0.3, // Slight fade for depth
            duration: 1.0,
            ease: 'expo.in', // Accelerate as they move
            stagger: 0.02, // Slight stagger for natural flow
          },
          '-=0.15',
        );

        // Slide entire screen up WITH progressive blur effect - faster
        exitTl.to(
          containerRef.current,
          {
            yPercent: -100,
            filter: 'blur(20px)',
            duration: 1.2, // Faster exit
            ease: 'expo.inOut',
          },
          '-=1.0', // Start while photos are being pushed
        );
      });
    },
  }));

  // Animate on mount
  useGSAP(
    () => {
      if (!iconRef.current || !photosRef.current) {
        return;
      }

      const photos = photosRef.current.querySelectorAll('.polaroid-photo');

      // Set initial state - everything starts completely off-screen below viewport
      gsap.set([iconRef.current, ...Array.from(photos)], {
        y: '100vh', // Start completely below viewport
      });

      // Entrance timeline - slow and smooth
      const enterTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          // Mark animations as complete
          setAreAnimationsComplete(true);

          // Start logo rotation after entrance completes
          // Context7 GSAP Best Practice: Store tween reference for manual cleanup
          logoRotationTweenRef.current = gsap.to(iconRef.current, {
            rotation: 360,
            duration: 2,
            repeat: -1,
            ease: 'linear',
          });
        },
      });

      // Very smooth and gradual entrance
      enterTl
        .to(photosRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
        })
        .to(
          photos,
          {
            y: 0, // Move to final CSS-defined position
            duration: 2.5, // Much longer for smoother motion
            stagger: 0.15, // More gradual stagger (5 photos × 0.15 = 0.75s total stagger)
            ease: 'expo.out', // Very smooth exponential easing
          },
          '-=0.3',
        )
        .to(
          iconRef.current,
          {
            y: 0, // Move to final CSS-defined position
            opacity: 1,
            duration: 2.0, // Longer, smoother entrance
            ease: 'expo.out', // Very smooth exponential easing
          },
          '-=2.05', // Start when last 2 photos are entering
        );
    },
    {
      scope: containerRef,
    },
  );

  // Show Join button when resources are ready
  // Context7 GSAP Best Practice: Use contextSafe for animations triggered by state changes
  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => {
    if (isReady && joinButtonRef.current) {
      // Stop logo rotation
      if (logoRotationTweenRef.current) {
        gsap.to(iconRef.current, {
          rotation: 0, // Reset to 0 degrees smoothly
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            if (logoRotationTweenRef.current) {
              logoRotationTweenRef.current.kill();
              logoRotationTweenRef.current = null;
            }
          },
        });
      }

      // Show Join button with smooth fade in
      gsap.fromTo(
        joinButtonRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.3, // Small delay after logo stops rotating
        },
      );
    }
  }, [isReady]);

  // Context7 GSAP Best Practice: Wrap event handlers with contextSafe
  const handleJoinClick = contextSafe(() => {
    // Trigger callback (to start music)
    if (onJoinClick) {
      onJoinClick();
    }

    // Note: LayoutClient will call hide() via ref after music starts
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-white"
      aria-label={t('ariaLabel')}
      style={{
        boxShadow: '0 -20px 40px rgba(255, 255, 255, 0.8) inset',
        overflow: 'hidden', // ✅ Prevent polaroid photos from causing horizontal scroll on mobile
        // CRITICAL iOS FIX: Respect safe areas (notch/Dynamic Island)
        // This prevents content from showing through in the safe area regions
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        // Additional isolation to prevent content bleed-through
        isolation: 'isolate',
        willChange: 'transform, filter',
      }}
    >
      {/* Bottom fade gradient - creates soft entrance effect */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none z-[10002]"
        style={{
          background:
              'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 15%, rgba(255,255,255,0.7) 35%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Bottom edge shadow - softens transition when sliding up */}
      <div
        ref={blurLayerRef}
        className="absolute bottom-0 left-0 right-0 h-[20vh] pointer-events-none z-[10003]"
        style={{
          background:
              'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%, rgba(0,0,0,0) 100%)',
          filter: 'blur(20px)',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      />

      {/* Polaroid photos container */}
      <div ref={photosRef} className="relative w-full h-full" style={{ opacity: 0 }}>
        {/* Photo 1 - Top Left */}
        <div className="polaroid-photo absolute left-[5%] top-[12%] md:left-[13%] md:top-[20%] w-[140px] h-[180px] md:w-[170px] md:h-[210px] bg-white rounded-lg shadow-2xl p-3 md:p-4 rotate-[-12deg]">
          <div className="relative w-full h-[120px] md:h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/LoadingScreen/Polaroid 1.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 140px, 170px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 2 - Top Center */}
        <div className="polaroid-photo absolute left-[50%] translate-x-[-50%] top-[8%] md:top-[10%] w-[140px] h-[180px] md:w-[170px] md:h-[210px] bg-white rounded-lg shadow-2xl p-3 md:p-4 rotate-[2deg]">
          <div className="relative w-full h-[120px] md:h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/LoadingScreen/Polaroid2.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 140px, 170px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 3 - Top Right */}
        <div className="polaroid-photo absolute right-[5%] top-[10%] md:right-[13%] md:top-[18%] w-[140px] h-[180px] md:w-[170px] md:h-[210px] bg-white rounded-lg shadow-2xl p-3 md:p-4 rotate-[8deg]">
          <div className="relative w-full h-[120px] md:h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/LoadingScreen/Polaroid3.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 140px, 170px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 4 - Bottom Left */}
        <div className="polaroid-photo absolute left-[15%] bottom-[8%] md:left-[30%] md:bottom-[12%] w-[140px] h-[180px] md:w-[170px] md:h-[210px] bg-white rounded-lg shadow-2xl p-3 md:p-4 rotate-[15deg]">
          <div className="relative w-full h-[120px] md:h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/LoadingScreen/Polaroid4.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 140px, 170px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 5 - Bottom Right */}
        <div className="polaroid-photo absolute right-[15%] bottom-[10%] md:right-[25%] md:bottom-[18%] w-[140px] h-[180px] md:w-[170px] md:h-[210px] bg-white rounded-lg shadow-2xl p-3 md:p-4 rotate-[-8deg]">
          <div className="relative w-full h-[120px] md:h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/LoadingScreen/Polaroid5.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 140px, 170px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Logo + Button Container - Perfectly centered with flex */}
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10 flex flex-col items-center gap-8">
        {/* Lorenzo Saini Logo */}
        <div ref={iconRef} style={{ opacity: 0 }}>
          <Image
            src="/assets/images/LogoNero.webp"
            alt="Lorenzo Saini Art"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>

        {/* Join Button - Appears when resources are ready */}
        <button
          ref={joinButtonRef}
          type="button"
          onClick={handleJoinClick}
          className="px-8 py-3 bg-black text-white text-center rounded-full font-medium text-lg transition-transform hover:scale-105 active:scale-95"
          style={{ opacity: 0 }}
          aria-label={t('joinButton')}
        >
          {t('joinButton')}
        </button>
      </div>
    </div>
  );
};

LoadingScreen.displayName = 'LoadingScreen';
