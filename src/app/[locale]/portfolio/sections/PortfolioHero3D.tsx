'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';
import styles from './PortfolioHero3D.module.css';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PortfolioHero3D() {
  const t = useTranslations('PortfolioPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const frontImagesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const smallImagesRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get contextSafe from useGSAP for video event handlers
  const { contextSafe } = useGSAP({ scope: containerRef });

  // Central image for all 6 front layers
  const centralImageSrc = '/assets/images/PortfolioHero/521bf560-6b45-43d3-8f20-b22d725c5dee_rw_3840ff89.webp';

  // Small images - SAME as old PortfolioHero.tsx (8 images)
  const smallImagesSrcs = [
    '/assets/images/PortfolioHero/0df95003-185c-4339-9b8c-d4b673e48b974bde.webp', // img-1
    '/assets/images/PortfolioHero/1d10e477-37ef-47cf-a510-e03a81f9688f_rwc_251x0x1537x2048x153788ee.webp', // img-2
    '/assets/images/allimages-avif/fca350ae-e988-408f-b48d-295c227f5627_rw_1920bc33.avif', // img-3
    '/assets/images/PortfolioHero/53c9c768-8380-4850-8b3f-b43f6cf07b8f_rw_1920c93c.webp', // img-4
    '/assets/images/PortfolioHero/62a73e53-e709-445b-83b3-ec4283ab3fe7_rw_19205948.webp', // img-5
    '/assets/images/PortfolioHero/6785377c-6f6d-470a-984a-512b8f994d04_rw_1920d928.webp', // img-6
    '/assets/images/PortfolioHero/6a2f7d0b-c56e-4ed9-b07b-4c703515a4a62c6d.webp', // img-7
    '/assets/images/PortfolioHero/6ff895bc-e829-44ab-8895-d5e2c069ff6a_rw_38400696.webp', // img-8
  ];

  // Front layer classes
  const frontClasses = [
    styles.front1,
    styles.front2,
    styles.front3,
    styles.front4,
    styles.front5,
    styles.front6,
  ];

  // Entrance animations - SAME as old PortfolioHero.tsx
  useGSAP(
    () => {
      if (!titleRef.current) {
        return;
      }

      const allImages = [...frontImagesRefs.current, ...smallImagesRefs.current].filter(Boolean);

      // Set initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 60,
        filter: 'blur(12px)',
        scale: 0.95,
      });

      gsap.set(allImages, {
        opacity: 0,
        scale: 0.88,
        filter: 'blur(10px)',
        y: 40,
      });

      // Timeline for staggered entrance
      const tl = gsap.timeline({
        delay: 0.4,
      });

      tl.to(allImages, {
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
      }).to(
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
      );
    },
    { scope: containerRef, dependencies: [] },
  );

  // Scroll animation setup - EXACTLY as GitHub reference + Video overlay
  useGSAP(
    () => {
      if (!containerRef.current || !videoRef.current) {
        return;
      }

      const container = containerRef.current;
      const video = videoRef.current;
      const frontImages = frontImagesRefs.current.filter(Boolean) as HTMLDivElement[];
      const smallImages = smallImagesRefs.current.filter(Boolean) as HTMLImageElement[];

      // Set 3D properties on small images
      gsap.set(smallImages, {
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        force3D: true,
      });

      // Video seamless looping handler
      const handleTimeUpdate = contextSafe!(() => {
        if (!video.duration || Number.isNaN(video.duration)) {
          return;
        }

        const loopStartTime = video.duration - 4; // Last 4 seconds
        const loopTriggerTime = video.duration - 0.1; // Trigger loop 100ms before end
        const currentTime = video.currentTime;

        if (currentTime >= loopTriggerTime) {
          video.currentTime = loopStartTime;
        }
      });

      video.addEventListener('timeupdate', handleTimeUpdate);

      // Create ScrollTrigger timeline
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            const easedProgress = gsap.parseEase('power1.inOut')(self.progress);
            container.style.setProperty('--progress', String(easedProgress));
          },
        },
      });

      // Animate small images flying towards camera (z-axis)
      timeline.to(smallImages, {
        z: '100vh',
        duration: 1,
        ease: 'power1.inOut',
        stagger: {
          amount: 0.2,
          from: 'center',
        },
      });

      // Animate front images scaling up
      timeline.to(
        frontImages,
        {
          scale: 1,
          duration: 1,
          ease: 'power1.inOut',
          delay: 0.1,
        },
        0.6,
      );

      // Remove blur from front images
      timeline.to(
        frontImages,
        {
          duration: 1,
          filter: 'blur(0px)',
          ease: 'power1.inOut',
          delay: 0.4,
          stagger: {
            amount: 0.2,
            from: 'end',
          },
        },
        0.6,
      );

      // Fade in video at the end of scroll animation
      timeline.to(
        video,
        {
          autoAlpha: 1,
          duration: 0.8,
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
        '-=0.3', // Slight overlap for smooth transition
      );

      // Cleanup
      return () => {
        if (videoRef.current) {
          try {
            videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          } catch {
            // Silently ignore if video is already removed
          }
        }
        timeline.kill();
      };
    },
    { scope: containerRef, dependencies: [] },
  );

  // Split title - Custom split for "Frammenti - di eternita"
  const titleText = t('hero.title');

  // Find "di" and split there
  const words = titleText.split(' ');
  const diIndex = words.findIndex(word => word.toLowerCase() === 'di');

  let leftWords, rightWords;
  if (diIndex !== -1) {
    // Split at "di": "Frammenti" | "di eternita"
    leftWords = words.slice(0, diIndex).join(' ');
    rightWords = words.slice(diIndex).join(' ');
  } else {
    // Fallback to middle split
    const midpoint = Math.ceil(words.length / 2);
    leftWords = words.slice(0, midpoint).join(' ');
    rightWords = words.slice(midpoint).join(' ');
  }

  return (
    <section ref={containerRef} className={styles.section}>
      {/* Video overlay - appears at the end of scroll animation */}
      <video
        ref={videoRef}
        src="/assets/videos/Partendo_da_questo_202511072258_9snja.mp4"
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{
          opacity: 0,
          visibility: 'hidden',
          zIndex: 100,
        }}
        muted
        playsInline
        preload="metadata"
      />

      {/* Title - EXACT structure from GitHub */}
      <h1 ref={titleRef} className={styles.title}>
        <span className={styles.titleLeft}>{leftWords}</span>
        {' '}
        <span className={styles.titleRight}>{rightWords}</span>
      </h1>

      {/* Section media - EXACT structure from GitHub */}
      <div className={styles.sectionMedia}>
        {/* Back image (optional background) */}
        <div className={styles.sectionMediaBack}>
          <Image
            src={centralImageSrc}
            alt="Background"
            fill
            quality={90}
            priority
          />
        </div>

        {/* 6 Front layers with different scales - EXACT from GitHub */}
        {frontClasses.map((frontClass, index) => (
          <div
            key={`front-${index + 1}`}
            ref={(el) => {
              frontImagesRefs.current[index] = el;
            }}
            className={`${styles.sectionMediaFront} ${frontClass}`}
          >
            <Image
              src={centralImageSrc}
              alt={`Front layer ${index + 1}`}
              fill
              quality={90}
              priority
            />
          </div>
        ))}
      </div>

      {/* Small images with 3D perspective - EXACT positions from GitHub CSS */}
      <div className={styles.sectionImages}>
        {smallImagesSrcs.map((src, index) => (
          <img
            key={`small-${index + 1}`}
            ref={(el) => {
              smallImagesRefs.current[index] = el;
            }}
            src={src}
            alt={`Portfolio item ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
