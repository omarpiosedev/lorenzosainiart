'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import './NavBar.css';

// Register GSAP plugins at module level
gsap.registerPlugin(useGSAP);

type NavBarProps = {
  logo: string;
  logoAlt?: string;
  items: Array<{ label: string; href: string; ariaLabel?: string }>;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  onSettingsClick?: () => void;
  initialLoadAnimation?: boolean;
};

const NavBar = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  onSettingsClick,
  initialLoadAnimation = true,
}: NavBarProps) => {
  const pathname = usePathname();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for GSAP animations
  const circleRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRefs = useRef<gsap.core.Timeline[]>([]);
  const activeTweenRefs = useRef<gsap.core.Tween[]>([]);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

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

  // ✅ BEST PRACTICE: Use useGSAP hook for React 19 compatibility
  const { contextSafe } = useGSAP(
    () => {
      const layout = () => {
        circleRefs.current.forEach((circle) => {
          if (!circle?.parentElement) {
            return;
          }

          const pill = circle.parentElement;
          const rect = pill.getBoundingClientRect();
          const { width: w, height: h } = rect;
          const R = ((w * w) / 4 + h * h) / (2 * h);
          const D = Math.ceil(2 * R) + 2;
          const delta
            = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
          const originY = D - delta;

          circle.style.width = `${D}px`;
          circle.style.height = `${D}px`;
          circle.style.bottom = `-${delta}px`;

          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`,
          });

          const label = pill.querySelector<HTMLElement>('.pill-label');
          const white = pill.querySelector<HTMLElement>('.pill-label-hover');

          if (label) {
            gsap.set(label, { y: 0 });
          }
          if (white) {
            gsap.set(white, { y: h + 12, opacity: 0 });
          }

          const index = circleRefs.current.indexOf(circle);
          if (index === -1) {
            return;
          }

          tlRefs.current[index]?.kill();
          const tl = gsap.timeline({ paused: true });

          tl.to(
            circle,
            { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' },
            0,
          );

          if (label) {
            tl.to(
              label,
              { y: -(h + 8), duration: 2, ease, overwrite: 'auto' },
              0,
            );
          }

          if (white) {
            gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(
              white,
              { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' },
              0,
            );
          }

          tlRefs.current[index] = tl;
        });
      };

      layout();

      const onResize = () => layout();
      window.addEventListener('resize', onResize);

      if (document.fonts?.ready) {
        document.fonts.ready.then(layout).catch(() => {});
      }

      const menu = mobileMenuRef.current;
      if (menu) {
        gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
      }

      if (initialLoadAnimation) {
        const logo = logoRef.current;
        const navItems = navItemsRef.current;

        if (logo) {
          gsap.set(logo, { scale: 0 });
          gsap.to(logo, {
            scale: 1,
            duration: 0.6,
            ease,
          });
        }

        if (navItems) {
          gsap.set(navItems, { width: 0, overflow: 'hidden' });
          gsap.to(navItems, {
            width: 'auto',
            duration: 0.6,
            ease,
          });
        }
      }

      return () => window.removeEventListener('resize', onResize);
    },
    { dependencies: [items, ease, initialLoadAnimation] },
  );

  const handleEnter = contextSafe((i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) {
      return;
    }
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    });
  });

  const handleLeave = contextSafe((i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) {
      return;
    }
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  });

  const handleLogoEnter = contextSafe(() => {
    const img = logoImgRef.current;
    if (!img) {
      return;
    }
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  });

  const toggleMobileMenu = contextSafe(() => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      const firstLine = lines[0];
      const secondLine = lines[1];

      if (firstLine && secondLine) {
        if (newState) {
          gsap.to(firstLine, { rotation: 45, y: 3, duration: 0.3, ease });
          gsap.to(secondLine, { rotation: -45, y: -3, duration: 0.3, ease });
        } else {
          gsap.to(firstLine, { rotation: 0, y: 0, duration: 0.3, ease });
          gsap.to(secondLine, { rotation: 0, y: 0, duration: 0.3, ease });
        }
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          },
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          },
        });
      }
    }

    onMobileMenuClick?.();
  });

  const isExternalLink = (href: string) =>
    href.startsWith('http://')
    || href.startsWith('https://')
    || href.startsWith('//')
    || href.startsWith('mailto:')
    || href.startsWith('tel:')
    || href.startsWith('#');

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
  } as React.CSSProperties;

  const firstItemHref = items?.[0]?.href;

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {firstItemHref && isRouterLink(firstItemHref)
          ? (
              <Link
                className="pill-logo"
                href={firstItemHref}
                aria-label="Home"
                onMouseEnter={handleLogoEnter}
                role="menuitem"
                ref={logoRef}
              >
                <Image src={logo} alt={logoAlt} ref={logoImgRef} width={48} height={48} priority />
              </Link>
            )
          : (
              <a
                className="pill-logo"
                href={firstItemHref || '#'}
                aria-label="Home"
                onMouseEnter={handleLogoEnter}
                ref={logoRef}
              >
                <Image src={logo} alt={logoAlt} ref={logoImgRef} width={48} height={48} priority />
              </a>
            )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                {isRouterLink(item.href)
                  ? (
                      <Link
                        role="menuitem"
                        href={item.href}
                        className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                        aria-label={item.ariaLabel || item.label}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                      >
                        <span
                          className="hover-circle"
                          aria-hidden="true"
                          ref={(el) => {
                            circleRefs.current[i] = el;
                          }}
                        />
                        <span className="label-stack">
                          <span className="pill-label">{item.label}</span>
                          <span className="pill-label-hover" aria-hidden="true">
                            {item.label}
                          </span>
                        </span>
                        {activeHref === item.href && (
                          <span className="active-indicator" aria-hidden="true" />
                        )}
                      </Link>
                    )
                  : (
                      <a
                        role="menuitem"
                        href={item.href}
                        className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                        aria-label={item.ariaLabel || item.label}
                        onMouseEnter={() => handleEnter(i)}
                        onMouseLeave={() => handleLeave(i)}
                      >
                        <span
                          className="hover-circle"
                          aria-hidden="true"
                          ref={(el) => {
                            circleRefs.current[i] = el;
                          }}
                        />
                        <span className="label-stack">
                          <span className="pill-label">{item.label}</span>
                          <span className="pill-label-hover" aria-hidden="true">
                            {item.label}
                          </span>
                        </span>
                        {activeHref === item.href && (
                          <span className="active-indicator" aria-hidden="true" />
                        )}
                      </a>
                    )}
              </li>
            ))}

            {/* Settings Button - Desktop */}
            {onSettingsClick && (
              <li role="none" className="settings-item">
                <button
                  type="button"
                  onClick={onSettingsClick}
                  className="pill pill-settings"
                  aria-label="Open settings"
                >
                  <svg className="settings-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </li>
            )}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
          type="button"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={{ ...cssVars, padding: '1.5rem' }}>
        <ul className="mobile-menu-list" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', display: 'flex' }}>
          {items.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`} style={{ display: 'inline-block' }}>
              {isRouterLink(item.href)
                ? (
                    <Link
                      href={item.href}
                      className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                : (
                    <a
                      href={item.href}
                      className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
            </li>
          ))}

          {/* Settings Button - Mobile */}
          {onSettingsClick && (
            <li className="settings-item-mobile">
              <button
                type="button"
                onClick={() => {
                  onSettingsClick();
                  setIsMobileMenuOpen(false);
                }}
                className="mobile-menu-link settings-link"
                aria-label="Open settings"
              >
                <svg className="settings-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
