'use client';

import type { PhotographyProject } from '@/data/photographyProjects';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Photography2DCarouselProps = {
  projects: PhotographyProject[];
};

export default function Photography2DCarousel({
  projects,
}: Photography2DCarouselProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cylinder configuration
  const radius = 1200; // Distance from center (fixed for consistent perspective)
  const numProjects = projects.length;

  useGSAP(
    () => {
      if (!cylinderRef.current || !containerRef.current) {
        return;
      }

      // Calculate angleStep proportionally based on image dimensions (client-side only)
      const imageHeightVh = 105; // 105vh - larger images
      const imageHeight = (imageHeightVh / 100) * window.innerHeight;
      const spacingFactor = 1.6; // 60% extra space between images
      const circumference = 2 * Math.PI * radius;
      const angleStep = (imageHeight / circumference) * 360 * spacingFactor;

      // Calculate total scroll distance based on actual number of projects
      // Total rotation adjusted to keep last project centered through final screen
      const totalRotation = angleStep * (numProjects - 1.2);
      // One screen (100vh) per project
      const scrollDistance = window.innerHeight * numProjects;

      // Main ScrollTrigger for horizontal cylinder rotation (rotateX)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // Map scroll progress to continuous cylinder rotation (X-axis)
          // Negative rotation for bottom-to-top movement when scrolling down
          const rotation = -self.progress * totalRotation;
          gsap.set(cylinderRef.current, {
            rotateX: rotation,
            force3D: true,
          });

          // Update current index based on rotation (with modulo for infinite loop)
          const normalizedRotation = Math.abs(rotation) % 360;
          const index = Math.round(normalizedRotation / angleStep) % numProjects;
          setCurrentIndex(index);
        },
      });
    },
    { scope: containerRef, dependencies: [projects, numProjects, radius] },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden"
      style={{
        height: '100vh',
      }}
    >
      {/* SVG ClipPath for Pillow Shape */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="pillowShape" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0 C 0.8,-0.1 1.1,0.2 1,0.5 C 1.1,0.8 0.8,1.1 0.5,1 C 0.2,1.1 -0.1,0.8 0,0.5 C -0.1,0.2 0.2,-0.1 0.5,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Perspective Container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '2500px',
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
          }}
        >
          {projects.map((project, index) => {
            // Calculate angle for static positioning (consistent with GSAP calculation)
            const baseAngle = (360 / numProjects) * 0.8; // Approximate spacing for SSR
            const angle = index * baseAngle;

            return (
              <div
                key={project.id}
                className="carousel-slide absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateX(${angle}deg) translateZ(-${radius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  width: '95vw',
                  maxWidth: '1800px',
                  height: '105vh',
                  maxHeight: '1400px',
                }}
              >
                {/* Project Card */}
                <div
                  className="relative w-full h-full"
                  style={{
                    clipPath: 'url(#pillowShape)',
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
