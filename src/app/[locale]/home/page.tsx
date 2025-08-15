import { setRequestLocale } from 'next-intl/server';
import HeroHome from './sections/herohome';
import Sez2 from './sections/sez2';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div>
      <HeroHome />
      <Sez2 />
    </div>
  );
}
