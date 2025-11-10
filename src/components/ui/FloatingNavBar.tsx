'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

type FloatingNavBarProps = {
  logo: string;
  logoAlt?: string;
  items: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  className?: string;
};

export default function FloatingNavBar({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
}: FloatingNavBarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get active route
  const getActiveHref = () => {
    const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    return items.find((item) => {
      const cleanItemHref = item.href.replace(/^\/[a-z]{2}/, '') || '/';
      // Match exact path OR match home variants (/, /home)
      if (cleanPathname === cleanItemHref) {
        return true;
      }
      if ((cleanPathname === '/' || cleanPathname === '/home')
        && (cleanItemHref === '/' || cleanItemHref === '/home')) {
        return true;
      }
      return false;
    })?.href;
  };

  const activeHref = getActiveHref();

  return (
    <>
      {/* Desktop Dock */}
      <FloatingDockDesktop
        logo={logo}
        logoAlt={logoAlt}
        items={items}
        activeHref={activeHref}
        className={className}
      />

      {/* Mobile Dock */}
      <FloatingDockMobile
        logo={logo}
        logoAlt={logoAlt}
        items={items}
        activeHref={activeHref}
        isOpen={isMobileOpen}
        onToggle={() => setIsMobileOpen(!isMobileOpen)}
        className={className}
      />
    </>
  );
}

// ========== DESKTOP DOCK ==========
type DesktopDockProps = {
  logo: string;
  logoAlt: string;
  items: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  activeHref?: string;
  className?: string;
};

function FloatingDockDesktop({
  logo,
  logoAlt,
  items,
  activeHref,
  className = '',
}: DesktopDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(Infinity);

  useGSAP(
    () => {
      if (!containerRef.current) {
        return;
      }

      // Initial fade in animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' },
      );
    },
    { scope: containerRef },
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    mouseXRef.current = e.clientX - rect.left;
  };

  const handleMouseLeave = () => {
    mouseXRef.current = Infinity;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] hidden md:flex items-center gap-2 rounded-full backdrop-blur-3xl bg-black/70 border border-white/10 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_80px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] ${className}`}
      style={{
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 100%)',
      }}
    >
      {/* Logo */}
      <DockIcon
        href={items[0]?.href || '/'}
        icon={
          <Image src={logo} alt={logoAlt} width={32} height={32} priority />
        }
        title={logoAlt}
        mouseXRef={mouseXRef}
        isActive={false}
        isLogo
      />

      {/* Divider */}
      <div className="h-6 w-px bg-white/20 mx-1" />

      {/* Navigation Items */}
      {items.map(item => (
        <DockIcon
          key={item.href}
          href={item.href}
          icon={item.icon}
          title={item.label}
          mouseXRef={mouseXRef}
          isActive={activeHref === item.href}
        />
      ))}
    </div>
  );
}

// ========== DOCK ICON ==========
type DockIconProps = {
  href: string;
  icon?: React.ReactNode;
  title: string;
  mouseXRef: React.MutableRefObject<number>;
  isActive: boolean;
  isLogo?: boolean;
};

function DockIcon({
  href,
  icon,
  title,
  mouseXRef,
  isActive,
  isLogo = false,
}: DockIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(
    () => {
      if (!iconRef.current) {
        return;
      }

      const iconElement = iconRef.current;
      let frameId: number;

      const animate = () => {
        const rect = iconElement.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = mouseXRef.current - (iconCenterX - rect.left);

        // Calculate scale based on distance (magnifying glass effect - subtle and refined)
        const maxDistance = 120;
        const maxScale = isLogo ? 1.15 : 1.25;
        const minScale = 1;

        let scale = minScale;
        if (Math.abs(distance) < maxDistance) {
          const proximity = 1 - Math.abs(distance) / maxDistance;
          scale = minScale + proximity * (maxScale - minScale);
        }

        // Smooth animation with GSAP
        gsap.to(iconElement, {
          scale,
          duration: 0.3,
          ease: 'power2.out',
        });

        frameId = requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);

      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    },
    { scope: iconRef, dependencies: [] },
  );

  // Tooltip animation
  useGSAP(
    () => {
      if (!tooltipRef.current) {
        return;
      }

      if (isHovered) {
        gsap.fromTo(
          tooltipRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        );
      } else {
        gsap.to(tooltipRef.current, {
          opacity: 0,
          y: 5,
          duration: 0.15,
          ease: 'power2.in',
        });
      }
    },
    { scope: tooltipRef, dependencies: [isHovered] },
  );

  return (
    <Link
      href={href}
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={iconRef}
        className={`flex items-center justify-center rounded-full transition-all duration-300 ${
          isLogo
            ? 'w-8 h-8 aspect-square bg-transparent'
            : isActive
              ? 'h-8 px-3 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.12),inset_0_0_10px_rgba(255,255,255,0.05)]'
              : 'h-8 px-3 bg-transparent hover:bg-white/5'
        }`}
      >
        {icon || (
          <span
            className={`text-xs tracking-wide whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'text-white font-medium'
                : 'text-white/60 font-light hover:text-white/90'
            }`}
          >
            {title}
          </span>
        )}
      </div>
    </Link>
  );
}

// ========== MOBILE DOCK ==========
type MobileDockProps = {
  logo: string;
  logoAlt: string;
  items: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  activeHref?: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

function FloatingDockMobile({
  logo: _logo,
  logoAlt: _logoAlt,
  items,
  activeHref,
  isOpen,
  onToggle,
  className = '',
}: MobileDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Menu animation
  useGSAP(
    () => {
      if (!menuRef.current) {
        return;
      }

      if (isOpen) {
        gsap.set(menuRef.current, { display: 'flex' });
        gsap.fromTo(
          menuRef.current.children,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.3,
            ease: 'power2.out',
          },
        );
      } else {
        gsap.to(menuRef.current.children, {
          opacity: 0,
          y: 10,
          stagger: 0.03,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            if (menuRef.current) {
              gsap.set(menuRef.current, { display: 'none' });
            }
          },
        });
      }
    },
    { scope: menuRef, dependencies: [isOpen] },
  );

  // Hamburger animation
  useGSAP(
    () => {
      if (!hamburgerRef.current) {
        return;
      }

      const lines = hamburgerRef.current.querySelectorAll('.hamburger-line');
      const [line1, line2, line3] = Array.from(lines) as HTMLElement[];

      if (!line1 || !line2 || !line3) {
        return;
      }

      if (isOpen) {
        gsap.to(line1, { rotation: 45, y: 4, duration: 0.35, ease: 'power2.inOut' });
        gsap.to(line2, { opacity: 0, scale: 0.8, duration: 0.2 });
        gsap.to(line3, { rotation: -45, y: -4, duration: 0.35, ease: 'power2.inOut' });
      } else {
        gsap.to(line1, { rotation: 0, y: 0, duration: 0.35, ease: 'power2.inOut' });
        gsap.to(line2, { opacity: 1, scale: 1, duration: 0.25 });
        gsap.to(line3, { rotation: 0, y: 0, duration: 0.35, ease: 'power2.inOut' });
      }
    },
    { scope: hamburgerRef, dependencies: [isOpen] },
  );

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] md:hidden ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Menu Items */}
      <div
        ref={menuRef}
        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden flex-col gap-2"
      >
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex h-10 px-4 items-center justify-center rounded-full backdrop-blur-3xl border transition-all duration-300 ${
              activeHref === item.href
                ? 'bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.12),0_4px_16px_rgba(0,0,0,0.4),inset_0_0_10px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]'
                : 'bg-black/70 border-white/10 hover:bg-black/80 hover:border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]'
            }`}
            onClick={() => onToggle()}
            style={
              activeHref !== item.href
                ? {
                    background:
                      'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 100%)',
                  }
                : undefined
            }
          >
            {item.icon || (
              <span
                className={`text-xs tracking-wide whitespace-nowrap transition-colors duration-300 ${
                  activeHref === item.href ? 'text-white font-medium' : 'text-white font-light'
                }`}
              >
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        ref={hamburgerRef}
        onClick={onToggle}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-full backdrop-blur-3xl bg-black/70 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-black/80 hover:border-white/15"
        aria-label="Toggle menu"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 100%)',
        }}
      >
        <span className="hamburger-line h-px w-4 bg-white rounded-full transition-all duration-300" />
        <span className="hamburger-line h-px w-4 bg-white rounded-full transition-all duration-300" />
        <span className="hamburger-line h-px w-4 bg-white rounded-full transition-all duration-300" />
      </button>
    </div>
  );
}
