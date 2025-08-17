'use client';

import PhilosophyText from '@/components/ui/PhilosophyText';

export default function Sez2() {
  return (
    <div data-section="sez2" className="relative bg-white" style={{ height: '200vh' }}>
      {/* Top fade gradient for mobile */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-16 pointer-events-none z-30">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.9) 80%, white 100%)',
          }}
        />
      </div>

      {/* Fixed background text content */}
      <PhilosophyText />

      {/* Content area for scrolling images */}
      <div className="absolute inset-0 z-20">
        {/* Le immagini che scorrano andranno qui */}
      </div>
    </div>
  );
}
