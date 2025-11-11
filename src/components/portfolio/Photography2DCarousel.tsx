'use client';

import type { PhotographyProject } from '@/data/photographyProjects';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Isomorphic layout effect for SSR safety (pattern from NavBar.tsx)
const useIsomorphicLayoutEffect
  = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Extract magic numbers as constants for maintainability
const CAROUSEL_CONFIG = {
  radius: 1200, // Distance from center (fixed for consistent perspective)
  perspective: '2500px',
  cardWidth: '95vw',
  cardMaxWidth: '1800px',
  cardHeight: '120vh',
  cardMaxHeight: '1800px',
} as const;

type Photography2DCarouselProps = {
  projects: PhotographyProject[];
};

export default function Photography2DCarousel({
  projects,
}: Photography2DCarouselProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cylinder configuration
  const numProjects = projects.length;

  // ✅ BEST PRACTICE: Use useGSAP with contextSafe for event handlers
  const { contextSafe } = useGSAP(
    () => {
      // Initialize mobile menu items as hidden (for future enhancements)
      // This pattern follows NavBar.tsx for consistency
    },
    { scope: containerRef, dependencies: [] },
  );

  // ✅ BEST PRACTICE: Use isomorphic layout effect for SSR-safe window calculations
  useIsomorphicLayoutEffect(() => {
    if (!cylinderRef.current || !containerRef.current) {
      return;
    }

    // ✅ SIMPLIFIED: Linear scroll-to-rotation mapping
    // Each project gets equal angle spacing in the cylinder
    const baseAngle = 360 / numProjects;
    const anglePerProject = baseAngle * 0.75; // Balanced spacing: not too tight, not too far
    // Total rotation needed to show all projects (from first to last)
    const totalRotation = anglePerProject * (numProjects - 1);
    // Scroll distance: exactly 1 screen (100vh) per project
    const scrollDistance = window.innerHeight * numProjects;

    // ✅ Main ScrollTrigger for cylinder rotation (rotateX)
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Linear mapping: scroll progress → cylinder rotation
        // Negative rotation for natural top-to-bottom scroll feel
        const rotation = -self.progress * totalRotation;
        gsap.set(cylinderRef.current, {
          rotateX: rotation,
          rotateZ: -8, // Maintain subtle diagonal tilt during scroll
          force3D: true,
        });

        // ✅ Calculate current project index from scroll progress
        // Map progress (0→1) directly to project index (0→numProjects-1)
        const index = Math.min(
          Math.floor(self.progress * numProjects),
          numProjects - 1,
        );

        if (currentIndexRef.current !== index) {
          currentIndexRef.current = index;
          setCurrentIndex(index);
        }
      },
    });

    // ✅ BEST PRACTICE: Explicit cleanup for ScrollTrigger
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [projects, numProjects]);

  // ✅ Context-safe CTA button click handler
  const handleCTAClick = contextSafe(() => {
    if (projects.length > 0 && projects[currentIndex]) {
      // TODO: Implement navigation to project detail page when route is available
      // Example: const currentProject = projects[currentIndex];
      // router.push(`/photography/${currentProject.id}`)
    }
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden"
      style={{
        height: '100vh',
      }}
    >
      {/* SVG Clip Path for Pincushion Shape (curved edges inward) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="pincushionShape" clipPathUnits="objectBoundingBox">
            {/* Stronger curvature on left/right sides, minimal on top/bottom */}
            <path d="M 0,0 Q 0.5,0.01 1,0 Q 0.92,0.5 1,1 Q 0.5,0.99 0,1 Q 0.08,0.5 0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Perspective Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: CAROUSEL_CONFIG.perspective,
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* 3D Cylinder */}
        <div
          ref={cylinderRef}
          className="relative"
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: 'rotateZ(-8deg)', // Subtle diagonal tilt: bottom-left to top-right
          }}
        >
          {projects.map((project, index) => {
            // ✅ SIMPLIFIED: Equal angle spacing for all projects in the cylinder
            // Balanced spacing for optimal visual separation
            const baseAngle = 360 / numProjects;
            const angle = baseAngle * 0.75 * index;

            return (
              <div
                key={project.id}
                className="carousel-slide absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateX(${angle}deg) translateZ(-${CAROUSEL_CONFIG.radius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  width: CAROUSEL_CONFIG.cardWidth,
                  maxWidth: CAROUSEL_CONFIG.cardMaxWidth,
                  height: CAROUSEL_CONFIG.cardHeight,
                  maxHeight: CAROUSEL_CONFIG.cardMaxHeight,
                }}
              >
                {/* Project Card */}
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    clipPath: 'url(#pincushionShape)',
                  }}
                >
                  <Image
                    src={project.image}
                    alt={t(project.titleKey as never)}
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
                      {t(project.labelKey as never)}
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
                      {t(project.titleKey as never)}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots - Enhanced Accessibility */}
      <nav
        className="absolute bottom-8 right-8 flex flex-col gap-3 z-10"
        aria-label="Photography projects navigation"
      >
        {projects.map((project, index) => (
          <div
            key={`dot-${project.id}`}
            className="transition-all duration-300"
            style={{
              width: currentIndex === index ? '12px' : '10px',
              height: currentIndex === index ? '12px' : '10px',
              backgroundColor: currentIndex === index ? '#fff' : '#fff6',
              borderRadius: '2px',
            }}
            role="img"
            aria-label={`${t(project.titleKey as never)} - Project ${index + 1} of ${numProjects}${currentIndex === index ? ' (current)' : ''}`}
          />
        ))}
      </nav>

      {/* Circular CTA Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <button
          type="button"
          onClick={handleCTAClick}
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
