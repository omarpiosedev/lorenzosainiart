'use client';

import type { RefObject } from 'react';
import type { CameraIrisHandle } from './CameraIris';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useResourceLoader } from '@/hooks/useResourceLoader';
import ProgressBar from './ProgressBar';
import VideoLogo from './VideoLogo';

// Register GSAP plugins at module level (best practice)
gsap.registerPlugin(useGSAP);

type LoadingScreenProps = {
  onComplete: () => void;
  irisRef: RefObject<CameraIrisHandle | null>;
};

export default function LoadingScreen({ onComplete: _onComplete, irisRef }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasStartedTransition = useRef(false);

  const { progress, isComplete } = useResourceLoader();

  // Handler per quando il video può essere riprodotto
  const handleVideoCanPlay = () => {
    if (typeof window !== 'undefined') {
      // Retry logic per assicurarsi che la funzione sia disponibile
      const tryMarkVideo = () => {
        if ((window as any).markResourceLoaded) {
          (window as any).markResourceLoaded('loading-video');
        } else {
          // Retry dopo un piccolo delay se la funzione non è ancora disponibile
          setTimeout(tryMarkVideo, 100);
        }
      };
      tryMarkVideo();
    }
  };

  // ✅ BEST PRACTICE: Use useGSAP hook instead of useEffect for React 19 compatibility
  // Automatic cleanup, prevents double-mount issues in Strict Mode
  useGSAP(
    () => {
      if (!containerRef.current || !contentRef.current) {
        return;
      }

      // Entrance animations
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
    },
    { scope: containerRef }, // Scoped queries for better performance
  );

  // Animazione di uscita quando caricamento completato

  useEffect(() => {
    // Far partire l'iris quando il caricamento è completo (solo una volta)
    if (isComplete && irisRef.current && !hasStartedTransition.current) {
      hasStartedTransition.current = true;

      const runTransition = async () => {
        // Avvia l'animazione dell'iris (chiudi + riapri)
        // L'onHalfway callback rimuoverà il LoadingScreen quando l'iris è completamente chiuso
        // NO fade out del contenuto, resta visibile fino a che l'iris si chiude
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
      </div>
    </div>
  );
}
