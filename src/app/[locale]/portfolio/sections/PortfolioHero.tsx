'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';
import Noise from '@/components/Noise';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

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
  const isEntranceComplete = useRef(false);
  const hasVideoPlayedOnce = useRef(false);

  // Handle button click to trigger global video transition
  const handleButtonClick = (category: 'photography' | 'video') => {
    // Kill all GSAP animations and ScrollTriggers to prevent errors during unmount
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach((trigger) => {
      try {
        trigger.kill();
      } catch {
        // Silently ignore if already killed
      }
    });

    // Dispatch custom event for global video transition
    const targetUrl = `/${locale}/portfolio/${category}`;
    const event = new CustomEvent('videoTransition', {
      detail: { targetUrl },
    });
    window.dispatchEvent(event);
  };

  // Mobile-first image configuration matching the reference screenshot
  const images: ImageConfig[] = [
    {
      id: 'img-1',
      alt: 'Portfolio image 1',
      src: '/assets/images/PortfolioHero/0df95003-185c-4339-9b8c-d4b673e48b974bde.webp',
      // Mobile: top-left, Desktop: maintained
      className:
        'absolute top-[2%] left-[2%] w-[35%] h-[23%] lg:top-[8%] lg:left-[5%] lg:w-[15%] lg:h-[40%]',
    },
    {
      id: 'img-2',
      alt: 'Portfolio image 2',
      src: '/assets/images/PortfolioHero/1d10e477-37ef-47cf-a510-e03a81f9688f_rwc_251x0x1537x2048x153788ee.webp',
      // Mobile: top-right (large), Desktop: maintained
      className:
        'absolute top-[10%] right-[2%] w-[42%] h-[32%] lg:top-[-5%] lg:left-[35%] lg:right-auto lg:w-[15%] lg:h-[35%]',
    },
    {
      id: 'img-3',
      alt: 'Portfolio image 3',
      src: '/assets/images/PortfolioHero/521bf560-6b45-43d3-8f20-b22d725c5dee_rw_3840ff89.webp',
      // Mobile: 9:16 vertical, Desktop: 16:9 horizontal (aspect-video)
      className:
        'absolute top-[48%] left-[3%] w-[34%] aspect-[9/16] lg:top-[15%] lg:left-auto lg:right-[15%] lg:w-[20%] lg:aspect-video',
    },
    {
      id: 'img-4',
      alt: 'Portfolio image 4',
      src: '/assets/images/PortfolioHero/53c9c768-8380-4850-8b3f-b43f6cf07b8f_rw_1920c93c.webp',
      // Mobile: bottom-right, Desktop: maintained
      className:
        'absolute top-[75%] right-[4%] w-[45%] h-[18%] lg:bottom-[-3%] lg:top-auto lg:left-[8%] lg:right-auto lg:w-[18%] lg:h-[38%]',
    },
    {
      id: 'img-5',
      alt: 'Portfolio image 5',
      src: '/assets/images/PortfolioHero/62a73e53-e709-445b-83b3-ec4283ab3fe7_rw_19205948.webp',
      // Mobile: bottom-center, Desktop: maintained
      className:
        'absolute top-[83%] left-[35%] w-[32%] h-[20%] lg:bottom-[10%] lg:top-auto lg:left-[32%] lg:w-[12%] lg:h-[22%]',
    },
    {
      id: 'img-6',
      alt: 'Portfolio image 6',
      src: '/assets/images/PortfolioHero/6785377c-6f6d-470a-984a-512b8f994d04_rw_1920d928.webp',
      // Mobile: hidden or very bottom, Desktop: maintained
      className:
        'absolute top-[105%] right-[28%] w-[16%] h-[15%] lg:bottom-[-8%] lg:top-auto lg:w-[16%] lg:h-[33%]',
    },
    {
      id: 'img-7',
      alt: 'Portfolio image 7',
      src: '/assets/images/PortfolioHero/6a2f7d0b-c56e-4ed9-b07b-4c703515a4a62c6d.webp',
      // Mobile: very bottom right, Desktop: maintained
      className:
        'absolute top-[110%] right-[-3%] w-[14%] h-[12%] lg:bottom-[-10%] lg:top-auto lg:w-[14%] lg:h-[28%]',
    },
    {
      id: 'img-8',
      alt: 'Portfolio image 8',
      src: '/assets/images/PortfolioHero/6ff895bc-e829-44ab-8895-d5e2c069ff6a_rw_38400696.webp',
      // Mobile: hidden or off-screen, Desktop: maintained
      className:
        'absolute top-[115%] right-[-10%] w-[14%] h-[12%] lg:bottom-[30%] lg:top-auto lg:w-[14%] lg:h-[33%]',
    },
  ];

  // Entrance animations
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
              isEntranceComplete.current = true;
            },
          },
          '-=1.6',
        );
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  // Parallax effect for images (delayed until entrance completes, excluding img-3)
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      // Wait for entrance animation to complete
      const checkInterval = setInterval(() => {
        if (isEntranceComplete.current) {
          clearInterval(checkInterval);

          const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

          imageElements.forEach((item, index) => {
            // Skip img-3 (index 2) - it has its own MotionPath animation
            if (index === 2) {
              return;
            }

            // Different parallax speeds for depth effect
            const speeds = [-60, -40, -80, -50, -70, -45, -65, -55];
            const speed = speeds[index] || -50;

            gsap.to(item, {
              y: speed,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          });
        }
      }, 100);

      return () => clearInterval(checkInterval);
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  // Mouse parallax effect (delayed until entrance completes, excluding img-3)
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      let handleMouseMove: ((e: MouseEvent) => void) | null = null;

      // Wait for entrance animation to complete
      const checkInterval = setInterval(() => {
        if (isEntranceComplete.current) {
          clearInterval(checkInterval);

          const imageElements = gsap.utils.toArray<HTMLElement>('.portfolio-image');

          handleMouseMove = (e: MouseEvent) => {
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
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (handleMouseMove) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [],
    },
  );

  // Image 3 Animation: MotionPath to center + Scale to fullscreen + Video loop
  useGSAP(
    () => {
      if (!img3Ref.current || !containerRef.current || !videoRef.current) {
        return;
      }

      let handleTimeUpdate: ((this: HTMLVideoElement, ev: Event) => void) | null = null;
      let timeline: gsap.core.Timeline | null = null;

      // Wait for entrance animation to complete
      const checkInterval = setInterval(() => {
        if (isEntranceComplete.current) {
          clearInterval(checkInterval);

          const img3 = img3Ref.current;
          const video = videoRef.current;
          if (!img3 || !video) {
            return;
          }

          const loopStartTime = video.duration - 4; // Last 4 seconds
          const loopTriggerTime = video.duration - 0.1; // Trigger loop 100ms before end

          // Use 'timeupdate' to catch loop point before video ends (prevents visual gap)
          handleTimeUpdate = () => {
            if (!video.duration) {
              return;
            }

            const currentTime = video.currentTime;

            // After first complete play, trigger loop just before the end
            if (hasVideoPlayedOnce.current) {
              if (currentTime >= loopTriggerTime) {
                video.currentTime = loopStartTime;
              }
            } else {
              // First play: mark as complete when reaching loop trigger point
              if (currentTime >= loopTriggerTime) {
                hasVideoPlayedOnce.current = true;
                video.currentTime = loopStartTime;
              }
            }
          };

          video.addEventListener('timeupdate', handleTimeUpdate);

          // Create timeline with three phases
          timeline = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: () => `+=${window.innerHeight * 4}`, // Create 4x viewport height for smooth video transition
              scrub: 2, // Higher scrub value = smoother, more delayed animation
              pin: containerRef.current, // Pin hero section during animation
              pinSpacing: true, // Add virtual scroll space to complete animation
            },
          });

          const tl = timeline;

          // Phase 1: Move to center using GSAP's xPercent/yPercent
          tl.to(img3, {
            left: '50%',
            top: '50%',
            xPercent: -50,
            yPercent: -50,
            ease: 'sine.inOut', // Very smooth easing
            duration: 1.2, // Longer duration for more smoothness
          });

          // Phase 2: Expand to fullscreen
          // Reset xPercent/yPercent and set to fullscreen
          tl.to(
            img3,
            {
              left: '0',
              top: '0',
              xPercent: 0,
              yPercent: 0,
              width: '100vw',
              height: '100vh',
              ease: 'sine.inOut', // Very smooth easing
              duration: 0.8,
              onComplete: () => {
                // Start video when image reaches fullscreen
                if (video.paused) {
                  video.play().catch((err) => {
                    console.error('Video autoplay failed:', err);
                  });
                }
              },
            },
            '>', // Start after previous animation completes
          );

          // Phase 3: Fade in video over image
          tl.to(
            video,
            {
              opacity: 1,
              duration: 1.0,
              ease: 'sine.inOut',
            },
            '>', // Start after phase 2 completes
          );

          // Phase 4: Show buttons at the end
          if (buttonsRef.current) {
            tl.fromTo(
              buttonsRef.current,
              {
                opacity: 0,
                y: 40,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: 'expo.out',
              },
              '-=0.5', // Start slightly before video fade completes
            );
          }
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (handleTimeUpdate && videoRef.current) {
          try {
            videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          } catch {
            // Silently ignore if video is already removed
          }
        }
        // Kill timeline and its ScrollTrigger to prevent errors during unmount
        if (timeline) {
          try {
            timeline.kill();
          } catch {
            // Silently ignore if already killed
          }
        }
      };
    },
    {
      dependencies: [],
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
          zIndex: 10000,
        }}
        muted
        playsInline
        preload="auto"
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
            opacity: 0,
            zIndex: image.id === 'img-3' ? 9999 : 10,
          }}
        >
          {/* Image */}
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 20vw"
            className="object-cover"
            style={{
              filter: 'saturate(0.7) contrast(0.9)',
            }}
            priority
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
          className="text-black text-center leading-[1.1] mb-6"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            letterSpacing: '0.05em',
            fontSize: 'clamp(1.8rem, 5.5vw, 4.5rem)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            opacity: 0,
          }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
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
          zIndex: 10001,
        }}
      >
        <button
          type="button"
          onClick={() => handleButtonClick('photography')}
          className="group relative overflow-hidden rounded-full border-2 border-white/30 backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:scale-105"
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(2rem, 4vw, 3rem)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            minWidth: 'clamp(10rem, 20vw, 15rem)',
          }}
        >
          <span
            className="relative z-10 text-white transition-colors duration-500 group-hover:text-white"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
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
          className="group relative overflow-hidden rounded-full border-2 border-white/30 backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:scale-105"
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(2rem, 4vw, 3rem)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            minWidth: 'clamp(10rem, 20vw, 15rem)',
          }}
        >
          <span
            className="relative z-10 text-white transition-colors duration-500 group-hover:text-white"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
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
