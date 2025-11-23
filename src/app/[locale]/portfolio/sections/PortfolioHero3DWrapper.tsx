'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import PortfolioHero3D from './PortfolioHero3D';

export default function PortfolioHero3DWrapper() {
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Increment key when returning to portfolio page
    if (pathname.endsWith('/portfolio')) {
      setKey(prev => prev + 1);
    }
  }, [pathname]);

  return <PortfolioHero3D key={key} />;
}
