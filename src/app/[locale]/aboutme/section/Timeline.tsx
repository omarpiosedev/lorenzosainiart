'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function Timeline() {
  const t = useTranslations('AboutPage.timeline');
  const containerRef = useRef<HTMLElement>(null);

  // GSAP ScrollTrigger animations - clean and minimal
  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      const ctx = gsap.context(() => {
        // Animate timeline items
        gsap.utils.toArray('.timeline-item').forEach((item) => {
          gsap.from(item as HTMLElement, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item as HTMLElement,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });

        // Animate section titles
        gsap.from('.timeline-title', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline-title',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  // Timeline items in chronological order (oldest to newest)
  const timelineItems = [
    { key: 'davinci', type: 'education' as const, icon: '📚' },
    { key: 'mediaset', type: 'experience' as const, icon: '📺' },
    { key: 'sae', type: 'education' as const, icon: '🎓' },
    { key: 'mediaworld', type: 'experience' as const, icon: '🏢' },
    { key: 'freelance', type: 'experience' as const, icon: '🎬' },
  ];

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-12 md:py-16 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <h2 className="timeline-title font-bacasime text-2xl md:text-3xl text-black mb-12 md:mb-16">
          {t('title')}
        </h2>

        {/* Unified Timeline */}
        <div className="relative">
          {/* Simple vertical line */}
          <div className="absolute left-[11px] md:left-1/2 md:-ml-px top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Timeline Items */}
          <div className="space-y-10 md:space-y-12">
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const isEducation = item.type === 'education';

              const tItem = (key: string) =>
                t(`${item.type}.items.${item.key}.${key}` as any);
              const skills = t.raw(
                `${item.type}.items.${item.key}.skills` as any,
              ) as string[] | undefined;

              return (
                <div
                  key={item.key}
                  className={`timeline-item relative flex items-start ${
                    isEven
                      ? 'md:flex-row-reverse md:text-right'
                      : 'md:flex-row'
                  }`}
                >
                  {/* Simple dot */}
                  <div className="absolute left-0 md:left-1/2 md:-ml-3 w-6 h-6 bg-black rounded-full border-4 border-white flex items-center justify-center z-10">
                    <span className="text-xs">{item.icon}</span>
                  </div>

                  {/* Spacer for mobile */}
                  <div className="w-10 md:hidden shrink-0" />

                  {/* Content */}
                  <div
                    className={`flex-1 ${
                      isEven ? 'md:pr-12' : 'md:pl-12'
                    } md:w-1/2`}
                  >
                    <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl">
                      {isEducation
                        ? (
                            <>
                              {/* Education Content */}
                              <div className="mb-4">
                                <h4 className="text-lg md:text-xl font-semibold text-black mb-2">
                                  {tItem('school')}
                                </h4>
                                <p className="text-[15px] md:text-base font-medium text-black mb-1">
                                  {tItem('degree')}
                                </p>
                                <p className="text-[15px] text-gray-600">
                                  {tItem('field')}
                                </p>
                              </div>

                              <div className="text-[15px] text-gray-600 mb-4 space-y-1">
                                <p>{tItem('period')}</p>
                                <p className="font-medium text-black">
                                  Votazione:
                                  {' '}
                                  {tItem('grade')}
                                </p>
                              </div>
                            </>
                          )
                        : (
                            <>
                              {/* Experience Content */}
                              <div className="mb-4">
                                <h4 className="text-lg md:text-xl font-semibold text-black mb-2">
                                  {tItem('role')}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <span className="text-[15px] md:text-base font-medium text-black">
                                    {tItem('company')}
                                  </span>
                                  <span className="px-3 py-1 bg-gray-200 text-black text-xs font-medium rounded-full">
                                    {tItem('type')}
                                  </span>
                                </div>
                              </div>

                              <div className="text-[15px] text-gray-600 mb-4 space-y-1">
                                <p>
                                  {tItem('period')}
                                  {' '}
                                  ·
                                  {' '}
                                  {tItem('duration')}
                                </p>
                                <p>{tItem('location')}</p>
                              </div>

                              <p className="text-[15px] md:text-base text-gray-600 leading-relaxed mb-4">
                                {tItem('description')}
                              </p>
                            </>
                          )}

                      {/* Skills */}
                      {skills && skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Empty spacer for desktop alignment */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
