'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Compare } from '@/components/ui/compare';

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
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '18.23vw', // ~350px (425px scaled down)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '48.23vh', // ~521px (434px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 2 - Equipment */}
        <div
          className="absolute rounded-2xl p-6 flex flex-col shadow-sm overflow-hidden"
          style={{
            backgroundColor: '#f3f4f6',
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '40.78vw', // ~783px (790px scaled)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '48.23vh', // ~521px (434px * 1.2)
          }}
        >
          {/* Text - Top */}
          <div
            className="absolute text-center flex items-center justify-center"
            style={{
              top: '3.24vh', // 35px / 1080px = 3.24vh
              left: '1.61vw', // 31px / 1920px = 1.61vw
              width: '17.97vw', // 345px / 1920px = 17.97vw
              height: '8.24vh', // 89px / 1080px = 8.24vh
            }}
          >
            <h3
              className="text-black font-medium leading-tight"
              style={{
                fontSize: '1.77vw', // 34px / 1920px = 1.77vw
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {t('benefits.equipment.title')}
            </h3>
          </div>

          {/* Camera Lens Image - Bottom */}
          <div
            className="absolute"
            style={{
              top: '16.76vh', // 181px / 1080px = 16.76vh
              left: '3.28vw', // 63px / 1920px = 3.28vw
              right: '3.28vw', // 63px / 1920px = 3.28vw
              width: '14.64vw', // 281px / 1920px = 14.64vw
              height: '45.37vh', // 490px / 1080px = 45.37vh
            }}
          >
            <img
              src="/assets/images/camera-lens.webp"
              alt="Professional Camera Lens"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Card 3 - Compare Component */}
        <div
          className="absolute rounded-2xl overflow-hidden"
          style={{
            top: '40.56vh', // Spostato più in basso (+10vh)
            left: '63.33vw', // ~1216px (1155px scaled)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '48.23vh', // ~521px (434px * 1.2)
          }}
        >
          <Compare
            firstImage="/assets/images/fotononeditata.webp"
            secondImage="/assets/images/fotoeditata.webp"
            className="w-full h-full"
            slideMode="drag"
            showHandlebar={true}
            autoplay={true}
            autoplayDuration={4000}
            firstImageClassName="object-cover"
            secondImageClassName="object-cover"
          />
        </div>

        {/* Card 4 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '91.85vh', // Spostato più in basso (+10vh)
            left: '18.23vw', // ~350px (425px scaled down)
            width: '21.20vw', // ~407px (339px * 1.2)
            height: '41.22vh', // ~445px (371px * 1.2)
          }}
        >
          {/* Mano Sinistra - 262x152, top 92, destra 254 */}
          <div
            className="absolute"
            style={{
              top: '8.52vh', // 92px / 1080px = 8.52vh
              right: '13.23vw', // 254px / 1920px = 13.23vw
              width: '13.65vw', // 262px / 1920px = 13.65vw
              height: '14.07vh', // 152px / 1080px = 14.07vh
            }}
          >
            <img
              src="/assets/images/manosinistra.webp"
              alt="Left Hand"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mano Destra - 210x115, top 131, sinistra 260 */}
          <div
            className="absolute"
            style={{
              top: '12.13vh', // 131px / 1080px = 12.13vh
              left: '13.54vw', // 260px / 1920px = 13.54vw
              width: '10.94vw', // 210px / 1920px = 10.94vw
              height: '10.65vh', // 115px / 1080px = 10.65vh
            }}
          >
            <img
              src="/assets/images/manodestra.webp"
              alt="Right Hand"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Scritta Seamless client experience - 285x83.35, font size 38, top 324, sinistra destra 61 */}
          <div
            className="absolute text-center flex items-center justify-center"
            style={{
              top: '30.00vh', // 324px / 1080px = 30.00vh
              left: '3.18vw', // 61px / 1920px = 3.18vw
              right: '3.18vw', // 61px / 1920px = 3.18vw
              width: '14.84vw', // 285px / 1920px = 14.84vw
              height: '7.72vh', // 83.35px / 1080px = 7.72vh
            }}
          >
            <h3
              className="text-black font-medium leading-tight"
              style={{
                fontSize: '1.77vw', // Stessa grandezza della Card 2 (34px / 1920px = 1.77vw)
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Seamless client
              <br />
              experience
            </h3>
          </div>
        </div>

        {/* Card 5 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '91.85vh', // Spostato più in basso (+10vh)
            left: '40.78vw', // ~783px (790px scaled)
            width: '44.06vw', // ~846px (705px * 1.2)
            height: '22.00vh', // ~238px (198px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 6 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '116.85vh', // Spostato più in basso (+10vh)
            left: '40.78vw', // ~783px (790px scaled)
            width: '21.31vw', // ~409px (341px * 1.2)
            height: '17.11vh', // ~185px (154px * 1.2)
          }}
        >
          {/* Empty card - ready for content */}
        </div>

        {/* Card 7 - Desktop Layout */}
        <div
          className="absolute bg-gray-100 rounded-2xl overflow-hidden"
          style={{
            top: '116.85vh', // Spostato più in basso (+10vh)
            left: '64.53vw', // ~1239px (1156px scaled)
            width: '21.31vw', // ~409px (341px * 1.2)
            height: '17.11vh', // ~185px (154px * 1.2)
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
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 2 - Mobile/Tablet - Equipment - Responsive aspect ratio 352:522 */}
            <div className="relative rounded-2xl w-full p-6 flex flex-col shadow-sm overflow-hidden" style={{ aspectRatio: '352/522', backgroundColor: '#f3f4f6' }}>
              {/* Text - Top */}
              <div
                className="absolute text-center flex items-center justify-center"
                style={{
                  top: '6.7%', // 35px / 522px = 6.7% della card
                  left: '7.7%', // 27px / 352px = 7.7% della card
                  width: '84.7%', // 298px / 352px = 84.7% della card
                  height: '17%', // 89px / 522px = 17% della card
                }}
              >
                <h3
                  className="font-medium text-black leading-tight"
                  style={{
                    fontSize: '4.5vh', // Font size che si scala con il viewport come l'immagine
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {t('benefits.equipment.title')}
                </h3>
              </div>

              {/* Camera Lens Image - Bottom */}
              <div
                className="absolute"
                style={{
                  top: '35.8%', // 187px / 522px = 35.8% della card mobile
                  left: '9.9%', // 35px / 352px = 9.9% della card mobile
                  right: '9.9%', // 35px / 352px = 9.9% della card mobile
                  width: '79.8%', // 281px / 352px = 79.8% della card mobile
                  height: '93.9%', // 490px / 522px = 93.9% della card mobile
                }}
              >
                <img
                  src="/assets/images/camera-lens.webp"
                  alt="Professional Camera Lens"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 3 - Mobile/Tablet - Compare Component - Responsive aspect ratio 352:522 */}
            <div className="rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              <Compare
                firstImage="/assets/images/fotononeditata.webp"
                secondImage="/assets/images/fotoeditata.webp"
                className="w-full h-full"
                slideMode="drag"
                showHandlebar={true}
                autoplay={true}
                autoplayDuration={4000}
                firstImageClassName="object-cover"
                secondImageClassName="object-cover"
              />
            </div>

            {/* Card 4 - Mobile/Tablet - Experience - Responsive aspect ratio 352:522 */}
            <div className="relative rounded-2xl w-full p-6 flex flex-col shadow-sm overflow-hidden" style={{ aspectRatio: '352/522', backgroundColor: '#f3f4f6' }}>
              {/* Mano Sinistra - 262x152, top 109, destra 202 */}
              <div
                className="absolute"
                style={{
                  top: '20.88%', // 109px / 522px = 20.88%
                  right: '57.39%', // 202px / 352px = 57.39%
                  width: '74.43%', // 262px / 352px = 74.43%
                  height: '29.12%', // 152px / 522px = 29.12%
                }}
              >
                <img
                  src="/assets/images/manosinistra.webp"
                  alt="Left Hand"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mano Destra - 210x115, top 159, sinistra 230 */}
              <div
                className="absolute"
                style={{
                  top: '30.46%', // 159px / 522px = 30.46%
                  left: '65.34%', // 230px / 352px = 65.34%
                  width: '59.66%', // 210px / 352px = 59.66%
                  height: '22.03%', // 115px / 522px = 22.03%
                }}
              >
                <img
                  src="/assets/images/manodestra.webp"
                  alt="Right Hand"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Scritta - 285x83.35, font size 38, top 387, sinistra destra 34 */}
              <div
                className="absolute text-center flex items-center justify-center"
                style={{
                  top: '74.14%', // 387px / 522px = 74.14%
                  left: '9.66%', // 34px / 352px = 9.66%
                  right: '9.66%', // 34px / 352px = 9.66%
                  width: '80.97%', // 285px / 352px = 80.97%
                  height: '15.96%', // 83.35px / 522px = 15.96%
                }}
              >
                <h3
                  className="font-medium text-black leading-tight"
                  style={{
                    fontSize: '4.5vh', // Stessa grandezza della Card 2 mobile
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  Seamless client
                  <br />
                  experience
                </h3>
              </div>
            </div>

            {/* Card 5 - Mobile/Tablet - Empty - Responsive aspect ratio 352:522 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/522' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 6 - Mobile/Tablet - Empty - Responsive aspect ratio 352:201 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/201' }}>
              {/* Empty card - ready for content */}
            </div>

            {/* Card 7 - Mobile/Tablet - Empty - Responsive aspect ratio 352:201 */}
            <div className="bg-gray-100 rounded-2xl w-full overflow-hidden" style={{ aspectRatio: '352/201' }}>
              {/* Empty card - ready for content */}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
