import type { Metadata } from 'next';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Lorenzo Saini Portfolio',
};

/**
 * Root layout for non-localized routes (e.g., /studio)
 * Localized routes use [locale]/layout.tsx instead
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
