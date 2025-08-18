import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import HeroHome from './sections/herohome';

// Lazy load Sez2 since it's below the fold
const Sez2 = dynamic(() => import('./sections/sez2'), {
  loading: () => <div style={{ height: '100vh' }} />, // Preserve layout
});

// Lazy load Sez3
const Sez3 = dynamic(() => import('./sections/sez3'), {
  loading: () => <div style={{ height: '100vh' }} />, // Preserve layout
});

// Lazy load Sez4
const Sez4 = dynamic(() => import('./sections/sez4'), {
  loading: () => <div style={{ height: '100vh' }} />, // Preserve layout
});

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main
      className="min-h-screen"
      style={{
        margin: 0,
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        width: '100vw',
        position: 'relative',
        left: 0,
        right: 0,
      }}
    >
      <HeroHome />
      <Sez2 />
      <Sez3 />
      <Sez4 />
    </main>
  );
}
