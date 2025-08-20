'use client';

import { useEffect, useRef } from 'react';

type VideoLogoProps = {
  onCanPlay?: () => void;
  onLoadedData?: () => void;
  /** Facoltativo: disabilita autoplay in caso di prefers-reduced-motion o Save-Data */
  respectUserPrefs?: boolean;
};

export default function VideoLogo({
  onCanPlay,
  onLoadedData,
  respectUserPrefs = true,
}: VideoLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // Autoplay sicuro: parte solo se consentito dal browser.
    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay non consentito: il video resterà in pausa (ok per un logo)
      }
    };

    // Rispetta preferenze utente (facoltativo)
    if (respectUserPrefs) {
      const prefersReduced
        = typeof window !== 'undefined'
          && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

      const saveData
        = typeof navigator !== 'undefined'
        // @ts-expect-error: networkInformation è sperimentale
          && navigator.connection?.saveData === true;

      if (prefersReduced || saveData) {
        // Niente animazioni/video in contesti sensibili
        video.pause();
      } else {
        void tryPlay();
      }
    } else {
      void tryPlay();
    }

    return () => {
      // Cleanup per risparmiare CPU
      try {
        video.pause();
        video.currentTime = 0;
      } catch {}
    };
  }, [respectUserPrefs]);

  return (
    <div className="flex items-center justify-center pointer-events-none">
      <video
        ref={videoRef}
        className="h-32 w-auto md:h-40 lg:h-48"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster="/videos/logo-poster.jpg"
        aria-hidden="true"
        onCanPlay={onCanPlay}
        onLoadedData={onLoadedData}
      >
        {/* Preferisci WebM quando disponibile (più leggero), poi fallback MP4 */}
        <source src="/videos/Logoanimated.webm" type="video/webm" />
        <source src="/videos/Logoanimated.mp4" type="video/mp4" />
        {/* Fallback per browser senza supporto video */}
        <div className="flex items-center justify-center h-32 md:h-40 lg:h-48">
          <div className="text-2xl font-lavener text-black">Lorenzo Saini</div>
        </div>
      </video>
    </div>
  );
}
