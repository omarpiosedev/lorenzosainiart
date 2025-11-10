'use client';

import type { PhotographyProject } from '@/data/photographyProjects';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Photography3DCarouselProps = {
  projects: PhotographyProject[];
};

export default function Photography3DCarousel({
  projects,
}: Photography3DCarouselProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(
    () => {
      if (!carouselRef.current || !containerRef.current) {
        return;
      }

      const items = gsap.utils.toArray<HTMLElement>('.carousel-item');
      if (items.length === 0) {
        return;
      }

      const radius = 1100;
      const angleStep = 360 / items.length;

      // Position items in VERTICAL circle (rotationX for vertical wheel)
      items.forEach((item, i) => {
        const angle = i * angleStep;
        const radian = (angle * Math.PI) / 180;

        gsap.set(item, {
          rotationX: -angle,
          y: Math.sin(radian) * radius,
          z: Math.cos(radian) * radius - radius,
          transformOrigin: '50% 50%',
        });
      });

      // Create ScrollTrigger-controlled VERTICAL rotation
      const totalScrollDistance = items.length * 1000;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          scrub: 1.5,
          pin: true,
          snap: {
            snapTo: 1 / (items.length - 1),
            duration: 0.5,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.round(progress * (items.length - 1));
            setCurrentIndex(newIndex);

            // Update opacity and scale based on vertical position
            items.forEach((item) => {
              const currentRotationX = gsap.getProperty(item, 'rotationX') as number;
              const normalizedRotation = ((currentRotationX % 360) + 360) % 360;

              const distanceFromFront = Math.abs(normalizedRotation);
              const minDistance = Math.min(distanceFromFront, 360 - distanceFromFront);

              const isFront = minDistance < 45;
              const opacity = isFront ? 1 : 0.2;
              const scale = isFront ? 1 : 0.7;
              const blur = isFront ? 0 : 8;

              gsap.to(item, {
                opacity,
                scale,
                filter: `blur(${blur}px)`,
                duration: 0.4,
                overwrite: 'auto',
              });
            });
          },
        },
      });

      tl.to(carouselRef.current, {
        rotationX: 360,
        ease: 'none',
      });
    },
    { scope: containerRef, dependencies: [projects] },
  );

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      {/* 3D Vertical Carousel Container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          ref={carouselRef}
          className="relative"
          style={{
            width: '70vw',
            height: '80vh',
            perspective: '1500px',
            perspectiveOrigin: '50% 50%',
            transformStyle: 'preserve-3d',
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="carousel-item absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '60vw',
                maxWidth: '900px',
                height: '65vh',
                maxHeight: '700px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Project Card with diagonal rotation */}
              <div
                className="relative w-full h-full"
                style={{
                  transform: 'rotate(15deg)',
                  transformOrigin: 'center center',
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
