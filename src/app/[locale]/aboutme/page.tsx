import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutMePage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ABOUT ME</h1>
      </div>
    </div>
  );
}
