'use client';

import { gsap } from 'gsap';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as string;
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const languages = [
    {
      code: 'it',
      label: 'Italiano',
      flag: '🇮🇹',
      description: 'Imposta il sito in italiano',
    },
    {
      code: 'en',
      label: 'English',
      flag: '🇺🇸',
      description: 'Set the site to English',
    },
  ];

  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale; // Replace the locale segment
    return segments.join('/');
  };

  const handleLanguageSelect = (langCode: string) => {
    if (langCode !== currentLocale) {
      const newPath = getLocalizedPath(langCode);
      router.push(newPath);
    }
    onClose();
  };

  useEffect(() => {
    const modal = modalRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!modal || !overlay || !content) {
      return;
    }

    if (isOpen) {
      // Show modal
      gsap.set(modal, { display: 'flex' });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(content, { scale: 0.8, opacity: 0, y: 20 });

      const tl = gsap.timeline();
      tl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .to(content, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
        }, '-=0.1');
    } else {
      // Hide modal
      const tl = gsap.timeline();
      tl.to(content, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: 'power2.in',
      })
        .to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1')
        .set(modal, { display: 'none' });
    }
  }, [isOpen]);

  // Close modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[99999] items-center justify-center"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleOverlayClick(e as any);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close settings modal"
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-md w-full"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lavener, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Settings
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Choose your preferred language
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close settings"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Language Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Language / Lingua</h3>
          {languages.map(language => (
            <button
              type="button"
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left group hover:scale-[1.02] ${
                currentLocale === language.code
                  ? 'bg-gray-100 border-2 border-gray-300'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Flag */}
              <div className="text-2xl">{language.flag}</div>

              {/* Language Info */}
              <div className="flex-1">
                <div className="font-semibold text-gray-900 group-hover:text-black">
                  {language.label}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700">
                  {language.description}
                </div>
              </div>

              {/* Current indicator */}
              {currentLocale === language.code && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your language preference will be applied immediately
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
