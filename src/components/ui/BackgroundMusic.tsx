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
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused (controlled by LoadingScreen)
  const [isMuted, setIsMuted] = useState(false); // Start with sound
  const [volume, setVolume] = useState(0.3); // Lower volume
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);

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

    const savedVolume = localStorage.getItem('bgMusicVolume');
    const savedMuted = localStorage.getItem('bgMusicMuted');
    const savedPlaying = localStorage.getItem('bgMusicPlaying');
    const savedHasInteracted = localStorage.getItem('bgMusicHasInteracted');

    if (savedVolume) {
      setVolume(Number.parseFloat(savedVolume));
    }

    // Restore user preferences if they've interacted before
    if (savedHasInteracted === 'true') {
      setHasInteracted(true);
      if (savedMuted) {
        setIsMuted(savedMuted === 'true');
      }
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

    // Sync volume and mute state
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

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
      localStorage.setItem('bgMusicVolume', volume.toString());
      localStorage.setItem('bgMusicMuted', isMuted.toString());
      localStorage.setItem('bgMusicPlaying', isPlaying.toString());
      localStorage.setItem('bgMusicHasInteracted', hasInteracted.toString());
    }
  }, [isPlaying, volume, isMuted, hasInteracted]);

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

  const handleToggleMute = contextSafe(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowPlayHint(false);
    }

    const newState = !isMuted;
    setIsMuted(newState);

    // Animate mute button
    const muteBtn = document.querySelector('button[aria-label*="Mute"], button[aria-label*="Unmute"]');
    if (muteBtn) {
      gsap.to(muteBtn, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    }
  });

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowPlayHint(false);
    }
  };

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

      {/* Volume Control - Always visible */}
      <div className="flex items-center gap-3">
        <div
          ref={volumeContainerRef}
          className="flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={handleToggleMute}
            className="text-white transition-colors hover:text-gray-300"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted
              ? (
            // Muted Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                  </svg>
                )
              : (
            // Volume Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-600 accent-white"
            style={{
              background: `linear-gradient(to right, white ${volume * 100}%, rgb(75 85 99) ${volume * 100}%)`,
            }}
            aria-label="Volume"
          />
        </div>

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
    </div>
  );
};

BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;
