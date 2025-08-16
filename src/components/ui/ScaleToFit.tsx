'use client';

import { useEffect, useRef, useState } from 'react';

type ScaleToFitProps = {
  children: React.ReactNode;
  designWidth: number;
  designHeight: number;
  mode?: 'contain' | 'cover';
  className?: string;
};

export default function ScaleToFit({
  children,
  designWidth,
  designHeight,
  mode = 'contain',
  className = '',
}: ScaleToFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) {
        return;
      }

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      if (containerWidth === 0 || containerHeight === 0) {
        return;
      }

      const scaleX = containerWidth / designWidth;
      const scaleY = containerHeight / designHeight;

      let newScale: number;

      if (mode === 'contain') {
        // Scale to fit entirely within container
        newScale = Math.min(scaleX, scaleY);
      } else {
        // Scale to cover entire container
        newScale = Math.max(scaleX, scaleY);
      }

      setScale(newScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [designWidth, designHeight, mode]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ minHeight: '100vh' }}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: `-${designWidth / 2}px`,
          marginTop: `-${designHeight / 2}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
