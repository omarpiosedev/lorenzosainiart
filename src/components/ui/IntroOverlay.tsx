'use client';

import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import ProgressBar from './ProgressBar';
import VideoLogo from './VideoLogo';

type IntroOverlayProps = {
  onComplete: () => void;
};

/**
 * Non-blocking intro overlay that doesn't prevent SSR content from being visible.
 * Renders on top of content but allows content to be indexed and accessible.
 */
export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const t = useTranslations('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { progress, isComplete } = useResourceLoader();

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 8000); // 8 seconds timeout

    return () => clearTimeout(safetyTimeout);
  }, [onComplete]);

  // Handler for when video can play
  const handleVideoCanPlay = () => {
    if (typeof window !== 'undefined') {
      const tryMarkVideo = () => {
        if ((window as any).markVideoLoaded) {
          (window as any).markVideoLoaded();
        } else {
          setTimeout(tryMarkVideo, 100);
        }
      };
      tryMarkVideo();
    }
  };

  // Entry animation
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
      );

      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
        },
      );
    }
  }, []);

  // Exit animation when loading complete
  useEffect(() => {
    if (isComplete && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        },
      });
    }
  }, [isComplete, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-60 flex items-center justify-center bg-white pointer-events-auto"
      aria-hidden="true" // Hidden from screen readers as it's decorative
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center space-y-8 px-4"
      >
        {/* Video Logo */}
        <VideoLogo
          onCanPlay={handleVideoCanPlay}
          onLoadedData={handleVideoCanPlay}
        />

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          className="w-full max-w-xs sm:max-w-sm"
        />

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-black/60 font-lavener text-sm">
            {t('message')}
          </p>
        </div>
      </div>
    </div>
  );
}
