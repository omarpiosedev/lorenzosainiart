import localFont from 'next/font/local';

// Configure LAVENER font with optimal loading
export const lavener = localFont({
  src: [
    {
      path: '../../public/assets/fonts/LAVENER.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-lavener',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
  adjustFontFallback: false,
});

// Font class name for usage in components
export const lavenerClassName = lavener.className;

// CSS variable for usage in global styles
export const lavenerVariable = lavener.variable;
