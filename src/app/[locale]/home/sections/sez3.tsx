'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

export default function Sez3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('HomePage.sez3');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div ref={sectionRef} data-section="sez3" className="relative bg-white min-h-screen mt-16 md:mt-24 lg:mt-0">
      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center px-4 md:px-8 lg:px-16 pt-24 pb-16 md:py-20 lg:py-24 min-h-screen">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start lg:items-center">

          {/* Left Column */}
          <div className="space-y-8 lg:space-y-10">
            {/* Services Label */}
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide">
              {t('servicesLabel')}
            </div>

            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-wide" style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {t('title')}
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-800 leading-relaxed" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              "
              {t('subtitle')}
              "
            </p>

            {/* Services List */}
            <div className="space-y-6">
              <h3 className="text-lg font-normal text-black" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {t('servicesTitle')}
              </h3>

              <div className="space-y-4">
                {['Professional Editing', 'Edited & Unedited (RAW) Images', 'Personal and Commercial Licensing'].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-black font-normal" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t(`services.${index}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* View Portfolio Button */}
            <div className="pt-6">
              <Link
                href={`/${locale}/portfolio`}
                className="inline-flex items-center justify-center px-12 py-4 bg-black text-white font-normal rounded-full hover:bg-gray-800 transition-colors duration-200 text-base"
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                {t('viewPortfolio')}
              </Link>
            </div>
          </div>

          {/* Right Column - Service Cards */}
          <div className="space-y-6 lg:space-y-8">

            {/* Fashion & Editorial Card */}
            <div className="bg-gray-100 rounded-3xl p-6 lg:p-8 flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden">
                  <Image
                    src="/assets/images/image1.webp"
                    alt="Fashion & Editorial"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    quality={90}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold text-black mb-2" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {t('categories.fashion.title')}
                </h3>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif', fontSize: '15px', lineHeight: '20px' }}>
                  {t('categories.fashion.description')}
                </p>
              </div>
            </div>

            {/* Brand & Commercial Card */}
            <div className="bg-gray-100 rounded-3xl p-6 lg:p-8 flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden">
                  <Image
                    src="/assets/images/image2.webp"
                    alt="Brand & Commercial"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    quality={90}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold text-black mb-2" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {t('categories.brand.title')}
                </h3>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif', fontSize: '15px', lineHeight: '20px' }}>
                  {t('categories.brand.description')}
                </p>
              </div>
            </div>

            {/* Portrait & Studio Card */}
            <div className="bg-gray-100 rounded-3xl p-6 lg:p-8 flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden">
                  <Image
                    src="/assets/images/image3.webp"
                    alt="Portrait & Studio"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    quality={90}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold text-black mb-2" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {t('categories.portrait.title')}
                </h3>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif', fontSize: '15px', lineHeight: '20px' }}>
                  {t('categories.portrait.description')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
