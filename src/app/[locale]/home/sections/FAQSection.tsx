'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { ShimmerLabel } from '@/components/ui';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!contentRef.current) {
        return;
      }

      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
        });
      }
    },
    { dependencies: [isOpen] },
  );

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left transition-colors hover:text-gray-600"
        aria-expanded={isOpen}
        type="button"
      >
        <span
          className="text-sm md:text-base font-normal text-black pr-6"
          style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          {question}
        </span>
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="pb-4 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const t = useTranslations('HomePage.sez6');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const questions = [
    { key: 'equipment', question: t('questions.equipment.question'), answer: t('questions.equipment.answer') },
    { key: 'delivery', question: t('questions.delivery.question'), answer: t('questions.delivery.answer') },
    { key: 'travel', question: t('questions.travel.question'), answer: t('questions.travel.answer') },
    { key: 'pricing', question: t('questions.pricing.question'), answer: t('questions.pricing.answer') },
    { key: 'services', question: t('questions.services.question'), answer: t('questions.services.answer') },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // GSAP scroll reveal animations
  useGSAP(
    () => {
      // Header animation
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // Image animation (from left)
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: -80,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // Accordion animation (from right)
      if (accordionRef.current) {
        gsap.from(accordionRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: 80,
          duration: 1,
          ease: 'power3.out',
        });
      }
    },
    { dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-12 md:py-16 px-4 md:px-8 lg:px-16"
      data-section="faq"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-8 md:mb-12">
          <ShimmerLabel className="text-xs font-medium tracking-wide mb-4">
            {t('faqLabel')}
          </ShimmerLabel>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-3"
            style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t('title')}
          </h2>
          <p
            className="text-sm md:text-base text-gray-700 leading-relaxed max-w-2xl"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Left: Image with decorative corners */}
          <div ref={imageRef} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-200">
              {/* Placeholder for camera image - replace with actual image path */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Decorative corner frames */}
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
                <path
                  d="M0 12C0 5.37258 5.37258 0 12 0V4C7.58172 4 4 7.58172 4 12H0Z"
                  fill="currentColor"
                />
              </svg>
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
                <path
                  d="M48 36C48 42.6274 42.6274 48 36 48V44C40.4183 44 44 40.4183 44 36H48Z"
                  fill="currentColor"
                />
              </svg>

              {/* Copyright text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-white text-sm font-light"
                  style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {t('imageCopyright')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div ref={accordionRef} className="order-1 lg:order-2">
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              {questions.map((item, index) => (
                <FAQItem
                  key={item.key}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onToggle={() => {
                    handleToggle(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
