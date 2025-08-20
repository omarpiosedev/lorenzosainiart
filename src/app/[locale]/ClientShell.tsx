'use client';

import type { NavItem } from './layout';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';

// Lazy load NavBar with SSR disabled and spacer to prevent layout shift
const NavBar = dynamic(() => import('@/components/ui/NavBar'), {
  ssr: false, // Completely move NavBar to client-side
  loading: () => <div aria-hidden className="h-16 pointer-events-none" />, // spacer in-flow
});

// Lazy load SettingsModal and IntroOverlay only when needed
const SettingsModal = dynamic(() => import('@/components/ui/SettingsModal'), { ssr: false });
const IntroOverlay = dynamic(() => import('@/components/ui/IntroOverlay'), { ssr: false });

type ClientShellProps = {
  navItems: ReadonlyArray<NavItem>;
  children: React.ReactNode;
  showIntro?: boolean; // Optional intro overlay
};

export default function ClientShell({ navItems, children, showIntro = false }: ClientShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showIntroOverlay, setShowIntroOverlay] = useState(showIntro);

  return (
    <SmoothScrollProvider>
      {/* Server-rendered content: visible immediately */}
      <main id="main" className="pb-20">{children}</main>

      {/* NavBar out of critical rendering path but with reserved space */}
      <NavBar
        logo="/assets/images/LogoBianco.webp"
        logoAlt="Lorenzo Saini Art"
        items={navItems}
        baseColor="#060010"
        pillColor="#fff"
        hoveredPillTextColor="#fff"
        pillTextColor="#060010"
        initialLoadAnimation
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Optional non-blocking intro overlay */}
      {showIntroOverlay && (
        <IntroOverlay onComplete={() => setShowIntroOverlay(false)} />
      )}
    </SmoothScrollProvider>
  );
}
