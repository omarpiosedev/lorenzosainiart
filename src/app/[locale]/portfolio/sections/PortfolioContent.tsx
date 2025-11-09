'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PortfolioContent() {
  const sectionRef = useRef<HTMLElement>(null);

  // Reveal animation on scroll
  useGSAP(
    () => {
      if (!sectionRef.current) {
        return;
      }

      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none none',
          },
        },
      );
    },
    {
      scope: sectionRef,
      dependencies: [],
    },
  );

  return (
    <section
      ref={sectionRef}
      data-section="portfolio-content"
      className="relative w-full bg-white overflow-hidden"
      style={{
        minHeight: '100vh',
      }}
    >
      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 py-24 lg:py-32">
        {/* Empty section ready for content */}
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-black/30 text-center" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}>
            Content coming soon
          </p>
        </div>
      </div>
    </section>
  );
}
