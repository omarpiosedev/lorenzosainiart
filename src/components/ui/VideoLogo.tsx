'use client';

import { useEffect, useRef } from 'react';

type VideoLogoProps = {
  onCanPlay?: () => void;
  onLoadedData?: () => void;
};

export default function VideoLogo({ onCanPlay, onLoadedData }: VideoLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // Forza il loop continuo durante tutto il caricamento
    const handleTimeUpdate = () => {
      // Se il video sta per finire, riavvia da 0
      if (video.duration && video.currentTime >= video.duration - 0.1) {
        video.currentTime = 0;
      }
    };

    const handleCanPlay = () => {
      onCanPlay?.();
      // Notifica il resource loader che il video è pronto
      if (typeof window !== 'undefined' && (window as any).markVideoLoaded) {
        (window as any).markVideoLoaded();
      }
    };

    const handleLoadedData = () => {
      onLoadedData?.();
      // Notifica anche qui per sicurezza
      if (typeof window !== 'undefined' && (window as any).markVideoLoaded) {
        (window as any).markVideoLoaded();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    // Avvia il video automaticamente
    video.play().catch((error) => {
      console.warn('Video autoplay failed:', error);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [onCanPlay, onLoadedData]);

  return (
    <div className="flex items-center justify-center">
      <video
        ref={videoRef}
        className="h-32 w-auto md:h-40 lg:h-48"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        aria-label="Lorenzo Saini Logo"
      >
        <source src="/videos/Logoanimated.mp4" type="video/mp4" />
        {/* Fallback per browser senza video support */}
        <div className="flex items-center justify-center h-32 md:h-40 lg:h-48">
          <div className="text-2xl font-lavener text-black">Lorenzo Saini</div>
        </div>
      </video>
    </div>
  );
}
