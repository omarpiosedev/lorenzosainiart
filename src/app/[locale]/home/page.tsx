import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { getBaseUrl } from '@/utils/AppConfig';
import BenefitsSection from './sections/BenefitsSection';
import FAQSection from './sections/FAQSection';
import HeroHome from './sections/herohome';
import PhilosophyGallerySection from './sections/PhilosophyGallerySection';
import PortfolioSection from './sections/PortfolioSection';
import ServicesSection from './sections/ServicesSection';
import TestimonialsSection from './sections/TestimonialsSection';

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
          url: `${baseUrl}/assets/images/backgropund.webp`,
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
    </main>
  );
}
