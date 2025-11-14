'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useRef, useState } from 'react';
import styles from './carouselphoto.module.css';

// Register GSAP plugins at module level
gsap.registerPlugin(useGSAP);

type PhotoItem = {
  src: string;
  alt: string;
  frame: string; // HSL color (e.g., 'hsl(30, 30%, 100%)')
};

type CarouselPhotoProps = {
  photos: PhotoItem[];
  className?: string;
};

const CarouselPhoto = ({ photos, className = '' }: CarouselPhotoProps) => {
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const scrollTopRef = useRef(0);

  // ✅ BEST PRACTICE: Use useGSAP hook for React 19 compatibility
  const { contextSafe } = useGSAP(
    () => {
      // Initial setup - gallery items are ready
      if (galleryRef.current) {
        gsap.set(galleryRef.current, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: '0px 0px',
        });
      }
    },
    { scope: galleryContainerRef },
  );

  // ✅ Context-safe wobble animation on hover
  const handleItemHover = contextSafe((index: number) => {
    if (zoomedIndex !== null) {
      return;
    }

    const item = itemsRef.current[index];
    if (!item) {
      return;
    }

    const wrap = item.querySelector(`.${styles.galleryItemWrap}`);
    const strings = item.querySelector(`.${styles.galleryItemStrings}`);

    if (wrap && strings) {
      gsap.to([wrap, strings], {
        keyframes: [
          { rotateY: 10, duration: 0.15 },
          { rotateY: -7, duration: 0.25 },
          { rotateY: 4, duration: 0.2 },
          { rotateY: -2, duration: 0.18 },
          { rotateY: 1, duration: 0.11 },
          { rotateY: 0, duration: 0.11 },
        ],
        ease: 'power2.inOut',
      });
    }
  });

  // ✅ Context-safe zoom animation on click
  const handleItemClick = contextSafe(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const item = itemsRef.current[index];
      if (!item || !galleryRef.current || !galleryContainerRef.current) {
        return;
      }

      // If clicking the same item, ignore
      if (zoomedIndex === index) {
        return;
      }

      const picW = item.offsetWidth;
      const picH = item.offsetHeight;
      const picCX = item.offsetLeft + picW / 2;
      const picCY = item.offsetTop + picH / 2;

      const img = item.querySelector('img');
      if (!img) {
        return;
      }

      // Calculate optimal zoom
      const zoom = Math.min(
        (window.innerHeight - 30) / picH,
        (window.innerWidth - 30) / picW,
        img.naturalWidth / img.offsetWidth,
      );

      // Save scroll position and lock scroll on first zoom
      if (zoomedIndex === null) {
        scrollTopRef.current = window.scrollY;
        // Set gallery top to compensate for scroll (freeze gallery position)
        galleryRef.current.style.top = `${-scrollTopRef.current}px`;
        // Lock container scroll
        galleryContainerRef.current.style.overflow = 'hidden';
        galleryContainerRef.current.style.height = '100vh';
      }

      // Set transform origin to the clicked item's center
      gsap.set(galleryRef.current, {
        transformOrigin: `${picCX}px ${picCY}px`,
      });

      // Calculate target position to center the image
      const targetX = galleryRef.current.offsetWidth / 2 - picCX;
      const targetY
        = -item.offsetTop + scrollTopRef.current + (window.innerHeight - picH) / 2;

      // Animate to zoomed state
      const duration = zoomedIndex !== null ? 0.8 : 0.8;

      gsap.to(galleryRef.current, {
        x: targetX,
        y: targetY,
        scale: zoom,
        duration,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      });

      // Update state
      setZoomedIndex(index);
    },
  );

  // ✅ Context-safe close zoom animation
  const handleCloseZoom = contextSafe((event: React.MouseEvent) => {
    if (zoomedIndex === null) {
      return;
    }

    event.preventDefault();

    if (!galleryRef.current || !galleryContainerRef.current) {
      return;
    }

    // Reset state
    setZoomedIndex(null);

    // Animate back to original position
    gsap.to(galleryRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      onComplete: () => {
        // Restore gallery container scroll after animation completes
        if (galleryRef.current) {
          galleryRef.current.style.top = '';
        }
        if (galleryContainerRef.current) {
          galleryContainerRef.current.style.overflow = '';
          galleryContainerRef.current.style.height = '';
        }
      },
    });
  });

  return (
    <div
      className={`${styles.galleryContainer} ${className}`}
      ref={galleryContainerRef}
      onClick={handleCloseZoom}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && zoomedIndex !== null) {
          handleCloseZoom(e as unknown as React.MouseEvent);
        }
      }}
      role="presentation"
      tabIndex={-1}
    >
      <div className={styles.gallery} ref={galleryRef}>
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            className={`${styles.galleryItem} ${
              zoomedIndex === index ? styles.current : ''
            }`}
            style={{ '--frame': photo.frame } as React.CSSProperties}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
          >
            {/* Photo with frame */}
            <a
              className={styles.galleryItemPerspective}
              href={photo.src}
              onClick={e => handleItemClick(index, e)}
              onMouseEnter={() => handleItemHover(index)}
              onFocus={() => handleItemHover(index)}
              aria-label={`View ${photo.alt}`}
            >
              <div className={styles.galleryItemWrap}>
                <div className={styles.galleryItemOverlay} />
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={400}
                  height={400}
                  className={styles.galleryImg}
                  loading="lazy"
                  unoptimized={photo.src.includes('unsplash.com')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' dy='50%25' dx='50%25' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </div>
            </a>

            {/* Hanging strings */}
            <div className={styles.galleryItemStringsPerspective}>
              <div className={styles.galleryItemStrings} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselPhoto;
