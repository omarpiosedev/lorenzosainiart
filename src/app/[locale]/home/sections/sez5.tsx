'use client';

import { useRef } from 'react';

export default function Sez5() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={sectionRef} data-section="sez5" className="relative bg-white min-h-screen">
      {/* Desktop Layout */}
      <div className="hidden xl:block">
        {/* Sezione 5 Desktop - Vuota */}
      </div>

      {/* Mobile/Tablet responsive layout */}
      <div className="xl:hidden min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Sezione 5 Mobile - Vuota */}
      </div>
    </div>
  );
}
