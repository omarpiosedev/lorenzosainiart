'use client';

import type { PhotographyProject } from '@/data/photographyProjects';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { PhotographyTitleEffect } from './PhotographyTitleEffect';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const useIsomorphicLayoutEffect
  = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

// Carousel configuration with responsive variants
const CAROUSEL_CONFIG = {
  perspective: '4000px',
  diagonalTilt: -8,
  cylinderSafetyMargin: 0.65,
  angleSpacing: 0.7,
  scrubSmoothness: 0.8, // Lower = more responsive

  // Responsive card sizes - ONE PROJECT = ONE SCREEN (100vh)
  card: {
    mobile: {
      width: '95vw',
      maxWidth: '600px',
      height: '100vh',
      maxHeight: '100vh',
    },
    tablet: {
      width: '90vw',
      maxWidth: '1200px',
      height: '100vh',
      maxHeight: '100vh',
    },
    desktop: {
      width: '85vw',
      maxWidth: '2400px',
      height: '100vh',
      maxHeight: '100vh',
    },
  },
} as const;

// Text configuration with responsive scaling
const TEXT_CONFIG = {
  mobile: {
    fontSize: 'clamp(2rem, 10vw, 3.5rem)', // Reduced one level: 32px - 56px
    padding: '1rem',
    buttonSize: 'clamp(50px, 12vw, 60px)',
    gap: 'clamp(1rem, 4vw, 1.5rem)',
  },
  tablet: {
    fontSize: 'clamp(3.5rem, 12vw, 7rem)', // Reduced one level: 56px - 112px
    padding: '2rem',
    buttonSize: 'clamp(60px, 10vw, 70px)',
    gap: 'clamp(1.5rem, 5vw, 2rem)',
  },
  desktop: {
    fontSize: 'clamp(5rem, 14vw, 14rem)', // Reduced one level: 80px - 224px
    padding: '3rem',
    buttonSize: 'clamp(70px, 8vw, 80px)',
    gap: 'clamp(2rem, 6vw, 3rem)',
  },
} as const;

// Parallax configuration with reduced motion support
const PARALLAX_CONFIG = {
  // Mouse parallax (desktop only)
  mouse: {
    maxMovement: 50, // Reduced from 100px
    speeds: [0.4, 0.25, 0.5, 0.3, 0.45, 0.28, 0.38, 0.43], // Reduced speeds
    duration: 0.8, // Faster response (was 1.2)
    ease: 'power2.out',
  },

  // Text scroll parallax
  text: {
    mobile: 30, // Reduced movement on mobile
    tablet: 40,
    desktop: 50, // Reduced from 60px
  },
} as const;

// Fade configuration with extended ranges for smoother transitions
const FADE_CONFIG = {
  // Extended ranges for smoother fade
  fadeInStart: -0.6, // Start earlier (was -0.5)
  fadeInEnd: -0.15, // End later (was -0.2)
  fadeOutStart: 0.15, // Start earlier (was 0.2)
  fadeOutEnd: 0.6, // End later (was 0.5)
  fullVisibilityStart: -0.15,
  fullVisibilityEnd: 0.15,
} as const;

// Performance configuration
const PERF_CONFIG = {
  resizeDebounce: 150, // ms
  scrollThrottle: 16, // ~60fps
  refreshDelay: 100, // ms
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function for performance optimization
 */
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get current breakpoint based on window width
 */
function getBreakpoint(width: number): Breakpoint {
  if (width < BREAKPOINTS.mobile) {
    return 'mobile';
  }
  if (width < BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Calculate cylinder radius dynamically
 */
function calculateCylinderRadius(
  projectCount: number,
  cardMaxWidthPx: number,
  safetyMargin: number = CAROUSEL_CONFIG.cylinderSafetyMargin,
): number {
  const anglePerProject = (360 / projectCount) * (Math.PI / 180);
  const minRadius = (cardMaxWidthPx / 2) / Math.tan(anglePerProject / 2);
  return Math.round(minRadius * safetyMargin);
}

/**
 * Calculate effective card width based on viewport and breakpoint
 */
function calculateEffectiveCardWidth(
  viewportWidth: number,
  breakpoint: Breakpoint,
): number {
  const config = CAROUSEL_CONFIG.card[breakpoint];
  const viewportCardWidth = viewportWidth * (breakpoint === 'mobile' ? 0.95 : breakpoint === 'tablet' ? 0.9 : 0.85);
  const maxWidth = Number.parseInt(config.maxWidth);
  return Math.min(viewportCardWidth, maxWidth);
}

/**
 * Calculate opacity with extended fade ranges and smoothstep
 */
function calculateFadeOpacity(projectRelativeProgress: number): number {
  const { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd, fullVisibilityStart, fullVisibilityEnd }
    = FADE_CONFIG;

  // Outside visibility range
  if (projectRelativeProgress < fadeInStart || projectRelativeProgress > fadeOutEnd) {
    return 0;
  }

  // Fade IN zone (extended range)
  if (projectRelativeProgress >= fadeInStart && projectRelativeProgress < fadeInEnd) {
    const t = (projectRelativeProgress - fadeInStart) / (fadeInEnd - fadeInStart);
    return t * t * (3 - 2 * t); // smoothstep
  }

  // Full VISIBILITY zone
  if (projectRelativeProgress >= fullVisibilityStart && projectRelativeProgress <= fullVisibilityEnd) {
    return 1;
  }

  // Fade OUT zone (extended range)
  if (projectRelativeProgress > fadeOutStart && projectRelativeProgress <= fadeOutEnd) {
    const t = (fadeOutEnd - projectRelativeProgress) / (fadeOutEnd - fadeOutStart);
    return t * t * (3 - 2 * t); // smoothstep
  }

  return 0;
}

/**
 * Calculate diagonal parallax offset for text with breakpoint-aware range
 */
function calculateTextParallaxOffset(
  projectProgress: number,
  breakpoint: Breakpoint,
): { x: number; y: number } {
  const range = PARALLAX_CONFIG.text[breakpoint];
  const x = projectProgress * range * 2 - range;
  const y = -(projectProgress * range * 2 - range);
  return { x, y };
}

// ============================================================================
// COMPONENT
// ============================================================================

type Photography2DCarouselProps = {
  projects: PhotographyProject[];
};

export default function Photography2DCarousel({
  projects,
}: Photography2DCarouselProps) {
  const t = useTranslations();
  const numProjects = projects.length;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const projectCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // State
  const currentIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicRadius, setDynamicRadius] = useState(2500);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update breakpoint on mount and resize
  useEffect(() => {
    const updateBreakpoint = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Memoized text and card configurations based on breakpoint
  const textConfig = useMemo(() => TEXT_CONFIG[breakpoint], [breakpoint]);
  const cardConfig = useMemo(() => CAROUSEL_CONFIG.card[breakpoint], [breakpoint]);

  // Context-safe event handlers
  const { contextSafe } = useGSAP(
    () => {
      // Initialize GSAP context
    },
    { scope: containerRef, dependencies: [] },
  );

  // ============================================================================
  // SCROLL TRIGGER SETUP
  // ============================================================================

  useIsomorphicLayoutEffect(() => {
    if (!cylinderRef.current || !containerRef.current) {
      return;
    }

    function setupScrollTrigger() {
      // Cleanup existing ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      // Calculate cylinder dimensions
      const viewportWidth = window.innerWidth;
      const effectiveCardWidth = calculateEffectiveCardWidth(viewportWidth, breakpoint);
      const calculatedRadius = calculateCylinderRadius(numProjects, effectiveCardWidth);
      setDynamicRadius(calculatedRadius);

      // Calculate cylinder rotation parameters
      const baseAngle = 360 / numProjects;
      const anglePerProject = baseAngle * CAROUSEL_CONFIG.angleSpacing;
      const totalRotation = anglePerProject * (numProjects - 1);
      const scrollDistance = window.innerHeight * numProjects;

      // Create ScrollTrigger with optimized scrub
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: reducedMotion ? false : CAROUSEL_CONFIG.scrubSmoothness,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          handleScrollUpdate(self, totalRotation);
        },
      });
    }

    function handleScrollUpdate(self: ScrollTrigger, totalRotation: number) {
      if (!cylinderRef.current) {
        return;
      }

      // Rotate cylinder (skip if reduced motion)
      if (!reducedMotion) {
        const rotation = -self.progress * totalRotation;
        gsap.set(cylinderRef.current, {
          rotateX: rotation,
          rotateZ: CAROUSEL_CONFIG.diagonalTilt,
          force3D: true,
        });
      }

      // Update current project index
      const index = Math.min(
        Math.floor(self.progress * numProjects),
        numProjects - 1,
      );

      if (currentIndexRef.current !== index) {
        currentIndexRef.current = index;
        setCurrentIndex(index);
      }

      // Calculate text parallax offset for current project
      const projectProgress = (self.progress * numProjects) % 1;
      const parallaxOffset = reducedMotion
        ? { x: 0, y: 0 }
        : calculateTextParallaxOffset(projectProgress, breakpoint);

      // Apply fade and parallax to text overlays
      applyTextEffects(self.progress, index, parallaxOffset);
    }

    function applyTextEffects(
      scrollProgress: number,
      currentProjectIndex: number,
      parallaxOffset: { x: number; y: number },
    ) {
      textOverlayRefs.current.forEach((textOverlay, idx) => {
        if (!textOverlay) {
          return;
        }

        const projectRelativeProgress = (scrollProgress * numProjects) - idx;
        const opacity = calculateFadeOpacity(projectRelativeProgress);

        // Apply parallax only to current project text (skip if reduced motion)
        if (idx === currentProjectIndex && !reducedMotion) {
          gsap.set(textOverlay, {
            x: parallaxOffset.x,
            y: parallaxOffset.y,
            opacity,
            force3D: true,
          });
        } else {
          gsap.set(textOverlay, {
            x: 0,
            y: 0,
            opacity,
            force3D: true,
          });
        }
      });
    }

    // Initialize
    setupScrollTrigger();

    // Refresh ScrollTrigger after delay
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, PERF_CONFIG.refreshDelay);

    // Debounced resize handler
    const handleResize = debounce(() => {
      setupScrollTrigger();
      ScrollTrigger.refresh();
    }, PERF_CONFIG.resizeDebounce);

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [projects, numProjects, breakpoint, reducedMotion]);

  // ============================================================================
  // MOUSE PARALLAX (Desktop Only, Respects Reduced Motion)
  // ============================================================================

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) {
        return;
      }

      // Only enable on desktop
      if (typeof window !== 'undefined' && window.innerWidth < BREAKPOINTS.tablet) {
        return;
      }

      function handleMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Normalize to -1 to 1
        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        projectCardRefs.current.forEach((card, index) => {
          if (!card) {
            return;
          }

          // Reduced speeds for smoother, less aggressive parallax
          const speed = PARALLAX_CONFIG.mouse.speeds[index % PARALLAX_CONFIG.mouse.speeds.length] || 0.35;
          const xMove = xPercent * PARALLAX_CONFIG.mouse.maxMovement * speed;
          const yMove = yPercent * PARALLAX_CONFIG.mouse.maxMovement * speed;

          gsap.to(card, {
            x: xMove,
            y: yMove,
            duration: PARALLAX_CONFIG.mouse.duration,
            ease: PARALLAX_CONFIG.mouse.ease,
            overwrite: 'auto',
          });
        });
      }

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        projectCardRefs.current.forEach((card) => {
          if (card) {
            gsap.killTweensOf(card);
            gsap.set(card, { x: 0, y: 0 });
          }
        });
      };
    },
    { dependencies: [reducedMotion], scope: containerRef },
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleCTAClick = useCallback(
    contextSafe(() => {
      if (projects.length > 0 && projects[currentIndex]) {
        // TODO: Navigate to project detail page
        // router.push(`/portfolio/photography/${projects[currentIndex].id}`)
      }
    }),
    [contextSafe, projects, currentIndex],
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* SVG Clip Path */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="pincushionShape" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 Q 0.5,0.01 1,0 Q 0.92,0.5 1,1 Q 0.5,0.99 0,1 Q 0.08,0.5 0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* 3D Perspective Container */}
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
            transform: `rotateZ(${CAROUSEL_CONFIG.diagonalTilt}deg)`,
          }}
        >
          {projects.map((project, index) => {
            const baseAngle = 360 / numProjects;
            const angle = baseAngle * CAROUSEL_CONFIG.angleSpacing * index;

            return (
              <div
                key={project.id}
                className="carousel-slide absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateX(${angle}deg) translateZ(-${dynamicRadius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  width: cardConfig.width,
                  maxWidth: cardConfig.maxWidth,
                  height: cardConfig.height,
                  maxHeight: cardConfig.maxHeight,
                }}
              >
                {/* Project Card (Image + Overlay) */}
                <div
                  ref={(el) => {
                    projectCardRefs.current[index] = el;
                  }}
                  className="relative w-full h-full overflow-hidden bg-black"
                  style={{
                    clipPath: 'url(#pincushionShape)',
                    backfaceVisibility: 'hidden',
                    willChange: reducedMotion ? 'auto' : 'transform',
                  }}
                >
                  <Image
                    src={project.image}
                    alt={t(project.titleKey as never)}
                    fill
                    className="object-cover"
                    sizes={`(max-width: ${BREAKPOINTS.mobile}px) 95vw, (max-width: ${BREAKPOINTS.tablet}px) 90vw, 85vw`}
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                </div>

                {/* Text Overlay (Title + CTA) */}
                <div
                  ref={(el) => {
                    textOverlayRefs.current[index] = el;
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  style={{
                    transform: `rotateZ(${-CAROUSEL_CONFIG.diagonalTilt}deg)`,
                    willChange: reducedMotion ? 'auto' : 'transform, opacity',
                    gap: textConfig.gap,
                  }}
                >
                  <PhotographyTitleEffect
                    words={t(project.titleKey as never)}
                    isActive={true}
                    className="text-white text-center"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: textConfig.fontSize,
                      letterSpacing: '0',
                      lineHeight: 1,
                      fontWeight: 900,
                      padding: textConfig.padding,
                    }}
                    filter={!reducedMotion}
                    duration={reducedMotion ? 0 : 0.6}
                    staggerDelay={reducedMotion ? 0 : 0.08}
                  />

                  <button
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={handleCTAClick}
                    className="group pointer-events-auto flex items-center justify-center border-2 border-white rounded-full transition-all duration-300 hover:scale-110 btn-fluid min-w-fit"
                    style={{
                      width: textConfig.buttonSize,
                      height: textConfig.buttonSize,
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
          })}
        </div>
      </div>

      {/* Navigation Dots */}
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

      {/* Fade Gradients */}
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
