import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.impressum' });
  return pageMetadata(params.locale, '/impressum', `${t('title')} — Clever Way Media`, t('intro'));
}

export default async function ImpressumPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'legal.impressum' });
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
