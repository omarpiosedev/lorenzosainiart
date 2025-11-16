'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { ShimmerLabel } from '@/components/ui/shimmer-label';
import { TextGenerateScrollEffect } from '@/components/ui/TextGenerateScrollEffect';

// Register GSAP plugins (best practice: register once at module level)
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PhilosophyText() {
  const t = useTranslations('HomePage.philosophy');
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP/React best practice: useGSAP hook with ScrollTrigger
  // Pin text at viewport center when section reaches top, unpin when section exits
  // This recreates original working logic: fixed while section is in viewport
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      // Find parent section (data-section="philosophy-gallery" from PhilosophyGallerySection)
      const section = containerRef.current.closest('[data-section="philosophy-gallery"]');
      if (!section) {
        return;
      }

      // Find all images in the gallery and get the last one
      const images = section.querySelectorAll('img');
      const lastImage = images[images.length - 1];

      if (!lastImage) {
        return;
      }

      // Pin text when section enters viewport, unpin when last image covers it
      ScrollTrigger.create({
        trigger: section, // Trigger based on section position
        start: 'top top', // Pin when section top reaches viewport top
        end: () => {
          // Calculate when the last image's top reaches the text's bottom
          const lastImageParent = lastImage.parentElement;
          if (!lastImageParent) {
            return 'bottom bottom';
          }

          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const imageTop = lastImageParent.getBoundingClientRect().top + window.scrollY;
          const offset = imageTop - sectionTop;

          return `+=${offset}px`;
        },
        pin: containerRef.current, // Pin this text element
        pinSpacing: false, // Don't add spacing (section handles layout)
        invalidateOnRefresh: true,
        // ✅ OPTIMIZED: Dynamic will-change management (Context7 best practice)
        // Add will-change only during animation, remove after to free GPU resources
        onEnter: () => {
          gsap.set(containerRef.current, { willChange: 'transform' });
        },
        onLeave: () => {
          gsap.set(containerRef.current, { willChange: 'auto' });
        },
        onEnterBack: () => {
          gsap.set(containerRef.current, { willChange: 'transform' });
        },
        onLeaveBack: () => {
          gsap.set(containerRef.current, { willChange: 'auto' });
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-start px-4 gap-8 z-10 pt-16 md:pt-20"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', // ✅ Changed from 100vw to fix mobile horizontal scroll
        maxWidth: '100%',
        height: '100vh',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // ✅ will-change removed - now managed dynamically by ScrollTrigger callbacks
      }}
    >
      {/* Philosophy badge */}
      <ShimmerLabel className="text-xs font-medium tracking-wide">
        {t('badge')}
      </ShimmerLabel>

      {/* Main text with GSAP TextGenerateScrollEffect animation */}
      <div className="max-w-4xl mx-auto text-center">
        <TextGenerateScrollEffect
          words={t('text')}
          className="text-xl md:text-2xl lg:text-3xl leading-tight text-black tracking-wide font-semibold text-wrap-pretty"
          duration={1}
          staggerDelay={0.08}
          animateBy="word"
          filter={true}
          scrollTriggerStart="top 90%"
          scrollTriggerEnd="+=2300"
          scrub={1}
        />
      </div>
    </div>
  );
}
