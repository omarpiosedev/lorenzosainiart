'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export default function Sez4() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('HomePage.sez4');

  return (
    <div ref={sectionRef} data-section="sez4" className="relative bg-white min-h-screen">
      {/* Desktop Layout - Scales proportionally based on 1920x1080 design */}
      <div className="hidden xl:block">
        {/* Benefits Button - Proportional scaling */}
        <div
          className="absolute"
          style={{
            top: '8.33vh', // ~90px / 1080px (raised from 116px)
            left: '47.14vw', // 905px / 1920px
            width: '5.73vw', // 110px / 1920px
            height: '3.98vh', // 43px / 1080px
          }}
        >
          <div className="inline-flex items-center justify-center w-full h-full bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide">
            {t('benefitsLabel')}
          </div>
        </div>

        {/* Title - Proportional scaling */}
        <div
          className="absolute"
          style={{
            top: '13.89vh', // ~150px / 1080px (raised from 172px)
            left: '38.54vw', // 740px / 1920px
            width: '22.86vw', // 439px / 1920px
            height: '8.33vh', // 90px / 1080px
          }}
        >
          <h2
            className="font-bold text-black leading-tight text-center flex items-center justify-center w-full h-full"
            style={{
              fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '3.33vw', // 64px / 1920px, scales proportionally
            }}
          >
            {t('title')}
          </h2>
        </div>

        {/* Subtitle - Proportional scaling */}
        <div
          className="absolute"
          style={{
            top: '24.07vh', // ~260px / 1080px (raised from 290px)
            left: '35.99vw', // 691px / 1920px
            width: '28.02vw', // 538px / 1920px
            height: '5.56vh', // 60px / 1080px
          }}
        >
          <p
            className="text-gray-800 leading-relaxed text-center flex items-center justify-center w-full h-full"
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '1.25vw', // Proportional font size
            }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* First 3 Cards - Desktop Layout - Empty */}
        {/* Card 1 */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '35.19vh', // 380px / 1080px
            left: '22.14vw', // 425px / 1920px
            width: '17.66vw', // 339px / 1920px
            height: '40.19vh', // 434px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 2 */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '35.19vh', // 380px / 1080px
            left: '41.15vw', // 425px + 339px + 26px = 790px / 1920px
            width: '17.66vw', // 339px / 1920px
            height: '40.19vh', // 434px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 3 */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '35.19vh', // 380px / 1080px
            left: '60.16vw', // 425px + 339px + 26px + 339px + 26px = 1155px / 1920px
            width: '17.66vw', // 339px / 1920px
            height: '40.19vh', // 434px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 4 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '78.52vh', // 848px / 1080px
            left: '22.14vw', // 425px / 1920px
            width: '17.66vw', // 339px / 1920px
            height: '34.35vh', // 371px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 5 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '78.52vh', // 848px / 1080px
            left: '41.15vw', // 790px / 1920px
            width: '36.72vw', // 705px / 1920px
            height: '18.33vh', // 198px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 6 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '98.61vh', // 1065px / 1080px
            left: '41.15vw', // 790px / 1920px
            width: '17.76vw', // 341px / 1920px
            height: '14.26vh', // 154px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 7 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl"
          style={{
            top: '98.61vh', // 1065px / 1080px
            left: '60.21vw', // 1156px / 1920px
            width: '17.76vw', // 341px / 1920px
            height: '14.26vh', // 154px / 1080px
          }}
        >
          {/* Empty card - ready for content */}
        </div>
      </div>

      {/* Mobile/Tablet responsive layout */}
      <div className="xl:hidden min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-start pt-16 sm:pt-20 lg:pt-24">

          {/* Benefits Button - Mobile/Tablet */}
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700 tracking-wide mb-8 sm:mb-12">
            {t('benefitsLabel')}
          </div>

          {/* Title - Mobile/Tablet */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight text-center mb-6 sm:mb-8 lg:mb-10"
            style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t('title')}
          </h2>

          {/* Subtitle - Mobile/Tablet */}
          <p
            className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t('subtitle')}
          </p>

          {/* Cards - Mobile/Tablet Layout - Empty (All stacked vertically) */}
          <div className="flex flex-col gap-6 w-full max-w-sm sm:max-w-lg lg:max-w-xl">

            {/* Card 1 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 2 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 3 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 4 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 5 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 6 - Mobile/Tablet - Empty - Responsive aspect ratio 352:201 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/201' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 7 - Mobile/Tablet - Empty - Responsive aspect ratio 352:201 */}
            <div className="bg-gray-100 rounded-2xl w-full" style={{ aspectRatio: '352/201' }}>
              {/* Empty card - ready for content */}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
