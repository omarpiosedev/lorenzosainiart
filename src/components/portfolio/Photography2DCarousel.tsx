'use client';

import type { PhotographyProject } from '@/data/photographyProjects';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { PhotographyTitleEffect } from './PhotographyTitleEffect';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Isomorphic layout effect for SSR safety (pattern from NavBar.tsx)
const useIsomorphicLayoutEffect
  = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Extract magic numbers as constants for maintainability
const CAROUSEL_CONFIG = {
  // radius is now calculated dynamically - see calculateDynamicRadius() function
  perspective: '4000px', // Increased to compensate for reduced radius
  cardWidth: '98vw',
  cardMaxWidth: '3200px', // Wider for horizontal emphasis
  cardHeight: '135vh',
  cardMaxHeight: '2900px',
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
  const [dynamicRadius, setDynamicRadius] = useState(2500); // State triggers re-render with calculated radius

  // Refs for text elements animation (title uses PhotographyTitleEffect, no ref needed)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const projectCardRefs = useRef<(HTMLDivElement | null)[]>([]); // For parallax effect on project cards

  // Cylinder configuration
  const numProjects = projects.length;

  // ✅ DYNAMIC: Calculate cylinder radius based on number of projects to prevent overlap
  // Formula: radius = (cardMaxWidth / 2) / tan(angle/2) + safety margin
  // Reduced margin allows cards to appear MUCH larger by bringing them closer to camera
  const calculateDynamicRadius = (projectCount: number, cardMaxWidthPx: number): number => {
    const anglePerProject = (360 / projectCount) * (Math.PI / 180); // Convert to radians
    const minRadius = (cardMaxWidthPx / 2) / Math.tan(anglePerProject / 2);
    const safetyMargin = 0.65; // 65% of minimum - very close to camera for maximum size
    return Math.round(minRadius * safetyMargin);
  };

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

    // Helper function to setup ScrollTrigger with current dimensions
    const setupScrollTrigger = () => {
      // Kill existing ScrollTrigger if present
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // ✅ RESPONSIVE: Calculate effective card width based on viewport
      // cardWidth is '98vw' with max-width of 3200px
      const viewportWidth = window.innerWidth;
      const viewportCardWidth = viewportWidth * 0.98;

      // ✅ HYBRID APPROACH: Use actual viewport width only on large screens (>2200px)
      // This prevents overlap on 2K/4K while maintaining proper spacing on MacBook
      const effectiveCardWidth = viewportCardWidth > 2200 ? Math.min(viewportCardWidth, 3200) : 3200;

      // ✅ DYNAMIC: Calculate radius using effective card width
      const calculatedRadius = calculateDynamicRadius(numProjects, effectiveCardWidth);

      // Update state to trigger re-render with correct radius
      setDynamicRadius(calculatedRadius);

      // ✅ SIMPLIFIED: Linear scroll-to-rotation mapping
      // Each project gets equal angle spacing in the cylinder
      const baseAngle = 360 / numProjects;
      const anglePerProject = baseAngle * 0.7; // Reduced by 30% for tighter spacing between projects
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
    };

    // Initial setup
    setupScrollTrigger();

    // ✅ PRODUCTION FIX: Refresh ScrollTrigger after a short delay
    // This ensures dimensions are calculated correctly on first load
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // ✅ RESPONSIVE: Re-setup on window resize for different screen sizes
    const handleResize = () => {
      setupScrollTrigger();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // ✅ BEST PRACTICE: Explicit cleanup for ScrollTrigger and listeners
    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [projects, numProjects]);

  // ✅ BEST PRACTICE: Animate button when currentIndex changes
  // Title uses PhotographyTitleEffect with motion/react
  useGSAP(
    () => {
      // Set all buttons to hidden initially
      buttonRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, { opacity: 0, scale: 0.8 });
        }
      });

      // Animate current project button
      const button = buttonRefs.current[currentIndex];

      if (button) {
        gsap.to(button, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 0.8, // After title animation completes
        });
      }
    },
    { dependencies: [currentIndex], scope: containerRef },
  );

  // ✅ Mouse parallax effect on project cards (desktop only, matches PortfolioHero pattern)
  // Applies to entire card (image + overlay), text overlays remain stationary
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      // Only enable mouse parallax on desktop (>= 1024px)
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        return;
      }

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Normalize mouse coordinates from -1 to 1 (PortfolioHero pattern)
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        // Apply parallax to project cards (image + overlay) with varying speeds for depth effect
        projectCardRefs.current.forEach((card, index) => {
          if (!card) {
            return;
          }

          // Different speeds for each card to create depth (like PortfolioHero)
          const speeds = [0.8, 0.5, 1.0, 0.6, 0.9, 0.55, 0.75, 0.85];
          const speed = speeds[index % speeds.length] || 0.7;

          // Movement (max 100px with varying speed)
          const xMove = xPercent * 100 * speed;
          const yMove = yPercent * 100 * speed;

          gsap.to(card, {
            x: xMove,
            y: yMove,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        // Kill parallax tweens and reset position for all cards
        projectCardRefs.current.forEach((card) => {
          if (card) {
            gsap.killTweensOf(card);
            gsap.set(card, { x: 0, y: 0 });
          }
        });
      };
    },
    { dependencies: [], scope: containerRef },
  );

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
      className="relative w-full bg-white overflow-hidden"
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
            // ✅ REDUCED: Tighter angle spacing for projects (70% of full circle)
            // Brings projects closer together in the cylinder
            const baseAngle = 360 / numProjects;
            const angle = baseAngle * 0.7 * index;

            return (
              <div
                key={project.id}
                className="carousel-slide absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateX(${angle}deg) translateZ(-${dynamicRadius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  width: CAROUSEL_CONFIG.cardWidth,
                  maxWidth: CAROUSEL_CONFIG.cardMaxWidth,
                  height: CAROUSEL_CONFIG.cardHeight,
                  maxHeight: CAROUSEL_CONFIG.cardMaxHeight,
                }}
              >
                {/* Project Card - Gets parallax effect */}
                <div
                  ref={(el) => {
                    projectCardRefs.current[index] = el;
                  }}
                  className="relative w-full h-full overflow-hidden bg-black"
                  style={{
                    clipPath: 'url(#pincushionShape)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform',
                  }}
                >
                  <Image
                    src={project.image}
                    alt={t(project.titleKey as never)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 95vw, 80vw"
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />

                  {/* Dark overlay for better text contrast - inherits clipPath from parent */}
                  <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                </div>

                {/* Project Title Overlay - Counter-rotate to keep text horizontal - Completely static */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-6"
                  style={{
                    transform: 'rotateZ(8deg)', // Counter-rotate to compensate cylinder's -8deg
                  }}
                >
                  <PhotographyTitleEffect
                    words={t(project.titleKey as never)}
                    isActive={index === currentIndex}
                    className="text-black text-center px-8"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: 'clamp(5rem, 14vw, 12rem)',
                      letterSpacing: '0',
                      lineHeight: 1,
                      fontWeight: 400,
                    }}
                    filter={true}
                    duration={0.6}
                    staggerDelay={0.08}
                  />
                  {/* CTA Button per progetto */}
                  <button
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={handleCTAClick}
                    className="group pointer-events-auto flex items-center justify-center border-2 border-black rounded-full transition-all duration-300 hover:scale-110 mt-4"
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
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
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
              backgroundColor: currentIndex === index ? '#000' : '#0006',
              borderRadius: '2px',
            }}
            role="img"
            aria-label={`${t(project.titleKey as never)} - Project ${index + 1} of ${numProjects}${currentIndex === index ? ' (current)' : ''}`}
          />
        ))}
      </nav>

      {/* Fade gradients - top and bottom */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-30"
        style={{
          height: '12vh',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
        style={{
          height: '12vh',
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0) 100%)',
        }}
      />
    </div>
  );
}
