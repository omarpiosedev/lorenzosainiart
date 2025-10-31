'use client';

import type { ReactElement } from 'react';
import Image from 'next/image';
import PhilosophyText from '@/components/ui/PhilosophyText';

/**
 * PhilosophyGallerySection - Scrolling image gallery
 *
 * Displays a curated collection of photography work across multiple viewport heights.
 * Images are optimized for portfolio quality with responsive sizing.
 *
 * @remarks
 * - Total height: 400vh for extended scroll experience
 * - Screen 1 (0-100vh): PhilosophyText visible
 * - Screen 2 (100-200vh): 3 images composition
 * - Screen 3 (200-300vh): 3 images composition
 * - Screen 4 (300-400vh): Smooth exit
 * - Quality: 80 (optimized for photography portfolio)
 * - Breakpoints: 768px (tablet), 1024px (desktop)
 */
export default function PhilosophyGallerySection(): ReactElement {
  return (
    <div
      data-section="philosophy-gallery"
      className="relative bg-white"
      style={{ height: '400vh' }}
    >
      {/* Top fade gradient overlay - creates smooth transition from previous section */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-16 pointer-events-none z-30">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.9) 80%, white 100%)',
          }}
        />
      </div>

      {/* Fixed background text content (animated via GSAP) */}
      <PhilosophyText />

      {/* Scrolling image gallery container */}
      <div className="absolute inset-0 z-20">

        {/* SCREEN 2: Three-image composition at 100vh offset */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ top: '100vh' }}
        >
          <div className="w-full h-full relative">

            {/* Image 1: Square format - top left composition */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                w-[45vw] h-[22.93vh] top-[13.375vh] left-[3.25vw]
                lg:w-[19.17vw] lg:h-[34.07vh] lg:top-[10.83vh] lg:left-[17.29vw]"
            >
              <Image
                src="/assets/images/image1.webp"
                alt="Lorenzo Saini artistic portrait photography showcasing creative composition and lighting techniques"
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 25vw, 19vw"
                className="object-cover"
                quality={80}
                loading="eager"
                priority={true}
              />
            </div>

            {/* Image 2: Vertical rectangle - top right composition */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                w-[43.75vw] h-[33.375vh] top-[2.93vh] right-[3.25vw]
                lg:w-[10.31vw] lg:h-[27.5vh] lg:top-[17.41vh] lg:right-[23.23vw]"
            >
              <Image
                src="/assets/images/image2.webp"
                alt="Lorenzo Saini contemporary visual art featuring bold colors and expressive style"
                fill
                sizes="(max-width: 768px) 44vw, (max-width: 1024px) 15vw, 10vw"
                className="object-cover"
                quality={80}
                loading="eager"
                priority={true}
              />
            </div>

            {/* Image 3: Horizontal panoramic - center bottom composition */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                w-[93.75vw] h-[31.85vh] left-[3.25vw] top-[66.6vh]
                lg:w-[30vw] lg:h-[35.56vh] lg:left-[29.58vw] lg:top-[62.3vh]"
            >
              <Image
                src="/assets/images/image3.webp"
                alt="Lorenzo Saini landscape and architectural photography demonstrating mastery of perspective and depth"
                fill
                sizes="(max-width: 768px) 94vw, (max-width: 1024px) 50vw, 30vw"
                className="object-cover"
                quality={80}
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* SCREEN 3: Three-image composition at 200vh offset */}
        <div
          className="absolute inset-0"
          style={{ top: '200vh' }}
        >
          <div className="w-full h-full relative">

            {/* Image 4: Small rectangle - bottom left accent */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                w-[45vw] h-[16.18vh] left-[2.75vw] bottom-[109.9vh]
                lg:w-[16.61vw] lg:h-[20vh] lg:left-[21.67vw] lg:bottom-[90.74vh]"
            >
              <Image
                src="/assets/images/3969d532-25ad-4012-82b6-a8da803fdab0_rw_38404170.webp"
                alt="Lorenzo Saini editorial photography series capturing authentic moments and emotion"
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 25vw, 17vw"
                className="object-cover"
                quality={80}
                loading="lazy"
              />
            </div>

            {/* Image 5: Medium rectangle - bottom right accent */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                w-[45vw] h-[16.18vh] right-[2.75vw] bottom-[109.9vh]
                lg:w-[21.2vw] lg:h-[28.15vh] lg:right-[17.71vw] lg:bottom-[90.74vh]"
            >
              <Image
                src="/assets/images/b7195640-fdbe-4964-9b28-12ccc2afeee0_rw_3840d2f7.webp"
                alt="Lorenzo Saini fine art photography exploring texture, form, and abstract visual narratives"
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 21vw"
                className="object-cover"
                quality={80}
                loading="lazy"
              />
            </div>

            {/* Image 6: Hero image - Large format showcase (mobile version) */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                w-[94.5vw] h-[72.1vh] left-[2.75vw] bottom-[1.4vh]
                lg:hidden"
            >
              <Image
                src="/assets/images/1d996cf4-ca34-428c-bf3b-b5b9a30bfa82_rw_1920e651 (1).webp"
                alt="Lorenzo Saini signature work - cinematic photography with dramatic lighting and composition"
                fill
                sizes="(max-width: 768px) 95vw, 1px"
                className="object-cover"
                quality={80}
                loading="lazy"
                priority={false}
              />
            </div>

            {/* Image 6: Hero image - Large format showcase (desktop version) */}
            <div
              className="absolute rounded-3xl overflow-hidden will-change-transform
                shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_10px_30px_-5px_rgba(0,0,0,0.3)]
                hidden
                lg:block lg:w-[70vw] lg:h-[50vh] lg:left-[15vw] lg:bottom-[18.52vh]"
            >
              <Image
                src="/assets/images/1d996cf4-ca34-428c-bf3b-b5b9a30bfa82_rw_1920e651.webp"
                alt="Lorenzo Saini signature work - cinematic photography with dramatic lighting and composition"
                fill
                sizes="(min-width: 1024px) 70vw, 1px"
                className="object-cover"
                quality={80}
                loading="lazy"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
