'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import SettingsModal from '@/components/ui/SettingsModal';

// Lazy load NavBar since it's not critical for first paint
const NavBar = dynamic(() => import('@/components/ui/NavBar'), {
  loading: () => null, // No loading spinner for smoother experience
});

type LayoutClientProps = {
  navItems: Array<{ label: string; href: string; ariaLabel?: string }>;
};

const LayoutClient = ({ navItems }: LayoutClientProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <NavBar
        logo="/assets/images/LogoBianco.webp"
        logoAlt="Lorenzo Saini Art"
        items={navItems}
        baseColor="#060010"
        pillColor="#fff"
        hoveredPillTextColor="#fff"
        pillTextColor="#060010"
        initialLoadAnimation={true}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal - Rendered at document level for proper centering */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default LayoutClient;
