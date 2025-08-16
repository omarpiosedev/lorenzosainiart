import { setRequestLocale } from 'next-intl/server';
import HeroHome from './sections/herohome';
import Sez2 from './sections/sez2';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <HeroHome />
      <Sez2 />
    </main>
  );
}
