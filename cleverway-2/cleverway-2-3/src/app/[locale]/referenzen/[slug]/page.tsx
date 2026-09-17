import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { CASE_SLUGS, isValidCaseSlug } from '@/lib/cases-data';
import { SITE_URL } from '@/lib/site';
import { caseStudySchema, breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export function generateStaticParams() {
  return locales.flatMap((locale) => CASE_SLUGS.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }) {
  if (!isValidCaseSlug(params.slug)) return {};
  const cd = await getTranslations({ locale: params.locale, namespace: 'casesDetail' });
  const d = cd.raw(params.slug) as { title: string; challenge: string };
  const url = `${SITE_URL}/${params.locale}/referenzen/${params.slug}`;
  return {
    title: `${d.title} — Clever Way Media`,
    description: d.challenge,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/referenzen/${params.slug}`])),
    },
  };
}

export default async function CaseDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  if (!isValidCaseSlug(params.slug)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: 'casesHub' });
  const cd = await getTranslations({ locale: params.locale, namespace: 'casesDetail' });

  const d = cd.raw(params.slug) as {
    cat: string; title: string; challenge: string; strategy: string;
    executionSteps: string[]; kpis: { b: string; s: string }[];
  };

  const url = `${SITE_URL}/${params.locale}/referenzen/${params.slug}`;
  const schemas = [
    caseStudySchema({ name: d.title, description: d.challenge, url }),
    breadcrumbSchema([
      { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
      { name: t('h1'), url: `${SITE_URL}/${params.locale}/referenzen` },
      { name: d.title, url },
    ]),
  ];

  const otherCase = CASE_SLUGS.find((c) => c.slug !== params.slug);
  const otherData = otherCase ? (cd.raw(otherCase.slug) as { title: string; challenge: string; cat: string }) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <Nav />
      <main>
        <Breadcrumbs
          items={[
            { label: 'Clever Way Media', href: `/${params.locale}#top` },
            { label: t('h1'), href: `/${params.locale}/referenzen` },
            { label: d.title },
          ]}
        />

        <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <span className="eyebrow">{d.cat}</span>
              <h1 className="h-lg" style={{ marginTop: 16 }}>{d.title}</h1>
            </Reveal>

            <Reveal delay={0.1} style={{ marginTop: 28 }}>
              <div className="auto__stats" style={{ justifyContent: 'flex-start', gap: 44 }}>
                {d.kpis.map((k, i) => (
                  <div className="auto__stat" key={i}>
                    <b>{k.b}</b>
                    <span>{k.s}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 14 }}>{t('challengeTitle')}</h2>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.7 }}>{d.challenge}</p>
            </Reveal>
            <Reveal delay={0.08} style={{ marginTop: 36 }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 14 }}>{t('strategyTitle')}</h2>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.7 }}>{d.strategy}</p>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <h2 className="h-md" style={{ marginBottom: 22 }}>{t('executionTitle')}</h2>
            </Reveal>
            <ul style={{ display: 'grid', gap: 14 }}>
              {d.executionSteps.map((step, i) => (
                <Reveal as="li" key={i} delay={i * 0.06} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold-2)', fontFamily: 'var(--serif)', fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{step}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 14 }}>{t('resultsTitle')}</h2>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.6, marginBottom: 22 }}>{t('resultsIntro')}</p>
            </Reveal>
            <div className="case__kpis" style={{ padding: 0, borderTop: 'none', gap: 40, flexWrap: 'wrap' }}>
              {d.kpis.map((k, i) => (
                <Reveal key={i} delay={i * 0.06} className="case__kpi">
                  <b>{k.b}</b>
                  <span>{k.s}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap" style={{ maxWidth: 700, textAlign: 'center' }}>
            <Reveal>
              <h2 className="h-md" style={{ marginBottom: 14 }}>{t('detailCtaTitle')}</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 26 }}>{t('detailCtaText')}</p>
              <Link href={`/${params.locale}#termin`} className="btn btn--gold">
                {t('detailCtaBtn')} <span className="btn__arrow">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {otherCase && otherData ? (
          <section className="section panel-light" style={{ paddingTop: 40 }}>
            <div className="wrap">
              <Reveal className="shead center">
                <span className="eyebrow">{t('otherCasesTitle')}</span>
              </Reveal>
              <div className="work-grid" style={{ maxWidth: 560, margin: '0 auto' }}>
                <Reveal as="article" className="case">
                  <div className="case__top" style={{ paddingBottom: 26 }}>
                    <span className="case__cat">{otherData.cat}</span>
                    <h3>{otherData.title}</h3>
                    <p>{otherData.challenge}</p>
                  </div>
                  <div style={{ padding: '0 26px 26px' }}>
                    <Link href={`/${params.locale}/referenzen/${otherCase.slug}`} className="btn btn--dark">
                      {t('ctaLabel')} <span className="btn__arrow">→</span>
                    </Link>
                  </div>
                </Reveal>
              </div>
              <Reveal style={{ textAlign: 'center', marginTop: 30 }}>
                <Link href={`/${params.locale}/referenzen`} className="btn btn--dark">
                  {t('backToOverview')}
                </Link>
              </Reveal>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
