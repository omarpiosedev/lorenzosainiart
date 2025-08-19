'use client';

import { useEffect, useState } from 'react';

type CompareProps = {
  firstImage: string;
  secondImage: string;
  firstImageClassName?: string;
  secondImageClassName?: string;
  className?: string;
  slideMode?: 'hover' | 'drag';
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
};

export const Compare = ({
  firstImage,
  secondImage,
  firstImageClassName,
  secondImageClassName,
  className,
  slideMode = 'hover',
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Autoplay effect
  useEffect(() => {
    if (!autoplay) {
      return;
    }

    const interval = setInterval(() => {
      setSliderXPercent(() => {
        // Smooth transition between 20% and 80%
        const time = Date.now() / autoplayDuration;
        const wave = Math.sin(time * Math.PI * 2) * 30 + 50; // Oscillates between 20-80
        return Math.max(20, Math.min(80, wave));
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [autoplay, autoplayDuration]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (autoplay) {
      return; // Disable all mouse interaction when autoplay is active
    }
    if (slideMode !== 'hover' && !isDragging) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setSliderXPercent(Math.max(0, Math.min(100, percent)));
  };

  const handleMouseDown = () => {
    if (autoplay) {
      return; // Disable all mouse interaction when autoplay is active
    }
    if (slideMode === 'drag') {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    if (autoplay) {
      return; // Disable all mouse interaction when autoplay is active
    }
    setIsDragging(false);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="application"
      aria-label="Image comparison slider"
    >
      {/* First image */}
      <div className="absolute inset-0">
        <img
          src={firstImage}
          alt="First"
          className={`${firstImageClassName}`}
          style={{
            position: 'absolute',
            top: '-17px',
            left: '-5px',
            width: 'calc(100% + 5px)',
            height: 'calc(100% + 17px)',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
      </div>

      {/* Second image with clip-path */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(0 0, ${sliderXPercent}% 0, ${sliderXPercent}% 100%, 0 100%)`,
        }}
      >
        <img
          src={secondImage}
          alt="Second"
          className={`${secondImageClassName}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{
          left: `${sliderXPercent}%`,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Handle */}
      {showHandlebar && (
        <div
          className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize"
          style={{
            left: `${sliderXPercent}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-1 h-4 bg-gray-400 rounded" />
          <div className="w-1 h-4 bg-gray-400 rounded ml-0.5" />
        </div>
      )}
    </div>
  );
};
