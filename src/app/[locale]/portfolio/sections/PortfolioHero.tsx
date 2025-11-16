'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Noise from '@/components/Noise';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

// Configure ScrollTrigger for mobile iOS Safari fixes
// - ignoreMobileResize: prevents refresh when iOS address bar shows/hides
if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
}

type ImageConfig = {
  id: string;
  alt: string;
  className: string;
  src: string;
};

export default function PortfolioHero() {
  const t = useTranslations('PortfolioPage');
  const locale = useLocale();
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const scrollTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // React 19.2 compliant: use useState for boolean flags instead of useRef
  const [isEntranceComplete, setIsEntranceComplete] = useState(false);
  // Use ref instead of state to avoid triggering useGSAP re-execution
  const hasVideoPlayedOnceRef = useRef(false);

  // Get contextSafe from useGSAP for button handlers
  const { contextSafe } = useGSAP({ scope: containerRef });

  // Responsive normalizeScroll management
  // ONLY enable on desktop (>= 1024px) to avoid mobile lag
  // Mobile devices benefit from native scroll performance over forced JS thread
  // Research: ScrollSmoother with normalizeScroll causes lag/stuttering on mobile
  useGSAP(() => {
    const updateNormalizeScroll = () => {
      const isDesktop = window.innerWidth >= 1024;
      // Enable normalizeScroll on desktop, disable on mobile
      ScrollTrigger.normalizeScroll(isDesktop);
    };

    // Set initial state
    updateNormalizeScroll();

    // Update on resize (debounced by browser's requestAnimationFrame)
    window.addEventListener('resize', updateNormalizeScroll);

    return () => {
      window.removeEventListener('resize', updateNormalizeScroll);
    };
  }, { dependencies: [] }); // Run once on mount

  // Handle button click to trigger global video transition
  // React 19.2 + GSAP compliant: use contextSafe wrapper
  const handleButtonClick = contextSafe((category: 'photography' | 'video') => {
    // CRITICAL: Force video to remain visible for the global transition
    // Must be done BEFORE killing animations
    if (videoRef.current) {
      gsap.set(videoRef.current, {
        autoAlpha: 1,
        clearProps: 'none', // Prevent revert from resetting this
      });
    }

    // Kill only ScrollTriggers within this container
    // contextSafe already manages GSAP context cleanup automatically
    ScrollTrigger.getAll().forEach((trigger) => {
      if (
        trigger.trigger
        && containerRef.current?.contains(trigger.trigger as Node)
      ) {
        try {
          trigger.kill();
        } catch {
          // Silently ignore if already killed
        }
      }
    });

    // Dispatch custom event for global video transition
    const targetUrl = `/${locale}/portfolio/${category}`;
    const event = new CustomEvent('videoTransition', {
      detail: { targetUrl },
    });
    window.dispatchEvent(event);
  });

  // Mobile-first image configuration matching the reference screenshot
  const images: ImageConfig[] = [
    {
      id: 'img-1',
      alt: 'Portfolio image 1',
      src: '/assets/images/PortfolioHero/0df95003-185c-4339-9b8c-d4b673e48b974bde.webp',
      // Mobile: top-left, Desktop: maintained
      className:
        'absolute top-[-3%] left-[-2%] w-[35%] h-[23%] lg:top-[8%] lg:left-[5%] lg:w-[15%] lg:h-[40%]',
    },
    {
      id: 'img-2',
      alt: 'Portfolio image 2',
      src: '/assets/images/PortfolioHero/1d10e477-37ef-47cf-a510-e03a81f9688f_rwc_251x0x1537x2048x153788ee.webp',
      // Mobile: top-right (large), Desktop: maintained
      className:
        'absolute top-[5%] right-[2%] w-[42%] h-[32%] lg:top-[-5%] lg:left-[35%] lg:right-auto lg:w-[15%] lg:h-[35%]',
    },
    {
      id: 'img-3',
      alt: 'Portfolio image 3',
      src: '/assets/images/PortfolioHero/521bf560-6b45-43d3-8f20-b22d725c5dee_rw_3840ff89.webp',
      // Mobile: 9:16 vertical, Desktop: 16:9 horizontal (aspect-video)
      className:
        'absolute top-[58%] left-[3%] w-[34%] aspect-[9/16] lg:top-[15%] lg:left-auto lg:right-[15%] lg:w-[20%] lg:aspect-video',
    },
    {
      id: 'img-4',
      alt: 'Portfolio image 4',
      src: '/assets/images/PortfolioHero/53c9c768-8380-4850-8b3f-b43f6cf07b8f_rw_1920c93c.webp',
      // Mobile: bottom-right, Desktop: maintained
      className:
        'absolute top-[60%] right-[4%] w-[45%] h-[18%] lg:bottom-[-3%] lg:top-auto lg:left-[8%] lg:right-auto lg:w-[18%] lg:h-[38%]',
    },
    {
      id: 'img-5',
      alt: 'Portfolio image 5',
      src: '/assets/images/PortfolioHero/62a73e53-e709-445b-83b3-ec4283ab3fe7_rw_19205948.webp',
      // Mobile: bottom-center, Desktop: maintained
      className:
        'absolute top-[83%] left-[55%] w-[32%] h-[20%] lg:bottom-[10%] lg:top-auto lg:left-[32%] lg:w-[12%] lg:h-[22%]',
    },
    {
      id: 'img-6',
      alt: 'Portfolio image 6',
      src: '/assets/images/PortfolioHero/6785377c-6f6d-470a-984a-512b8f994d04_rw_1920d928.webp',
      // Mobile: hidden, Desktop: visible
      className:
        'hidden lg:block absolute lg:bottom-[-8%] lg:top-auto lg:right-[28%] lg:w-[16%] lg:h-[33%]',
    },
    {
      id: 'img-7',
      alt: 'Portfolio image 7',
      src: '/assets/images/PortfolioHero/6a2f7d0b-c56e-4ed9-b07b-4c703515a4a62c6d.webp',
      // Mobile: hidden, Desktop: visible
      className:
        'hidden lg:block absolute lg:bottom-[-10%] lg:top-auto lg:right-[-3%] lg:w-[14%] lg:h-[28%]',
    },
    {
      id: 'img-8',
      alt: 'Portfolio image 8',
      src: '/assets/images/PortfolioHero/6ff895bc-e829-44ab-8895-d5e2c069ff6a_rw_38400696.webp',
      className:
        'absolute top-[26%] left-[8%] w-[28%] h-[18%] lg:bottom-[30%] lg:top-auto lg:right-[-10%] lg:left-auto lg:w-[14%] lg:h-[33%]',
    },
  ];

  // Entrance animations
  // React 19.2 + GSAP: Use state callbacks for completion tracking
  useGSAP(
    () => {
      if (!titleRef.current || !subtitleRef.current) {
        return;
      }

      // Set initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 60,
        filter: 'blur(12px)',
        scale: 0.95,
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.98,
      });

      // Get all image items
      const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

      gsap.set(imageElements, {
        opacity: 0,
        scale: 0.88,
        filter: 'blur(10px)',
        y: 40,
      });

      // Timeline for staggered entrance
      const tl = gsap.timeline({
        delay: 0.4,
      });

      tl.to(
        imageElements,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 2.4,
          stagger: {
            amount: 1.6,
            from: 'random',
            ease: 'power1.inOut',
          },
          ease: 'expo.out',
        },
      )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 2.6,
            ease: 'expo.out',
          },
          '-=1.4',
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.8,
            ease: 'expo.out',
            onComplete: () => {
              // React 19.2 compliant: use setState instead of ref mutation
              setIsEntranceComplete(true);
            },
          },
          '-=1.6',
        );

      // CRITICAL: Complete cleanup to prevent DOM errors during navigation
      // Kill timeline BEFORE React unmounts
      return () => {
        tl.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  // Prevent scroll during entrance animation to avoid pin jumping bug
  // Critical fix for mobile: ScrollTrigger pin is created AFTER entrance completes
  // If user scrolls during entrance, pin starts from wrong position causing white screen
  useGSAP(
    () => {
      // Only apply scroll lock during entrance animation
      if (!isEntranceComplete) {
        // Save original scroll position
        const scrollY = window.scrollY;

        // Lock body scroll (iOS Safari compatible)
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
          // Restore scroll when entrance completes
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';

          // Restore scroll position
          window.scrollTo(0, scrollY);
        };
      }

      // When entrance completes, ensure body is unlocked
      // This handles the case where the cleanup might not have run
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      return undefined;
    },
    {
      dependencies: [isEntranceComplete], // Re-run when entrance state changes
    },
  );

  // Mouse parallax effect (delayed until entrance completes, excluding img-3, desktop only)
  // React 19.2 + GSAP: Use state dependency instead of setInterval polling
  useGSAP(
    () => {
      if (!containerRef.current || !isEntranceComplete) {
        return;
      }

      // Only enable mouse parallax on desktop (>= 1024px)
      if (window.innerWidth < 1024) {
        return;
      }

      const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Normalizza le coordinate del mouse da -1 a 1
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        imageElements.forEach((item, index) => {
          // Skip img-3 (index 2) - it has its own MotionPath animation
          if (index === 2) {
            return;
          }

          // Different speeds for depth effect
          const speeds = [0.8, 0.5, 1.0, 0.6, 0.9, 0.55, 0.75, 0.85];
          const speed = speeds[index] || 0.7;

          // Movimento pronunciato (max 100px)
          const xMove = xPercent * 100 * speed;
          const yMove = yPercent * 100 * speed;

          gsap.to(item, {
            x: xMove,
            y: yMove,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // CRITICAL: Complete cleanup to prevent DOM errors during navigation
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        // Kill all parallax tweens on images
        imageElements.forEach((item) => {
          gsap.killTweensOf(item);
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [isEntranceComplete], // Re-run when entrance completes
    },
  );

  // Image 3 Animation: MotionPath to center + Scale to fullscreen + Video loop
  // React 19.2 + GSAP: Use contextSafe for event listeners (Context7 best practice)
  useGSAP(
    () => {
      if (
        !img3Ref.current
        || !containerRef.current
        || !videoRef.current
        || !isEntranceComplete
      ) {
        return;
      }

      const img3 = img3Ref.current;
      const video = videoRef.current;

      // Context7 Best Practice: Use contextSafe wrapper for event handlers
      // This ensures proper cleanup and prevents memory leaks
      // contextSafe is already available from the hook at component level (line 48)
      const handleTimeUpdate = contextSafe!(() => {
        if (!video.duration || Number.isNaN(video.duration)) {
          return;
        }

        const loopStartTime = video.duration - 4; // Last 4 seconds
        const loopTriggerTime = video.duration - 0.1; // Trigger loop 100ms before end
        const currentTime = video.currentTime;

        // After first complete play, trigger seamless loop
        if (hasVideoPlayedOnceRef.current) {
          if (currentTime >= loopTriggerTime) {
            video.currentTime = loopStartTime;
          }
        } else {
          // First play: mark as complete when reaching loop trigger point
          if (currentTime >= loopTriggerTime) {
            hasVideoPlayedOnceRef.current = true;
            video.currentTime = loopStartTime;
          }
        }
      });

      video.addEventListener('timeupdate', handleTimeUpdate);

      // Reusable timeline factory to avoid code duplication (DRY principle)
      // Creates the same animation sequence for both mobile and desktop
      // Optimized: 2.5vh scroll distance (was 4vh) for faster, more responsive experience
      const createScrollTimeline = () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 2.5}`, // Reduced from 4vh to 2.5vh
            scrub: 1, // Reduced from 1.5 for more immediate response
            pin: containerRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            preventOverlaps: true,
          },
        });

        // Save timeline to ref for React 19.2 memory management
        scrollTimelineRef.current = timeline;

        // Phase 1: Move and zoom img3 to fullscreen (faster)
        timeline.to(img3, {
          left: '0',
          top: '0',
          width: '100vw',
          height: '100vh',
          ease: 'power1.inOut',
          duration: 1.5, // Reduced from 2.8 for snappier feel
        });

        // Phase 2: Fade in video over image (starts slightly before fullscreen completes)
        // autoAlpha controls both opacity and visibility for proper bidirectional scroll
        timeline.to(
          video,
          {
            autoAlpha: 1,
            duration: 1, // Reduced from 1.5 for faster transition
            ease: 'power1.inOut',
            onStart: () => {
              // Play video when it starts appearing
              if (video.paused) {
                video.play().catch((err) => {
                  console.error('Video autoplay failed:', err);
                });
              }
            },
            onReverseComplete: () => {
              // Pause and reset video when scrolling back
              video.pause();
              video.currentTime = 0;
            },
          },
          '-=0.3', // Slight overlap: video starts 0.3s before img3 completes
        );

        // Phase 3: Show buttons at the end (faster)
        // autoAlpha controls both opacity and visibility for proper bidirectional scroll
        if (buttonsRef.current) {
          timeline.fromTo(
            buttonsRef.current,
            {
              autoAlpha: 0,
              y: 40,
              scale: 0.95,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8, // Reduced from 1.2 for snappier appearance
              ease: 'expo.out',
            },
            '-=0.4', // Slight overlap with video for smoother flow
          );
        }

        return () => {}; // Cleanup for matchMedia
      };

      // Use matchMedia for responsive behavior
      // Both breakpoints use the same timeline configuration
      const mm = gsap.matchMedia();

      // Mobile configuration
      mm.add('(max-width: 1023px)', createScrollTimeline);

      // Desktop configuration
      mm.add('(min-width: 1024px)', createScrollTimeline);

      // CRITICAL: Complete cleanup to prevent DOM errors during navigation
      // Kill timeline, ScrollTriggers, event listeners, and matchMedia BEFORE React unmounts
      return () => {
        // Context7 Best Practice: Remove event listeners in cleanup
        // handleTimeUpdate is context-safe, so it will be properly cleaned up
        if (videoRef.current) {
          try {
            videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          } catch {
            // Silently ignore if video is already removed
          }
        }
        // Kill timeline and its ScrollTrigger using ref
        if (scrollTimelineRef.current) {
          try {
            // Kill the ScrollTrigger first
            if (scrollTimelineRef.current.scrollTrigger) {
              scrollTimelineRef.current.scrollTrigger.kill();
            }
            // Then kill the timeline
            scrollTimelineRef.current.kill();
            scrollTimelineRef.current = null;
          } catch {
            // Silently ignore if already killed
          }
        }
        // Kill any remaining tweens on img3 and video
        if (img3Ref.current) {
          gsap.killTweensOf(img3Ref.current);
        }
        if (videoRef.current) {
          gsap.killTweensOf(videoRef.current);
        }
        // CRITICAL: Revert matchMedia to prevent memory leak
        // This kills all animations/ScrollTriggers created by matchMedia
        mm.revert();
      };
    },
    {
      // Context7 Best Practice: Only include dependencies that NEED to trigger recreation
      // Removed hasVideoPlayedOnce - it's now a ref to prevent unwanted re-execution
      dependencies: [isEntranceComplete],
    },
  );

  return (
    <section
      ref={containerRef}
      data-section="portfolio-hero"
      className="relative w-full bg-white overflow-hidden"
      style={{
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Animated Noise Grain - covers everything including background */}
      <div
        ref={noiseRef}
        className="absolute inset-0 z-20 pointer-events-none opacity-100 mix-blend-multiply"
        style={{ transition: 'opacity 0.3s ease' }}
      >
        <Noise patternAlpha={50} patternRefreshInterval={2} patternSize={150} />
      </div>

      {/* Video overlay - appears after image 3 reaches fullscreen */}
      <video
        ref={videoRef}
        src="/assets/videos/Partendo_da_questo_202511072258_9snja.mp4"
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{
          opacity: 0,
          visibility: 'hidden',
          zIndex: 'var(--z-video-overlay)',
        }}
        muted
        playsInline
        preload="metadata"
      />

      {/* Portfolio Images - Positioned absolutely */}
      {images.map(image => (
        <div
          key={image.id}
          ref={image.id === 'img-3' ? img3Ref : null}
          className={`portfolio-image ${image.className} overflow-hidden ${
            image.id === 'img-3' ? 'fixed' : ''
          }`}
          style={{
            willChange: 'transform',
            zIndex: image.id === 'img-3' ? 'var(--z-image-focus)' : 'var(--z-elements)',
          }}
        >
          {/* Image */}
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 20vw"
            className="object-cover"
            quality={80}
            style={{
              filter: 'saturate(0.7) contrast(0.9)',
            }}
            priority={true}
            loading="eager"
          />

          {/* Dark desaturation overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: 'rgba(20, 20, 30, 0.25)',
              mixBlendMode: 'multiply',
            }}
          />
        </div>
      ))}

      {/* Central Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4">
        <h1
          ref={titleRef}
          className="text-black text-center leading-[1.1] mb-6 text-wrap-balanced heading-compact font-bacasime"
          style={{
            fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            opacity: 0,
          }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="text-wrap-pretty"
          style={{
            fontSize: 'clamp(0.875rem, 1.75vw, 1.25rem)',
            opacity: 0,
          }}
        >
          <span className="text-black/70">{t('hero.label')}</span>
        </div>
      </div>

      {/* Category Buttons - Appear at end of scroll animation */}
      <div
        ref={buttonsRef}
        className="fixed top-0 left-0 right-0 flex justify-center gap-6 px-4 pointer-events-auto"
        style={{
          paddingTop: 'clamp(6rem, 12vh, 10rem)',
          opacity: 0,
          visibility: 'hidden',
          zIndex: 'var(--z-buttons)',
        }}
      >
        <button
          type="button"
          onClick={() => handleButtonClick('photography')}
          className="group relative overflow-hidden rounded-full border-2 border-white/30 backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:scale-105 btn-fluid min-w-fit whitespace-nowrap"
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(2rem, 4vw, 3rem)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <span
            className="relative z-10 text-white transition-colors duration-500 group-hover:text-white"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1rem, 2.2vw, 1.75rem)',
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            {t('hero.buttons.photography')}
          </span>
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-white/10 scale-x-0 transition-transform duration-500 group-hover:scale-x-100 origin-left" />
        </button>

        <button
          type="button"
          onClick={() => handleButtonClick('video')}
          className="group relative overflow-hidden rounded-full border-2 border-white/30 backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:scale-105 btn-fluid min-w-fit whitespace-nowrap"
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(2rem, 4vw, 3rem)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <span
            className="relative z-10 text-white transition-colors duration-500 group-hover:text-white"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1rem, 2.2vw, 1.75rem)',
              fontWeight: 300,
              letterSpacing: '0.05em',
            }}
          >
            {t('hero.buttons.video')}
          </span>
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-white/10 scale-x-0 transition-transform duration-500 group-hover:scale-x-100 origin-left" />
        </button>
      </div>
    </section>
  );
}
