import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });
  return {
    title: `${t('h1')} — Clever Way Media`,
    description: t('lead'),
    alternates: {
      canonical: `${SITE_URL}/${params.locale}/ueber-uns`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/ueber-uns`])),
    },
  };
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });

  const values = t.raw('values') as { title: string; text: string }[];
  const markets = t.raw('markets') as string[];

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('h1'), url: `${SITE_URL}/${params.locale}/ueber-uns` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />
      <main>
        <Breadcrumbs items={[{ label: 'Clever Way Media', href: `/${params.locale}#top` }, { label: t('eyebrow') }]} />

        {/* Hero */}
        <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <Reveal>
              <span className="eyebrow">{t('eyebrow')}</span>
              <h1 className="h-lg" style={{ marginTop: 16 }}>{t('h1')}</h1>
              <p className="lead" style={{ marginTop: 18 }}>{t('lead')}</p>
            </Reveal>
          </div>
        </section>

        {/* Story */}
        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 20 }}>{t('storyTitle')}</h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.75, marginBottom: 18 }}>{t('storyP1')}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.75, marginBottom: 18 }}>{t('storyP2')}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.75 }}>{t('storyP3')}</p>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="section" style={{ paddingTop: 50, paddingBottom: 30 }}>
          <div className="wrap">
            <Reveal className="shead center">
              <h2 className="h-lg">{t('valuesTitle')}</h2>
            </Reveal>
            <div className="svc-grid" style={{ marginTop: 20 }}>
              {values.map((v, i) => (
                <Reveal as="article" className="svc" key={i} delay={i * 0.08}>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team + Markets */}
        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 780, display: 'grid', gap: 40, gridTemplateColumns: '1.3fr 1fr' }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: 14 }}>{t('teamTitle')}</h2>
              <p style={{ color: 'var(--paper-muted)', lineHeight: 1.75 }}>{t('teamText')}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: 14 }}>{t('marketsTitle')}</h2>
              <ul style={{ display: 'grid', gap: 10 }}>
                {markets.map((m, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--paper-muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-3)" strokeWidth="2">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {m}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="section" style={{ paddingTop: 50 }}>
          <div className="wrap" style={{ maxWidth: 640, textAlign: 'center' }}>
            <Reveal>
              <h2 className="h-md" style={{ marginBottom: 14 }}>{t('ctaTitle')}</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 26 }}>{t('ctaText')}</p>
              <Link href={`/${params.locale}#termin`} className="btn btn--gold">
                {t('ctaBtn')} <span className="btn__arrow">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
