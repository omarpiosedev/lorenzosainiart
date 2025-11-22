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

  // Central image for all 6 front layers
  const centralImageSrc = '/assets/images/PortfolioHero/521bf560-6b45-43d3-8f20-b22d725c5dee_rw_3840ff89.webp';

  // Small images - SAME as old PortfolioHero.tsx (8 images)
  const smallImagesSrcs = [
    '/assets/images/PortfolioHero/0df95003-185c-4339-9b8c-d4b673e48b974bde.webp', // img-1
    '/assets/images/PortfolioHero/1d10e477-37ef-47cf-a510-e03a81f9688f_rwc_251x0x1537x2048x153788ee.webp', // img-2
    '/assets/images/PortfolioHero/521bf560-6b45-43d3-8f20-b22d725c5dee_rw_3840ff89.webp', // img-3
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

  // Animation setup - EXACTLY as GitHub reference
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;
      const frontImages = frontImagesRefs.current.filter(Boolean) as HTMLDivElement[];
      const smallImages = smallImagesRefs.current.filter(Boolean) as HTMLImageElement[];

      // Set 3D properties on small images
      gsap.set(smallImages, {
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        force3D: true,
      });

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
      {/* Title - EXACT structure from GitHub */}
      <h1 className={styles.title}>
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
