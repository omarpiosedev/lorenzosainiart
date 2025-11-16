'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';
import { ScreenFitText } from './ScreenFitText';

// Register GSAP plugins at module level
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  // Refs for GSAP animations
  const footerRef = useRef<HTMLElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const pagesLinks = [
    { key: 'home', href: '/' },
    { key: 'portfolio', href: '/portfolio' },
    { key: 'blog', href: '/blog' },
    { key: 'about', href: '/aboutme' },
  ];

  const informationLinks = [
    { key: 'contact', href: '/contact' },
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
  ];

  // GSAP entrance animations - immediate on ALL pages (no ScrollTrigger)
  // RATIONALE: Eliminates race condition with page transitions
  // Footer is essential UI element that should be immediately visible
  useGSAP(
    () => {
      if (!mainGridRef.current || !bannerRef.current) {
        return;
      }

      // Set initial states
      gsap.set(mainGridRef.current, {
        opacity: 0,
        y: 50,
        force3D: true,
      });

      gsap.set(bannerRef.current, {
        opacity: 0,
        scale: 0.9,
        force3D: true,
      });

      // Immediate animation on mount (all pages)
      // Uses timeline for smooth sequencing with overlap
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(mainGridRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      tl.to(
        bannerRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
        },
        '-=0.8', // Start 0.8s before previous animation ends (overlap)
      );
    },
    {
      scope: footerRef,
    },
  );

  return (
    <footer ref={footerRef} className="relative bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Footer Grid */}
        <div ref={mainGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Left Section - Logo & Description */}
          <div className="lg:col-span-7">
            {/* Logo with corner frames */}
            <div className="inline-block mb-6">
              <div className="relative px-6 py-4">
                {/* Corner frames - Top Left */}
                <svg
                  className="absolute top-0 left-0 w-6 h-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 6C0 2.68629 2.68629 0 6 0H8V1H6C3.23858 1 1 3.23858 1 6V8H0V6Z" fill="currentColor" />
                </svg>

                {/* Corner frames - Top Right */}
                <svg
                  className="absolute top-0 right-0 w-6 h-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 6C24 2.68629 21.3137 0 18 0H16V1H18C20.7614 1 23 3.23858 23 6V8H24V6Z" fill="currentColor" />
                </svg>

                {/* Corner frames - Bottom Left */}
                <svg
                  className="absolute bottom-0 left-0 w-6 h-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 18C0 21.3137 2.68629 24 6 24H8V23H6C3.23858 23 1 20.7614 1 18V16H0V18Z" fill="currentColor" />
                </svg>

                {/* Corner frames - Bottom Right */}
                <svg
                  className="absolute bottom-0 right-0 w-6 h-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 18C24 21.3137 21.3137 24 18 24H16V23H18C20.7614 23 23 20.7614 23 18V16H24V18Z" fill="currentColor" />
                </svg>

                {/* Text inside frames */}
                <h3
                  className="text-2xl font-bold text-black whitespace-nowrap font-bacasime"
                >
                  Lorenzo Saini
                </h3>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md font-lora"
            >
              {t('description')}
            </p>

            {/* Copyright */}
            <p
              className="text-xs text-gray-500 font-lora"
            >
              {t('copyright', { year: currentYear })}
            </p>

            {/* Developer Credit */}
            <p
              className="text-xs text-gray-500 mt-2 font-lora"
            >
              {t('developer')}
              {' '}
              <a
                href="https://omarpioselli.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black transition-colors duration-200 underline"
              >
                omarpioselli.dev
              </a>
            </p>
          </div>

          {/* Right Section - Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            {/* Pages Column */}
            <div>
              <h4
                className="text-sm font-semibold text-black mb-4 font-lora-semibold"
              >
                {t('pages')}
              </h4>
              <ul className="space-y-2">
                {pagesLinks.map(link => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-lora"
                    >
                      {t(`nav.${link.key}` as never)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information Column */}
            <div>
              <h4
                className="text-sm font-semibold text-black mb-4 font-lora-semibold"
              >
                {t('information')}
              </h4>
              <ul className="space-y-2">
                {informationLinks.map(link => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-200 font-lora"
                    >
                      {t(`nav.${link.key}` as never)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width brand name section - OUTSIDE max-w-7xl container */}
      <div ref={bannerRef} className="w-full border-t border-gray-200 px-4">
        <ScreenFitText
          text="LORENZOSAINI"
          className="text-black font-bacasime"
          style={{
            letterSpacing: '0.15em',
            fontWeight: 700,
            transform: 'scaleY(1.3)',
          }}
        />
      </div>
    </footer>
  );
}
