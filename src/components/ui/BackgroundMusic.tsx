'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

export type BackgroundMusicHandle = {
  start: () => Promise<void>;
};

type BackgroundMusicProps = {
  src: string;
  className?: string;
};

const BackgroundMusic = ({ ref, src, className = '' }: BackgroundMusicProps & { ref?: React.RefObject<BackgroundMusicHandle | null> }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused (controlled by LoadingScreen)
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const FIXED_VOLUME = 0.6; // Fixed volume at 60%

  // Expose start() method via ref for LoadingScreen to trigger
  useImperativeHandle(ref, () => ({
    start: async () => {
      if (!audioRef.current) {
        return;
      }

      try {
        setHasInteracted(true);
        setIsPlaying(true);
        await audioRef.current.play();
      } catch {
        // Autoplay blocked - user needs to click play button manually
        setIsPlaying(false);
        setShowPlayHint(true);
      }
    },
  }));

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedPlaying = localStorage.getItem('bgMusicPlaying');
    const savedHasInteracted = localStorage.getItem('bgMusicHasInteracted');

    // Restore user preferences if they've interacted before
    if (savedHasInteracted === 'true') {
      setHasInteracted(true);
      if (savedPlaying) {
        setIsPlaying(savedPlaying === 'true');
      }
    }
  }, []);

  // Sync audio element with state
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    // Set fixed volume
    audioRef.current.volume = FIXED_VOLUME;

    // Sync play/pause state (autoPlay attribute handles initial play)
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked by browser - show hint
        setIsPlaying(false);
        if (!hasInteracted) {
          setShowPlayHint(true);
        }
      });
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    // Save preferences to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('bgMusicPlaying', isPlaying.toString());
      localStorage.setItem('bgMusicHasInteracted', hasInteracted.toString());
    }
  }, [isPlaying, hasInteracted, FIXED_VOLUME]);

  // ✅ GSAP entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 1, // Appear after page loads
        },
      );
    },
    { scope: containerRef },
  );

  // ✅ Context-safe toggle animations
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleTogglePlay = contextSafe(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowPlayHint(false);
    }

    const newState = !isPlaying;
    setIsPlaying(newState);

    // Animate button
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });

      // Rotate icon smoothly
      const icon = buttonRef.current.querySelector('svg');
      if (icon) {
        gsap.to(icon, {
          rotation: newState ? 0 : 360,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 ${className}`}
      style={{ userSelect: 'none' }}
    >
      {/* Hidden audio element - controlled by LoadingScreen via ref */}
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      >
        <track kind="captions" />
      </audio>

      {/* Play hint - shows if browser blocks autoplay */}
      {showPlayHint && !hasInteracted && (
        <div className="animate-bounce rounded-lg bg-black/90 px-4 py-2 text-sm text-white backdrop-blur-sm shadow-lg">
          🎵 Click to play music
        </div>
      )}

      {/* Play/Pause Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleTogglePlay}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-black/80 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/90 hover:shadow-xl"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying
          ? (
        // Pause Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                  clipRule="evenodd"
                />
              </svg>
            )
          : (
        // Play Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
      </button>
    </div>
  );
};

BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;
