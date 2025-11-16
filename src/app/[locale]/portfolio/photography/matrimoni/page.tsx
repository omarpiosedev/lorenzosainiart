import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Matrimoni Photography Portfolio',
    description: 'Matrimoni photography portfolio by Lorenzo Saini',
  };
}

export default async function MatrimoniPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase mb-4 font-bacasime">
          Matrimoni
        </h1>
        <p className="text-lg text-black/60">Coming Soon</p>
      </div>
    </div>
  );
}
