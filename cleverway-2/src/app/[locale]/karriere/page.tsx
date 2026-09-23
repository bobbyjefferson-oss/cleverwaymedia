import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { SITE_URL, CONTACT_EMAIL } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'karriere' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `${SITE_URL}/${params.locale}/karriere`,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/karriere`])),
    },
  };
}

export default async function KarrierePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'karriere' });

  const steps = t.raw('steps') as { n: string; t: string; x: string }[];
  const pay = t.raw('pay') as string[];

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('h1'), url: `${SITE_URL}/${params.locale}/karriere` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />
      <main>
        <Breadcrumbs
          items={[{ label: 'Clever Way Media', href: `/${params.locale}#top` }, { label: t('eyebrow') }]}
        />

        <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <Reveal as="span" className="eyebrow">{t('eyebrow')}</Reveal>
            <Reveal delay={0.06}>
              <h1 style={{ margin: '10px 0 16px' }}>{t('h1')}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">{t('lead')}</p>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            {steps.map((s, i) => (
              <Reveal as="article" key={i} delay={i * 0.06} className="kar-step">
                <span className="kar-step__n">{s.n}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.x}</p>
                </div>
              </Reveal>
            ))}

            <p className="kar-role">{t('role')}</p>

            <Reveal className="kar-pay">
              <span className="kar-pay__k">{t('payTitle')}</span>
              <ul>
                {pay.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </Reveal>

            <p className="kar-risk">✓ {t('risk')}</p>

            <Reveal className="kar-cta">
              <h3>{t('ctaTitle')}</h3>
              <p>{t('ctaText')}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('ctaBtn'))}`}
                className="btn btn--gold"
              >
                {t('ctaBtn')} <span className="btn__arrow">→</span>
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
