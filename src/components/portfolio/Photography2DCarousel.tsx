'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import type { PhotographyProject } from '@/data/photographyProjects';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Photography2DCarouselProps {
  projects: PhotographyProject[];
}

export default function Photography2DCarousel({
  projects,
}: Photography2DCarouselProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(
    () => {
      if (!slidesRef.current || !containerRef.current) return;

      const slides = gsap.utils.toArray<HTMLElement>('.carousel-slide');
      if (slides.length === 0) return;

      // Position slides horizontally
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          x: i * window.innerWidth,
          opacity: i === 0 ? 1 : 0.3,
        });
      });

      const totalScrollDistance = slides.length * 1000;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          scrub: 1.5,
          pin: true,
          snap: {
            snapTo: 1 / (slides.length - 1),
            duration: 0.5,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.round(progress * (slides.length - 1));
            setCurrentIndex(newIndex);

            // Update opacity based on position
            slides.forEach((slide, i) => {
              const isCurrent = i === newIndex;
              gsap.to(slide, {
                opacity: isCurrent ? 1 : 0.3,
                scale: isCurrent ? 1 : 0.9,
                duration: 0.4,
                overwrite: 'auto',
              });
            });
          },
        },
      });

      // Animate horizontal scroll
      tl.to(slides, {
        x: (i) => (i - (slides.length - 1)) * window.innerWidth,
        ease: 'none',
      });
    },
    { scope: containerRef, dependencies: [projects] },
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      {/* 2D Horizontal Carousel Container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          ref={slidesRef}
          className="relative w-full h-full"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="carousel-slide absolute inset-0 flex items-center justify-center"
            >
              {/* Project Card with diagonal rotation */}
              <div
                className="relative"
                style={{
                  width: '60vw',
                  maxWidth: '900px',
                  height: '65vh',
                  maxHeight: '700px',
                  transform: 'rotate(15deg)',
                  transformOrigin: 'center center',
                }}
              >
                <Image
                  src={project.image}
                  alt={t(project.titleKey)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 60vw"
                  priority={index === 0}
                />

                {/* Project Title Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p
                    className="text-white/90 uppercase tracking-widest mb-4"
                    style={{
                      fontFamily: 'var(--font-lavener)',
                      fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {t(project.labelKey)}
                  </p>
                  <h2
                    className="text-white font-bold text-center px-8"
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: 'clamp(3rem, 10vw, 8rem)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {t(project.titleKey)}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
        {projects.map((_, index) => (
          <div
            key={index}
            className="transition-all duration-300"
            style={{
              width: currentIndex === index ? '12px' : '10px',
              height: currentIndex === index ? '12px' : '10px',
              backgroundColor: currentIndex === index ? '#fff' : '#fff6',
              borderRadius: '2px',
            }}
            aria-label={`Project ${index + 1}`}
          />
        ))}
      </div>

      {/* Circular CTA Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <button
          className="group pointer-events-auto flex items-center justify-center border-2 border-white rounded-full transition-all duration-300 hover:scale-110"
          style={{
            width: 'clamp(60px, 8vw, 80px)',
            height: 'clamp(60px, 8vw, 80px)',
          }}
          aria-label={t('PortfolioPage.photography.cta.ariaLabel')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
