'use client';

import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type NavBarProps = {
  logo: string;
  logoAlt?: string;
  items: ReadonlyArray<{ label: string; href: string; ariaLabel?: string }>;
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
  ease = 'power3.out',
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
  const circleRefs = useRef<HTMLElement[]>([]);
  const tlRefs = useRef<gsap.core.Timeline[]>([]);
  const activeTweenRefs = useRef<gsap.core.Tween[]>([]);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Get current active href based on pathname
  const getActiveHref = () => {
    const normalize = (p: string) => (p.replace(/\/+$/, '') || '/');
    const stripLocale = (p: string) => p.replace(/^\/([a-z]{2})(?:-[A-Z]{2})?(?=\/|$)/, '') || '/';

    const cleanPathname = normalize(stripLocale(pathname));
    return items.find((item) => {
      const cleanItemHref = normalize(stripLocale(item.href));
      return cleanItemHref === cleanPathname;
    })?.href;
  };

  const activeHref = getActiveHref();

  useLayoutEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) {
          return;
        }

        const pill = circle.parentElement as HTMLElement;
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

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    if (initialLoadAnimation) {
      const menu = mobileMenuRef.current;
      if (menu) {
        gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 });
      }

      const hamburger = hamburgerRef.current;
      if (hamburger) {
        gsap.set(hamburger, { scale: 0, transformOrigin: 'center center' });
        gsap.to(hamburger, {
          scale: 1,
          duration: 0.4,
          delay: 0.2,
          ease,
        });
      }
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0, transformOrigin: 'center center' });
        gsap.to(logo, {
          scale: 1,
          duration: 0.4,
          ease,
        });
      }

      if (navItems) {
        gsap.set(navItems, {
          scaleX: 0,
          transformOrigin: 'left center',
          overflow: 'hidden',
        });
        gsap.to(navItems, {
          scaleX: 1,
          duration: 0.6,
          delay: 0.2,
          ease,
        });
      }
    }

    return () => {
      window.removeEventListener('resize', onResize);
      // Kill tutte le timeline/tween attive
      tlRefs.current.forEach(tl => tl?.kill());
      activeTweenRefs.current.forEach(tw => tw?.kill());
      logoTweenRef.current?.kill();
      tlRefs.current = [];
      activeTweenRefs.current = [];
      circleRefs.current = [];
    };
  }, [items, ease, initialLoadAnimation]);

  // Riferimento al pathname precedente per rilevare i cambi di pagina
  const prevPathnameRef = useRef(pathname);

  const handleEnter = (i: number) => {
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
  };

  const handleLeave = (i: number) => {
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
  };

  const handleLogoEnter = () => {
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
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    openerRef.current = hamburgerRef.current ?? null;
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

    // Focus management
    if (newState) {
      requestAnimationFrame(() => firstLinkRef.current?.focus());
    } else {
      requestAnimationFrame(() => openerRef.current?.focus());
    }

    onMobileMenuClick?.();
  };

  // Chiudi il menu mobile quando cambia la pagina
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isMobileMenuOpen) {
      // Aggiorna il riferimento
      prevPathnameRef.current = pathname;

      // Usa la funzione toggleMobileMenu esistente per chiudere correttamente
      toggleMobileMenu();
    } else {
      // Aggiorna il riferimento se non c'è cambio ma il pathname è diverso
      prevPathnameRef.current = pathname;
    }
  }, [pathname, isMobileMenuOpen]);

  // Gestione Escape key e outside click per mobile menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      if (!isMobileMenuOpen) {
        return;
      }
      if (!mobileMenuRef.current?.contains(e.target as Node)
        && !hamburgerRef.current?.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isMobileMenuOpen]);

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
    '--nav-h': '42px',
    '--logo': '36px',
    '--pill-pad-x': '18px',
    '--pill-gap': '3px',
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 pb-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars as React.CSSProperties}
      >
        {items?.[0] && isRouterLink(items[0].href)
          ? (
              <Link
                href={items[0].href}
                aria-label="Home"
                onMouseEnter={handleLogoEnter}
                ref={(el) => {
                  logoRef.current = el;
                }}
                className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
                style={{
                  width: 'var(--nav-h)',
                  height: 'var(--nav-h)',
                  background: 'var(--base, #000)',
                }}
              >
                <Image
                  src={logo}
                  alt={logoAlt || 'Logo'}
                  ref={logoImgRef}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover block"
                />
              </Link>
            )
          : (
              <a
                href={items?.[0]?.href || '#'}
                aria-label="Home"
                onMouseEnter={handleLogoEnter}
                ref={(el) => {
                  logoRef.current = el;
                }}
                className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
                style={{
                  width: 'var(--nav-h)',
                  height: 'var(--nav-h)',
                  background: 'var(--base, #000)',
                }}
              >
                <Image
                  src={logo}
                  alt={logoAlt || 'Logo'}
                  ref={logoImgRef}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover block"
                />
              </a>
            )}

        {/* Desktop Navigation */}
        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)',
          }}
        >
          <ul
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)',
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: 'var(--base, #000)',
                      willChange: 'transform',
                    }}
                    aria-hidden="true"
                    ref={(el) => {
                      if (el) {
                        circleRefs.current[i] = el;
                      }
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity',
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses
                = 'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              return (
                <li key={item.href} className="flex h-full">
                  {isRouterLink(item.href)
                    ? (
                        <Link
                          href={item.href}
                          className={basePillClasses}
                          style={pillStyle}
                          aria-label={item.ariaLabel || item.label}
                          aria-current={isActive ? 'page' : undefined}
                          onMouseEnter={() => handleEnter(i)}
                          onMouseLeave={() => handleLeave(i)}
                          onFocus={() => handleEnter(i)}
                          onBlur={() => handleLeave(i)}
                        >
                          {PillContent}
                        </Link>
                      )
                    : (
                        <a
                          href={item.href}
                          className={basePillClasses}
                          style={pillStyle}
                          aria-label={item.ariaLabel || item.label}
                          aria-current={isActive ? 'page' : undefined}
                          onMouseEnter={() => handleEnter(i)}
                          onMouseLeave={() => handleLeave(i)}
                          onFocus={() => handleEnter(i)}
                          onBlur={() => handleLeave(i)}
                        >
                          {PillContent}
                        </a>
                      )}
                </li>
              );
            })}
            {/* Settings Button - Desktop */}
            <li className="flex h-full ml-2">
              <button
                type="button"
                onClick={() => onSettingsClick?.()}
                className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-105 px-0"
                style={{
                  background: pillColor,
                  color: resolvedPillTextColor,
                }}
                aria-label="Open settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'var(--base, #000)',
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileMenuOpen}
        className="md:hidden absolute bottom-[3.5rem] left-0 right-0 rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-30 origin-bottom"
        style={{
          ...cssVars,
          background: 'var(--base, #f0f0f0)',
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {items.map((item, index) => {
            const defaultStyle = {
              background: 'var(--pill-bg, #fff)',
              color: 'var(--pill-text, #fff)',
            };

            const linkClasses
              = 'block py-3 px-4 text-[16px] font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-[var(--base)] hover:text-[var(--hover-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--base)]';

            return (
              <li key={item.href}>
                {isRouterLink(item.href)
                  ? (
                      <Link
                        ref={index === 0 ? firstLinkRef : null}
                        href={item.href}
                        className={linkClasses}
                        style={defaultStyle}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  : (
                      <a
                        ref={index === 0 ? firstLinkRef : null}
                        href={item.href}
                        className={linkClasses}
                        style={defaultStyle}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
              </li>
            );
          })}

          {/* Settings Button - Mobile */}
          <li className="mt-2 flex justify-center">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, #fff)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onSettingsClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: 'transparent',
                  color: 'var(--pill-text, #fff)',
                }}
                aria-label="Open settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
