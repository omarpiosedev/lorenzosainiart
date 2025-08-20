'use client';

import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  const { progress, isComplete, markResourceLoaded } = useResourceLoader();

  // --- GUARDIE ---
  const doneRef = useRef(false);
  const completeOnce = () => {
    if (doneRef.current) {
      return;
    }
    doneRef.current = true;
    onComplete();
  };

  const videoMarkedRef = useRef(false);
  const handleVideoReady = () => {
    if (videoMarkedRef.current) {
      return;
    }
    videoMarkedRef.current = true;
    markResourceLoaded('video');
  };
  // ---------------

  // PRM: riduci o azzera le animazioni
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Safety timeout (più breve dell'hook)
  useEffect(() => {
    const id = setTimeout(completeOnce, 6000);
    return () => clearTimeout(id);
  }, []);

  // Entry animation con cleanup e PRM
  useLayoutEffect(() => {
    if (!containerRef.current || !contentRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: reducedMotion ? 0 : 0.5, ease: 'power2.out' },
      );

      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.8,
          delay: reducedMotion ? 0 : 0.2,
          ease: 'power2.out',
        },
      );
    });

    return () => ctx.revert(); // kill animazioni
  }, [reducedMotion]);

  // Exit animation quando completo
  useEffect(() => {
    if (!isComplete || !containerRef.current) {
      return;
    }

    const tween = gsap.to(containerRef.current, {
      opacity: 0,
      duration: reducedMotion ? 0 : 0.8,
      ease: 'power2.inOut',
      onComplete: completeOnce,
    });

    return () => {
      tween.kill();
    };
  }, [isComplete, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-60 flex items-center justify-center bg-white pointer-events-none"
      aria-hidden="true" // Hidden from screen readers as it's decorative
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center space-y-8 px-4"
      >
        {/* Video Logo */}
        <VideoLogo
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
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
