'use client';

import ScaleToFit from './ScaleToFit';

type PosterCanvasProps = {
  w: number; // design width
  h: number; // design height
  mode?: 'contain' | 'cover';
  className?: string;
  children: React.ReactNode;
};

export default function PosterCanvas({
  w,
  h,
  mode = 'contain',
  className = '',
  children,
}: PosterCanvasProps) {
  return (
    <section className={`poster fullbleed min-h-screen ${className}`}>
      <ScaleToFit designWidth={w} designHeight={h} mode={mode}>
        {children}
      </ScaleToFit>
    </section>
  );
}
