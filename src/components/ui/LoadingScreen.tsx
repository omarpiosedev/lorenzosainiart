'use client';

import type { RefObject } from 'react';
import type { CameraIrisHandle } from './CameraIris';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import ProgressBar from './ProgressBar';
import VideoLogo from './VideoLogo';

type LoadingScreenProps = {
  onComplete: () => void;
  irisRef: RefObject<CameraIrisHandle | null>;
};

export default function LoadingScreen({ onComplete, irisRef }: LoadingScreenProps) {
  const t = useTranslations('loading');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { progress, isComplete } = useResourceLoader();

  // Safety timeout per evitare che si blocchi per sempre
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 10000); // 10 secondi timeout di sicurezza

    return () => clearTimeout(safetyTimeout);
  }, [onComplete]);

  // Handler per quando il video può essere riprodotto
  const handleVideoCanPlay = () => {
    if (typeof window !== 'undefined') {
      // Retry logic per assicurarsi che la funzione sia disponibile
      const tryMarkVideo = () => {
        if ((window as any).markVideoLoaded) {
          (window as any).markVideoLoaded();
        } else {
          // Retry dopo un piccolo delay se la funzione non è ancora disponibile
          setTimeout(tryMarkVideo, 100);
        }
      };
      tryMarkVideo();
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
    if (isComplete && irisRef.current && contentRef.current) {
      // Fai partire l'iris IMMEDIATAMENTE
      const runTransition = async () => {
        // Fade del contenuto mentre l'iris si chiude
        gsap.to(contentRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });

        // Avvia l'animazione dell'iris (chiudi + riapri)
        // L'onHalfway callback rimuoverà il LoadingScreen quando l'iris è completamente chiuso
        await irisRef.current?.open();
      };

      runTransition();
    }
  }, [isComplete]);

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
