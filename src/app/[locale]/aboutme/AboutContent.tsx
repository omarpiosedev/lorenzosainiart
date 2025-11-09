'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function AboutContent() {
  const t = useTranslations('AboutPage');
  const params = useParams();
  const locale = params.locale as string;

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // GSAP animations using useGSAP hook
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        // Fade in header
        gsap.from(headerRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Animate image with scale
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
        });

        // Stagger content elements
        gsap.from(contentRef.current?.children || [], {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.4,
          ease: 'power3.out',
        });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FAFAFA] overflow-hidden"
    >
      {/* Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-transparent"
      >
        {/* Left: Name & Role */}
        <div className="flex flex-col">
          <h2 className="text-lg md:text-xl font-bold text-black">
            {t('header.name')}
          </h2>
          <p className="text-sm text-gray-600">{t('header.role')}</p>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-black flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Right: Contact Button */}
        <Link
          href={`/${locale}/contact`}
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {t('contact')}
        </Link>
      </header>

      {/* Main Section */}
      <main className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Circular Image */}
          <div ref={imageRef} className="flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden bg-gray-300">
              {/* TODO: Replace with actual portrait image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path
                    d="M4 20c0-4 3-7 8-7s8 3 8 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M12 4L12 2M12 22L12 20M4 12L2 12M22 12L20 12"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div ref={contentRef} className="flex flex-col space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex">
              <span className="px-4 py-2 bg-gray-200 text-black text-sm rounded-full">
                {t('badge')}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black leading-tight">
              {t('heading')}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              {t('description')}
            </p>

            {/* CTA Button */}
            <div>
              <Link
                href={`/${locale}/portfolio`}
                className="inline-block px-8 py-4 bg-black text-white rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-10">
        <button
          type="button"
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          ₹ Buy template
        </button>
        <a
          href="https://framer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h16v5.33H8L0 0zm0 5.33h8v5.34H0V5.33zm8 5.34L16 16H8v-5.33z" />
          </svg>
          <span>Made in Framer</span>
        </a>
      </footer>
    </div>
  );
}
