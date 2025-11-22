import { setRequestLocale } from 'next-intl/server';

import PhotographyHero from './_components/photographyhero';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PhotographyPortfolioPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <PhotographyHero />;
}
