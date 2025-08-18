'use client';

import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import ProgressBar from './ProgressBar';
import VideoLogo from './VideoLogo';

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const t = useTranslations('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { progress, isComplete } = useResourceLoader();

  // Handler per quando il video può essere riprodotto
  const handleVideoCanPlay = () => {
    if (typeof window !== 'undefined' && (window as any).markVideoLoaded) {
      (window as any).markVideoLoaded();
    }
  };

  // Animazione di entrata
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0 }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.fromTo(contentRef.current, { y: 20, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
      });
    }
  }, []);

  // Animazione di uscita quando caricamento completo
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
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
