import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RootPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  
  redirect(`/${locale}/home`);
}