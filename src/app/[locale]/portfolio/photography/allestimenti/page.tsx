import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Allestimenti Photography Portfolio',
    description: 'Allestimenti photography portfolio by Lorenzo Saini',
  };
}

export default async function AllestimentiPage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase mb-4" style={{ fontFamily: 'var(--font-clash-display, sans-serif)' }}>
          Allestimenti
        </h1>
        <p className="text-lg text-black/60">Coming Soon</p>
      </div>
    </div>
  );
}
