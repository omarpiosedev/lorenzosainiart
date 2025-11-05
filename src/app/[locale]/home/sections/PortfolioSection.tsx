'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { ShimmerLabel } from '@/components/ui';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

type ProjectCardProps = {
  title: string;
  date: string;
  category: string;
  imageSrc: string;
  onHover: () => void;
  onLeave: () => void;
  infoRef?: (el: HTMLDivElement | null) => void;
};

function ProjectCard({ title, date, category, imageSrc, onHover, onLeave, infoRef }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!overlayRef.current) {
        return;
      }

      if (isHovered) {
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    },
    { dependencies: [isHovered] },
  );

  return (
    <div
      className="group relative cursor-pointer bg-white rounded-2xl border border-gray-200"
      style={{ padding: '1.5rem' }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onLeave();
      }}
    >
      {/* Image Container with Corner Decorations */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
        {/* Placeholder image - replace with actual image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${imageSrc}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Hover Overlay with Plus Icon */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            opacity: 0,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Decorative corner frames - Top Left */}
        <svg
          className="absolute top-4 left-4 w-12 h-12 text-white opacity-80"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 12C0 5.37258 5.37258 0 12 0H16V4H12C7.58172 4 4 7.58172 4 12V16H0V12Z"
            fill="currentColor"
          />
        </svg>

        {/* Decorative corner frames - Top Right */}
        <svg
          className="absolute top-4 right-4 w-12 h-12 text-white opacity-80"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48 12C48 5.37258 42.6274 0 36 0H32V4H36C40.4183 4 44 7.58172 44 12V16H48V12Z"
            fill="currentColor"
          />
        </svg>

        {/* Decorative corner frames - Bottom Left */}
        <svg
          className="absolute bottom-4 left-4 w-12 h-12 text-white opacity-80"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 36C0 42.6274 5.37258 48 12 48H16V44H12C7.58172 44 4 40.4183 4 36V32H0V36Z"
            fill="currentColor"
          />
        </svg>

        {/* Decorative corner frames - Bottom Right */}
        <svg
          className="absolute bottom-4 right-4 w-12 h-12 text-white opacity-80"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48 36C48 42.6274 42.6274 48 36 48H32V44H36C40.4183 44 44 40.4183 44 36V32H48V36Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Project Info */}
      <div ref={infoRef} className="mt-4 flex items-start justify-between">
        <div>
          <h3
            className="text-lg md:text-xl font-medium text-black mb-1"
            style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {title}
          </h3>
          <p
            className="text-sm text-gray-500"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {date}
          </p>
        </div>
        <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700 tracking-wide">
          {category}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const t = useTranslations('HomePage.sez2');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cardRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstRowInfoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRowRef = (index: number) => (el: HTMLDivElement | null) => {
    cardRowRefs.current[index] = el;
  };

  const setFirstRowInfoRef = (index: number) => (el: HTMLDivElement | null) => {
    firstRowInfoRefs.current[index] = el;
  };

  const projects = [
    {
      key: 'wildBloom',
      imageSrc: '/assets/images/e963ef3c-6cd5-425d-9cad-5d5c98894215_rw_384033bd (1).webp',
    },
    {
      key: 'softMetals',
      imageSrc: '/assets/images/e963ef3c-6cd5-425d-9cad-5d5c98894215_rw_384033bd (1).webp',
    },
    {
      key: 'urbanEssence',
      imageSrc: '/assets/images/e963ef3c-6cd5-425d-9cad-5d5c98894215_rw_384033bd (1).webp',
    },
    {
      key: 'lightForms',
      imageSrc: '/assets/images/e963ef3c-6cd5-425d-9cad-5d5c98894215_rw_384033bd (1).webp',
    },
  ];

  // GSAP scroll reveal animations - Compatible with ScrollSmoother
  useGSAP(
    () => {
      // Set initial states to prevent flash
      if (headerRef.current) {
        gsap.set(headerRef.current.children, {
          opacity: 0,
          y: 50,
        });
      }

      if (featuredRef.current) {
        gsap.set(featuredRef.current.children, {
          opacity: 0,
          y: 30,
        });
      }

      // Header animation
      if (headerRef.current) {
        gsap.to(headerRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // Featured logos animation
      if (featuredRef.current) {
        gsap.to(featuredRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }

      // Pin first row (cards 0 and 1) - stays in place while second row scrolls over
      // Works on both desktop (with ScrollSmoother) and mobile (native scroll)
      if (cardRowRefs.current[0] && cardRowRefs.current[1]) {
        ScrollTrigger.create({
          trigger: cardRowRefs.current[0],
          start: 'top top',
          end: () => `+=${cardRowRefs.current[1]!.offsetHeight}`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1, // CRITICAL: Prevents pin jitter on fast scroll (mobile)
          invalidateOnRefresh: true,
        });
      }

      // Hide first row project info when second row scrolls over
      if (cardRowRefs.current[1] && firstRowInfoRefs.current.length > 0) {
        firstRowInfoRefs.current.forEach((infoEl) => {
          if (infoEl) {
            gsap.to(infoEl, {
              opacity: 0,
              y: -20,
              scrollTrigger: {
                trigger: cardRowRefs.current[1],
                start: 'top bottom',
                end: 'top center',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          }
        });
      }
    },
    { dependencies: [] },
  );

  // Microinteractions
  const { contextSafe } = useGSAP({ dependencies: [] });

  const handleProjectHover = contextSafe(() => {
    // Hover effects can be added here if needed
  });

  const handleProjectLeave = contextSafe(() => {
    // Leave effects can be added here if needed
  });

  return (
    <div data-section="portfolio" className="relative">
      {/* Header Section */}
      <section ref={sectionRef} className="relative bg-white py-16 md:py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div ref={headerRef} className="mb-12 md:mb-16 text-center">
            <ShimmerLabel className="text-xs font-medium tracking-wide mb-6">
              {t('portfolioLabel')}
            </ShimmerLabel>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4"
              style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('title')}
            </h2>
            <p
              className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('subtitle')}
            </p>
          </div>

          {/* Featured On Section */}
          <div ref={featuredRef} className="mb-0 text-center">
            <p
              className="text-sm text-gray-500 mb-3"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t('featuredOn')}
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
              {/* Logo placeholders - replace with actual logos */}
              <div className="text-xl md:text-2xl font-light text-gray-400">MILANO</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-300" />
                <div className="text-xl md:text-2xl font-medium text-gray-400">Amsterdam</div>
              </div>
              <div className="text-xl md:text-2xl font-light text-gray-400 italic">venice.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Container */}
      <div ref={gridContainerRef} className="relative">
        {/* First Row Grid - Pinned when second row scrolls over */}
        <div
          ref={setCardRowRef(0)}
          className="relative px-4 md:px-8 lg:px-16 py-16"
          style={{ zIndex: 1, willChange: 'transform' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 w-full">
              <ProjectCard
                title={t(`projects.${projects[0]!.key}.title` as any)}
                date={t(`projects.${projects[0]!.key}.date` as any)}
                category={t(`projects.${projects[0]!.key}.category` as any)}
                imageSrc={projects[0]!.imageSrc}
                onHover={handleProjectHover}
                onLeave={handleProjectLeave}
                infoRef={setFirstRowInfoRef(0)}
              />
              <ProjectCard
                title={t(`projects.${projects[1]!.key}.title` as any)}
                date={t(`projects.${projects[1]!.key}.date` as any)}
                category={t(`projects.${projects[1]!.key}.category` as any)}
                imageSrc={projects[1]!.imageSrc}
                onHover={handleProjectHover}
                onLeave={handleProjectLeave}
                infoRef={setFirstRowInfoRef(1)}
              />
            </div>
          </div>
        </div>

        {/* Second Row Grid - Scrolls naturally over pinned first row */}
        <div
          ref={setCardRowRef(1)}
          className="relative px-4 md:px-8 lg:px-16 py-16"
          style={{ zIndex: 2 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 w-full">
              <ProjectCard
                title={t(`projects.${projects[2]!.key}.title` as any)}
                date={t(`projects.${projects[2]!.key}.date` as any)}
                category={t(`projects.${projects[2]!.key}.category` as any)}
                imageSrc={projects[2]!.imageSrc}
                onHover={handleProjectHover}
                onLeave={handleProjectLeave}
              />
              <ProjectCard
                title={t(`projects.${projects[3]!.key}.title` as any)}
                date={t(`projects.${projects[3]!.key}.date` as any)}
                category={t(`projects.${projects[3]!.key}.category` as any)}
                imageSrc={projects[3]!.imageSrc}
                onHover={handleProjectHover}
                onLeave={handleProjectLeave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
