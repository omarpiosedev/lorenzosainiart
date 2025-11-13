import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBaseUrl } from '@/utils/AppConfig';
import Carousel from './section/carousel';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  return {
    title: 'Video Portfolio',
    description: 'Explore my video production portfolio featuring creative storytelling, brand videos, and cinematic content.',
    keywords: ['video production', 'videography', 'cinematography', 'brand videos', 'creative videos'],
    openGraph: {
      title: 'Video Portfolio | Lorenzo Saini Art',
      description: 'Explore my video production portfolio featuring creative storytelling, brand videos, and cinematic content.',
      url: `${baseUrl}/${locale}/portfolio/video`,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/assets/images/portfolio-video-og.webp`,
          width: 1200,
          height: 630,
          alt: 'Video portfolio showcase',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Video Portfolio | Lorenzo Saini Art',
      description: 'Explore my video production portfolio featuring creative storytelling, brand videos, and cinematic content.',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio/video`,
      languages: {
        it: `${baseUrl}/it/portfolio/video`,
        en: `${baseUrl}/en/portfolio/video`,
      },
    },
  };
}

export default async function VideoPortfolioPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="bg-white">
      <Carousel />
    </div>
  );
}
