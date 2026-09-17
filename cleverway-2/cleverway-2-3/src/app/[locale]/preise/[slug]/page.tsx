import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { PACKAGE_SLUGS, isValidPackageSlug } from '@/lib/pricing-data';
import { SITE_URL } from '@/lib/site';
import { offerSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';
import ServiceFaq from '@/components/ServiceFaq';

export function generateStaticParams() {
  return locales.flatMap((locale) => PACKAGE_SLUGS.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }) {
  if (!isValidPackageSlug(params.slug)) return {};
  const pd = await getTranslations({ locale: params.locale, namespace: 'pricingDetail' });
  const d = pd.raw(params.slug) as { name: string; audience: string };
  const name = d.name;
  const audience = d.audience;
  const url = `${SITE_URL}/${params.locale}/preise/${params.slug}`;

  return {
    title: `${name} — Clever Way Media`,
    description: audience,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/preise/${params.slug}`])),
    },
  };
}

export default async function PricingDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  if (!isValidPackageSlug(params.slug)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: 'pricingHub' });
  const pd = await getTranslations({ locale: params.locale, namespace: 'pricingDetail' });

  const d = pd.raw(params.slug) as {
    name: string; audience: string; price: string; priceModel: string;
    setup?: string; setupNote?: string; badge?: string;
    features: string[]; faq: { q: string; a: string }[];
  };
  const name = d.name;
  const audience = d.audience;
  const price = d.price;
  const priceModel = d.priceModel;
  const setup = d.setup ?? null;
  const setupNote = d.setupNote ?? null;
  const badge = d.badge ?? null;
  const features = d.features;
  const faq = d.faq;

  const url = `${SITE_URL}/${params.locale}/preise/${params.slug}`;
  const numericPrice = price.replace(/[^\d]/g, '');
  const schemas = [
    offerSchema({
      name,
      description: audience,
      url,
      price: numericPrice,
      billingIncrement: priceModel === 'monthly' ? 'monthly' : 'once',
    }),
    faqSchema(faq),
    breadcrumbSchema([
      { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
      { name: t('h1'), url: `${SITE_URL}/${params.locale}/preise` },
      { name, url },
    ]),
  ];

  const otherPackages = PACKAGE_SLUGS.filter((p) => p.slug !== params.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <Nav />
      <main>
        <Breadcrumbs
          items={[
            { label: 'Clever Way Media', href: `/${params.locale}#top` },
            { label: t('h1'), href: `/${params.locale}/preise` },
            { label: name },
          ]}
        />

        <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              {badge ? <span className="eyebrow">{badge}</span> : <span className="eyebrow">{t('eyebrow')}</span>}
              <h1 className="h-lg" style={{ marginTop: 16 }}>{name}</h1>
              <p className="lead" style={{ marginTop: 18 }}>{audience}</p>
            </Reveal>

            <Reveal delay={0.08} style={{ marginTop: 32 }}>
              <div className="plan plan--feat" style={{ maxWidth: 420 }}>
                <div className="plan__price">
                  {price}
                  <small> {priceModel === 'monthly' ? t('monthlyLabel') : t('onceLabel')}</small>
                </div>
                {setup ? <div className="plan__setup">{t('setupLabel')}: {setup}</div> : null}
                {setupNote ? <div className="plan__setup">{setupNote}</div> : null}
                <Link href={`/${params.locale}#termin`} className="btn btn--gold" style={{ marginTop: 20 }}>
                  {t('detailCtaBtn')} <span className="btn__arrow">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 22 }}>{t('featuresTitle')}</h2>
            </Reveal>
            <ul style={{ display: 'grid', gap: 14 }}>
              {features.map((f, i) => (
                <Reveal as="li" key={i} delay={i * 0.05} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-3)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span style={{ color: 'var(--paper-muted)', lineHeight: 1.6 }}>{f}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal className="shead">
              <h2 className="h-md">{t('faqTitle')}</h2>
            </Reveal>
            <ServiceFaq items={faq} />
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 40 }}>
          <div className="wrap" style={{ maxWidth: 700, textAlign: 'center' }}>
            <Reveal>
              <h2 className="h-md" style={{ marginBottom: 14 }}>{t('detailCtaTitle')}</h2>
              <p style={{ color: 'var(--paper-muted)', marginBottom: 26 }}>{t('detailCtaText')}</p>
              <Link href={`/${params.locale}#termin`} className="btn btn--dark">
                {t('detailCtaBtn')} <span className="btn__arrow">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <Reveal className="shead center">
              <span className="eyebrow">{t('h1')}</span>
            </Reveal>
            <div className="svc-grid">
              {otherPackages.map((p, i) => {
                const od = pd.raw(p.slug) as { name: string; audience: string };
                return (
                  <Reveal as="article" className="svc" key={p.slug} delay={i * 0.06}>
                    <h3>{od.name}</h3>
                    <p>{od.audience}</p>
                    <Link href={`/${params.locale}/preise/${p.slug}`} className="btn btn--dark" style={{ marginTop: 16 }}>
                      {t('ctaLabel')} <span className="btn__arrow">→</span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
            <Reveal style={{ textAlign: 'center', marginTop: 30 }}>
              <Link href={`/${params.locale}/preise`} className="btn btn--ghost">
                {t('backToOverview')}
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
