'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useImperativeHandle, useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

export type LoadingScreenHandle = {
  hide: () => Promise<void>;
};

/**
 * LoadingScreen - Initial page load animation
 *
 * Displays animated Polaroid photos floating around a camera aperture icon.
 * Automatically fades out when page content is ready.
 */
export const LoadingScreen = ({ ref }: { ref: React.Ref<LoadingScreenHandle> }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const blurLayerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    hide: () => {
      return new Promise<void>((resolve) => {
        if (!containerRef.current || !iconRef.current || !photosRef.current) {
          resolve();
          return;
        }

        // Kill all continuous animations before exit
        const photos = photosRef.current.querySelectorAll('.polaroid-photo');
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
          // No continuous animations - exit starts immediately via LayoutClient
        },
      });

      // Very smooth and gradual entrance
      enterTl
        .to(photosRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
        })
        .to(photos, {
          y: 0, // Move to final CSS-defined position
          duration: 2.5, // Much longer for smoother motion
          stagger: 0.15, // More gradual stagger (5 photos × 0.15 = 0.75s total stagger)
          ease: 'expo.out', // Very smooth exponential easing
        }, '-=0.3')
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

      // Removed startContinuousAnimations - not needed for static loading screen
    },
    {
      scope: containerRef,
    },
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-white"
      aria-label="Loading"
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
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 15%, rgba(255,255,255,0.7) 35%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Bottom edge shadow - softens transition when sliding up */}
      <div
        ref={blurLayerRef}
        className="absolute bottom-0 left-0 right-0 h-[20vh] pointer-events-none z-[10003]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%, rgba(0,0,0,0) 100%)',
          filter: 'blur(20px)',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      />

      {/* Polaroid photos container */}
      <div ref={photosRef} className="relative w-full h-full" style={{ opacity: 0 }}>
        {/* Photo 1 - Top Left (blonde woman) */}
        <div className="polaroid-photo absolute left-[13%] top-[20%] w-[170px] h-[210px] bg-white rounded-lg shadow-2xl p-4 rotate-[-12deg]">
          <div className="relative w-full h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/image1.webp"
              alt=""
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 2 - Top Center (yellow turtleneck) */}
        <div className="polaroid-photo absolute left-[50%] translate-x-[-50%] top-[15%] w-[170px] h-[210px] bg-white rounded-lg shadow-2xl p-4 rotate-[2deg]">
          <div className="relative w-full h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/image2.webp"
              alt=""
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 3 - Top Right (purple headphones) */}
        <div className="polaroid-photo absolute right-[13%] top-[18%] w-[170px] h-[210px] bg-white rounded-lg shadow-2xl p-4 rotate-[8deg]">
          <div className="relative w-full h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/image3.webp"
              alt=""
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 4 - Bottom Left (white hat) */}
        <div className="polaroid-photo absolute left-[30%] bottom-[12%] w-[170px] h-[210px] bg-white rounded-lg shadow-2xl p-4 rotate-[15deg]">
          <div className="relative w-full h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/backgropund.webp"
              alt=""
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Photo 5 - Bottom Right (rooftop) */}
        <div className="polaroid-photo absolute right-[25%] bottom-[18%] w-[170px] h-[210px] bg-white rounded-lg shadow-2xl p-4 rotate-[-8deg]">
          <div className="relative w-full h-[150px] bg-gray-100 mb-2">
            <Image
              src="/assets/images/sposi.webp"
              alt=""
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Lorenzo Saini Logo - Center */}
      <div
        ref={iconRef}
        className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
        style={{ opacity: 0 }}
      >
        <Image
          src="/assets/images/LogoNero.webp"
          alt="Lorenzo Saini Art"
          width={120}
          height={120}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
};

LoadingScreen.displayName = 'LoadingScreen';
