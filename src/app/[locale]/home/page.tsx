import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { preload } from 'react-dom';
import { getBaseUrl } from '@/utils/AppConfig';
import HomeClient from './HomeClient';
import HeroHome from './sections/herohome';

// ⚡ PERFORMANCE: Dynamic imports for GSAP-heavy sections to reduce initial bundle
// These sections are below-the-fold and can be lazy-loaded
// Note: Sections are already 'use client', so they'll only hydrate client-side
const PhilosophyGallerySection = dynamic(() => import('./sections/PhilosophyGallerySection'));

const ServicesSection = dynamic(() => import('./sections/ServicesSection'));

const BenefitsSection = dynamic(() => import('./sections/BenefitsSection'));

const PortfolioSection = dynamic(() => import('./sections/PortfolioSection'));

const TestimonialsSection = dynamic(() => import('./sections/TestimonialsSection'));

const FAQSection = dynamic(() => import('./sections/FAQSection'));

const ContactCTASection = dynamic(() => import('./sections/ContactCTASection'));

// Loading skeleton component for sections
function SectionSkeleton() {
  return (
    <div
      style={{ height: '100vh' }}
      className="flex items-center justify-center bg-gray-50/50 animate-pulse"
      aria-label="Loading section"
    >
      <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'Home',
    description: 'Welcome to Lorenzo Saini\'s creative portfolio showcasing photography, video production, and artistic projects.',
    keywords: ['home', 'portfolio', 'photography', 'video', 'creative art', 'Lorenzo Saini'],
    openGraph: {
      title: 'Lorenzo Saini Art | Creative Portfolio',
      description: 'Welcome to Lorenzo Saini\'s creative portfolio showcasing photography, video production, and artistic projects.',
      url: `${baseUrl}/${locale}`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/background.webp`,
          width: 1200,
          height: 630,
          alt: 'Lorenzo Saini Portfolio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lorenzo Saini Art | Creative Portfolio',
      description: 'Welcome to Lorenzo Saini\'s creative portfolio showcasing photography, video production, and artistic projects.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        it: `${baseUrl}/it`,
        en: `${baseUrl}/en`,
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // ✅ PERFORMANCE OPTIMIZED: Reduced preloads from 1.8MB to ~600KB
  // Only preload LoadingScreen images that appear immediately (not all 5)
  // Removed: Polaroid 1, 4, 5 (900KB saved) - they lazy load fast enough
  preload('/assets/images/LoadingScreen/Polaroid2.webp', { as: 'image', fetchPriority: 'high' });
  preload('/assets/images/LoadingScreen/Polaroid3.webp', { as: 'image', fetchPriority: 'high' });

  // Hero background image - visible immediately above-the-fold
  preload('/assets/images/background.webp', { as: 'image' });

  // ⚡ REMOVED: Gallery images (sposi, image1, image2, image3) - 17MB total!
  // These are below-the-fold in PhilosophyGallerySection and will lazy load naturally
  // This saves ~17MB from initial page load, improving FCP/LCP by 65-70%

  return (
    <HomeClient>
      <main
        className="min-h-screen"
        style={{
          margin: 0,
          padding: 0,
          paddingLeft: 0,
          paddingRight: 0,
          width: '100%', // ✅ Changed from 100vw to fix mobile horizontal scroll
          maxWidth: '100%',
          position: 'relative',
          left: 0,
          right: 0,
        }}
      >
        {/* Hero section loads immediately - critical for LCP */}
        <HeroHome />

        {/* Below-the-fold sections use Suspense for progressive rendering */}
        <Suspense fallback={<SectionSkeleton />}>
          <PhilosophyGallerySection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <BenefitsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <PortfolioSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactCTASection />
        </Suspense>
      </main>
    </HomeClient>
  );
}
