'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SettingsModal from '@/components/ui/SettingsModal';

// Lazy load NavBar since it's not critical for first paint
const NavBar = dynamic(() => import('@/components/ui/NavBar'), {
  loading: () => null, // No loading spinner for smoother experience
});

type LayoutClientProps = {
  navItems: Array<{ label: string; href: string; ariaLabel?: string }>;
  children: React.ReactNode;
};

const LayoutClient = ({ navItems, children }: LayoutClientProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Loading Screen - mostra all'inizio */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main Content - renderizzato solo dopo il loading */}
      {!isLoading && (
        <div>
          {/* Page Content */}
          {children}

          {/* NavBar */}
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
        </div>
      )}
    </>
  );
};

export default LayoutClient;
