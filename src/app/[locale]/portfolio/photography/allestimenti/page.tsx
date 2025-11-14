import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getBaseUrl } from '@/utils/AppConfig';
import CarouselPhoto from './section/carouselphoto';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  const titles = {
    it: 'Allestimenti - Fotografia d\'Interni | Portfolio',
    en: 'Setups - Interior Photography | Portfolio',
  };

  const descriptions = {
    it: 'Scopri il portfolio di fotografia d\'interni e allestimenti: matrimoni, eventi, decorazioni e setup personalizzati.',
    en: 'Explore the interior photography and setups portfolio: weddings, events, decorations and custom setups.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.it,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.it,
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio/photography/allestimenti`,
      languages: {
        it: `${baseUrl}/it/portfolio/photography/allestimenti`,
        en: `${baseUrl}/en/portfolio/photography/allestimenti`,
      },
    },
  };
}

export default async function AllestimentiPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Photo data array - replace with actual portfolio images
  const photos = [
    {
      src: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6b7?w=800&h=800&fit=crop&auto=format',
      alt: 'Allestimento matrimonio elegante con decorazioni floreali',
      frame: 'hsl(30, 30%, 100%)', // White frame
    },
    {
      src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=800&fit=crop&auto=format',
      alt: 'Setup tavola elegante per evento',
      frame: 'hsl(30, 0%, 30%)', // Dark gray frame
    },
    {
      src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop&auto=format',
      alt: 'Decorazioni floreali vintage per matrimonio',
      frame: 'hsl(340, 80%, 75%)', // Pink frame
    },
    {
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=800&fit=crop&auto=format',
      alt: 'Allestimento esterno con luci e candele',
      frame: 'hsl(166, 28%, 35%)', // Green/teal frame
    },
    {
      src: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=800&fit=crop&auto=format',
      alt: 'Setup tavolo imperiale per banchetto',
      frame: 'hsl(30, 0%, 30%)', // Dark gray frame
    },
    {
      src: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&h=800&fit=crop&auto=format',
      alt: 'Decorazioni tavola rustica con fiori',
      frame: 'hsl(33, 70%, 82%)', // Beige/cream frame
    },
    {
      src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=800&fit=crop&auto=format',
      alt: 'Allestimento cerimonia all\'aperto',
      frame: 'hsl(15, 40%, 21%)', // Dark brown frame
    },
    {
      src: 'https://images.unsplash.com/photo-1478146878697-b0f5e6000e96?w=800&h=800&fit=crop&auto=format',
      alt: 'Setup lounge area per evento aziendale',
      frame: 'hsl(108, 26%, 21%)', // Dark olive frame
    },
    {
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&auto=format',
      alt: 'Decorazioni matrimonio minimal chic',
      frame: 'hsl(280, 0%, 20%)', // Dark neutral frame
    },
    {
      src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=800&fit=crop&auto=format',
      alt: 'Allestimento tavola con candele e centrotavola',
      frame: 'hsl(30, 0%, 100%)', // White frame
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(36,15%,82%)]">
      <CarouselPhoto photos={photos} />
    </div>
  );
}
