import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

type RootPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RootPage({ params }: RootPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Redirect to home page
  redirect(`/${locale}/home`);
}
