import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { CASE_SLUGS } from '@/lib/cases-data';
import { SITE_URL } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'casesHub' });
  return {
    title: `${t('h1')} — Clever Way Media`,
    description: t('lead'),
    alternates: { canonical: `${SITE_URL}/${params.locale}/referenzen` },
  };
}

export default async function CasesHubPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'casesHub' });
  const cd = await getTranslations({ locale: params.locale, namespace: 'casesDetail' });

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('h1'), url: `${SITE_URL}/${params.locale}/referenzen` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />
      <main>
        <Breadcrumbs items={[{ label: 'Clever Way Media', href: `/${params.locale}#top` }, { label: t('h1') }]} />

        <section className="section panel-light" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <Reveal className="shead">
              <span className="eyebrow">{t('eyebrow')}</span>
              <h1 className="h-lg">{t('h1')}</h1>
              <p className="lead" style={{ marginTop: 18 }}>{t('lead')}</p>
            </Reveal>

            <div className="work-grid" style={{ marginTop: 40 }}>
              {CASE_SLUGS.map((c, i) => {
                const d = cd.raw(c.slug) as {
                  cat: string; title: string; challenge: string;
                  kpis: { b: string; s: string }[];
                };
                return (
                  <Reveal as="article" className="case" key={c.slug} delay={i * 0.1}>
                    <div className="case__top">
                      <span className="case__cat">{d.cat}</span>
                      <h3>{d.title}</h3>
                      <p>{d.challenge}</p>
                    </div>
                    <div className="case__kpis">
                      {d.kpis.map((k, j) => (
                        <div className="case__kpi" key={j}>
                          <b>{k.b}</b>
                          <span>{k.s}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/${params.locale}/referenzen/${c.slug}`}
                      className="btn btn--dark"
                      style={{ margin: '0 20px 20px' }}
                    >
                      {t('ctaLabel')} <span className="btn__arrow">→</span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
