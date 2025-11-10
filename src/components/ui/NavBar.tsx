'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import './NavBar.css';

// Register GSAP plugins at module level
gsap.registerPlugin(useGSAP);

type NavBarProps = {
  logo: string;
  logoAlt?: string;
  items: Array<{ label: string; href: string; ariaLabel?: string }>;
  className?: string;
};

const NavBar = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
}: NavBarProps) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuItemsRef = useRef<HTMLUListElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Get current active href based on pathname
  const getActiveHref = () => {
    // Remove locale from pathname for comparison
    const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    return items.find((item) => {
      const cleanItemHref = item.href.replace(/^\/[a-z]{2}/, '') || '/';
      return cleanItemHref === cleanPathname;
    })?.href;
  };

  const activeHref = getActiveHref();

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ✅ BEST PRACTICE: Use useGSAP hook for React 19 compatibility
  const { contextSafe } = useGSAP(
    () => {
      // Initial animation on mount
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
        );
      }

      // Initialize mobile menu items as hidden
      if (mobileMenuItemsRef.current) {
        gsap.set(mobileMenuItemsRef.current.children, {
          opacity: 0,
          x: -20,
        });
      }

      // Create timeline for mobile menu morphing animation
      timelineRef.current = gsap
        .timeline({ paused: true })
        .to(navContainerRef.current, {
          width: '85vw',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          duration: 0.4,
          ease: 'power3.out',
        })
        .to(
          mobileMenuItemsRef.current?.children || [],
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.3,
            ease: 'power2.out',
          },
          '<0.2',
        );
    },
    { scope: containerRef },
  );

  // ✅ Context-safe hover animations
  const handleLogoHover = contextSafe(() => {
    if (logoRef.current) {
      const img = logoRef.current.querySelector('img');
      if (img) {
        gsap.to(img, {
          scale: 1.2,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    }
  });

  const handleLogoLeave = contextSafe(() => {
    if (logoRef.current) {
      const img = logoRef.current.querySelector('img');
      if (img) {
        gsap.to(img, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    }
  });

  // ✅ Context-safe mobile menu toggle with GSAP animations
  const toggleMobileMenu = contextSafe(() => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const timeline = timelineRef.current;

    // Animate hamburger to X (or back)
    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      const [line1, line2, line3] = Array.from(lines) as HTMLElement[];

      if (line1 && line2 && line3) {
        if (newState) {
          // Transform to X
          gsap.to(line1, {
            rotation: 45,
            y: 9,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(line2, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
          });
          gsap.to(line3, {
            rotation: -45,
            y: -9,
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          // Transform back to hamburger
          gsap.to(line1, {
            rotation: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(line2, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
          });
          gsap.to(line3, {
            rotation: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    }

    // Toggle mobile menu width + items with timeline
    if (timeline) {
      newState ? timeline.play() : timeline.reverse();
    }
  });

  const isExternalLink = (href: string) =>
    href.startsWith('http://')
    || href.startsWith('https://')
    || href.startsWith('//')
    || href.startsWith('mailto:')
    || href.startsWith('tel:')
    || href.startsWith('#');

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const firstItemHref = items?.[0]?.href;

  return (
    <nav
      className={`navbar ${className}`}
      aria-label="Primary Navigation"
      ref={containerRef}
    >
      <div className="navbar-container" ref={navContainerRef}>
        {/* Logo */}
        {firstItemHref && isRouterLink(firstItemHref)
          ? (
              <Link
                className="navbar-logo"
                href={firstItemHref}
                aria-label="Home"
                onMouseEnter={handleLogoHover}
                onMouseLeave={handleLogoLeave}
                ref={logoRef}
              >
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={40}
                  height={40}
                  priority
                />
              </Link>
            )
          : (
              <a
                className="navbar-logo"
                href={firstItemHref || '#'}
                aria-label="Home"
                onMouseEnter={handleLogoHover}
                onMouseLeave={handleLogoLeave}
                ref={logoRef}
              >
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={40}
                  height={40}
                  priority
                />
              </a>
            )}

        {/* Desktop Navigation Items */}
        <ul className="navbar-items desktop-only" role="menubar">
          {items.map((item, i) => (
            <li key={item.href || `item-${i}`} role="none">
              {isRouterLink(item.href)
                ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={`navbar-item${
                        activeHref === item.href ? ' is-active' : ''
                      }`}
                      aria-label={item.ariaLabel || item.label}
                    >
                      {item.label}
                    </Link>
                  )
                : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`navbar-item${
                        activeHref === item.href ? ' is-active' : ''
                      }`}
                      aria-label={item.ariaLabel || item.label}
                    >
                      {item.label}
                    </a>
                  )}
            </li>
          ))}
        </ul>

        {/* Mobile Navigation Items */}
        <ul
          className="navbar-items mobile-only"
          role="menubar"
          ref={mobileMenuItemsRef}
        >
          {items.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`} role="none">
              {isRouterLink(item.href)
                ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={`navbar-item${
                        activeHref === item.href ? ' is-active' : ''
                      }`}
                      aria-label={item.ariaLabel || item.label}
                    >
                      {item.label}
                    </Link>
                  )
                : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`navbar-item${
                        activeHref === item.href ? ' is-active' : ''
                      }`}
                      aria-label={item.ariaLabel || item.label}
                    >
                      {item.label}
                    </a>
                  )}
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Menu */}
        <button
          className="navbar-hamburger mobile-only"
          aria-label="Toggle menu"
          type="button"
          onClick={toggleMobileMenu}
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
