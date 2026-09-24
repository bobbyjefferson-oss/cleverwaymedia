import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.agb' });
  return pageMetadata(params.locale, '/agb', `${t('title')} — Clever Way Media`, `Allgemeine Geschäftsbedingungen von Clever Way Media`);
}

export default async function AgbPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.agb' });
  const sections = t.raw('sections') as { h: string; p: string }[];

  return (
    <>
      <Nav />
      <main>
        <LegalPage title={t('title')} intro={t('intro')} sections={sections} />
      </main>
      <Footer />
    </>
  );
}
