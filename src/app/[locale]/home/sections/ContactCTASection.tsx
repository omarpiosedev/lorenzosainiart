'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const photoCards = [
  {
    id: 'left',
    image: '/assets/images/Cta/7c0095f7-6a6a-42f2-8920-cd6bfb7cd2426ad2.webp',
    rotation: -8,
    rotateY: 40,
    scale: 0.85,
    translateX: -180,
    translateY: 40,
    translateZ: -80,
    zIndex: 1,
  },
  {
    id: 'center',
    image: '/assets/images/Cta/3cfea3cd-fcb1-4a0b-86c0-322695c02749_rw_38401bac.webp',
    rotation: 0,
    rotateY: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    zIndex: 3,
  },
  {
    id: 'right',
    image: '/assets/images/Cta/9f568ab3-2f54-48b7-9b16-1e6550abe560_rwc_512x0x1024x1364x1024bcab.webp',
    rotation: 8,
    rotateY: -40,
    scale: 0.85,
    translateX: 180,
    translateY: 40,
    translateZ: -80,
    zIndex: 2,
  },
];

const socialLinks = [
  {
    name: 'instagram' as const,
    url: 'https://instagram.com',
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'linkedin' as const,
    url: 'https://linkedin.com',
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'youtube' as const,
    url: 'https://youtube.com',
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function ContactCTASection() {
  const t = useTranslations('HomePage.sez7');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) {
        return;
      }

      // Header animation (title + subtitle)
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // CTA button animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
        });
      }

      // Social links animation
      if (socialRef.current) {
        gsap.from(socialRef.current.children, {
          scrollTrigger: {
            trigger: socialRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }
    },
    { dependencies: [], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-16 md:py-20 lg:py-28 px-4 md:px-8 overflow-hidden"
      data-section="contact-cta"
      aria-label="Contact Call to Action"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-snug mb-6 md:mb-8 px-4 text-wrap-balanced heading-compact font-bacasime"
          >
            {t('title')}
          </h2>
          <p
            className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto px-4 text-wrap-pretty line-clamp-3 md:line-clamp-none font-lora"
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Photo Cards Stack */}
        <div
          className="relative flex items-center justify-center mb-12 md:mb-16 lg:mb-20"
          style={{
            minHeight: '400px',
            perspective: '1000px',
            perspectiveOrigin: 'center center',
          }}
        >
          {photoCards.map(card => (
            <div
              key={card.id}
              className="absolute"
              style={{
                zIndex: card.zIndex,
                transform: `translateX(${card.translateX}px) translateY(${card.translateY}px) translateZ(${card.translateZ}px) rotateY(${card.rotateY}deg) rotate(${card.rotation}deg) scale(${card.scale})`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-[28rem] overflow-hidden rounded-3xl bg-gray-200 shadow-2xl">
                <img
                  src={card.image}
                  alt={`Portfolio ${card.id}`}
                  className="w-full h-full object-cover"
                />

                {/* Decorative corner frames (top-left) */}
                <svg
                  className="absolute top-4 left-4 w-10 h-10 md:w-12 md:h-12 text-white opacity-90"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 12C0 5.37258 5.37258 0 12 0H16V4H12C7.58172 4 4 7.58172 4 12V16H0V12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0 12C0 5.37258 5.37258 0 12 0V4C7.58172 4 4 7.58172 4 12H0Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Decorative corner frames (bottom-right) */}
                <svg
                  className="absolute bottom-4 right-4 w-10 h-10 md:w-12 md:h-12 text-white opacity-90"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M48 36C48 42.6274 42.6274 48 36 48H32V44H36C40.4183 44 44 40.4183 44 36V32H48V36Z"
                    fill="currentColor"
                  />
                  <path
                    d="M48 36C48 42.6274 42.6274 48 36 48V44C40.4183 44 44 40.4183 44 36H48Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="flex justify-center mb-12 md:mb-16">
          <Link
            href="/contact"
            className="btn-fluid inline-flex items-center justify-center min-w-fit px-6 py-3 md:px-8 md:py-4 bg-black text-white rounded-full text-sm md:text-base lg:text-lg font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-xl whitespace-nowrap font-lora-medium"
          >
            {t('ctaButton')}
          </Link>
        </div>

        {/* Social Links */}
        <div
          ref={socialRef}
          className="flex flex-col items-center justify-center gap-4"
        >
          <span
            className="text-sm md:text-base text-gray-600 font-medium whitespace-nowrap font-lora-medium"
          >
            {t('socialLabel')}
          </span>
          <div className="flex items-center gap-6">
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label={t(social.name as never)}
              >
                {social.icon}
                <span
                  className="text-sm font-medium hidden sm:inline truncate max-w-[120px] font-lora-medium"
                >
                  {t(social.name as never)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
