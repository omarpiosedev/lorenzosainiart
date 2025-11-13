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
    title: 'Photography Portfolio',
    description: 'Explore my photography portfolio.',
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio/photography`,
      languages: {
        it: `${baseUrl}/it/portfolio/photography`,
        en: `${baseUrl}/en/portfolio/photography`,
      },
    },
  };
}

export default async function PhotographyPortfolioPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="bg-white">
      <Carousel />
    </div>
  );
}
