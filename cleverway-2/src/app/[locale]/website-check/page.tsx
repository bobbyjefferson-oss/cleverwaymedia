import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, SITE_URL } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';
import WebsiteCheck from '@/components/WebsiteCheck';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'audit' });
  return pageMetadata(params.locale, '/website-check', t('metaTitle'), t('metaDesc'));
}

export default async function WebsiteCheckPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'audit' });

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('eyebrow'), url: `${SITE_URL}/${params.locale}/website-check` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />
      <main>
        <Breadcrumbs items={[{ label: 'Clever Way Media', href: `/${params.locale}#top` }, { label: t('eyebrow') }]} />
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal as="span" className="eyebrow">{t('eyebrow')}</Reveal>
            <Reveal delay={0.06}>
              <h1 className="h-lg" style={{ margin: '10px 0 16px' }}>{t('h1')}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead" style={{ marginBottom: 32 }}>{t('lead')}</p>
            </Reveal>
            <WebsiteCheck />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
