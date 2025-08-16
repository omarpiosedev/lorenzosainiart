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
    </main>
  );
}
