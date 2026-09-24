import Link from 'next/link';
import { pageMetadata } from '@/lib/site';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PACKAGE_SLUGS } from '@/lib/pricing-data';
import { SITE_URL } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'pricingHub' });
  return pageMetadata(params.locale, '/preise', `${t('h1')} — Clever Way Media`, t('lead'));
}

function PackageCard({
  locale, slug, name, price, priceModel, setup, badge, audience, t,
}: {
  locale: string; slug: string; name: string; price: string; priceModel: string;
  setup?: string; badge: string | null; audience: string;
  t: (k: string) => string;
}) {
  return (
    <Reveal as="article" className={`plan${badge ? ' plan--feat' : ''}`}>
      {badge ? <span className="badge">{badge}</span> : null}
      <div className="plan__name">{name}</div>
      <div className="plan__price">
        {price}
        <small> {priceModel === 'monthly' ? t('monthlyLabel') : t('onceLabel')}</small>
      </div>
      {setup ? <div className="plan__setup">{t('setupLabel')}: {setup}</div> : null}
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '14px 0 20px', lineHeight: 1.6 }}>{audience}</p>
      <Link href={`/${locale}/preise/${slug}`} className={`btn ${badge ? 'btn--gold' : 'btn--ghost'}`}>
        {t('ctaLabel')} <span className="btn__arrow">→</span>
      </Link>
    </Reveal>
  );
}

export default async function PricingHubPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'pricingHub' });
  const pd = await getTranslations({ locale: params.locale, namespace: 'pricingDetail' });

  const raw = (slug: string) => pd.raw(slug) as {
    name: string; price: string; priceModel: string; setup?: string; badge?: string; audience: string;
  };

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('h1'), url: `${SITE_URL}/${params.locale}/preise` },
  ]);

  const general = PACKAGE_SLUGS.filter((p) => p.category === 'general');
  const industry = PACKAGE_SLUGS.filter((p) => p.category === 'industry');

  const tt = (k: string) => t(k as any);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />
      <main>
        <Breadcrumbs items={[{ label: 'Clever Way Media', href: `/${params.locale}#top` }, { label: t('h1') }]} />

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <Reveal className="shead center">
              <span className="eyebrow">{t('eyebrow')}</span>
              <h1 className="h-lg">{t('h1')}</h1>
              <p className="lead" style={{ marginTop: 18 }}>{t('lead')}</p>
            </Reveal>

            <Reveal className="group-title-dark" style={{ marginTop: 50 }}>{t('generalTitle')}</Reveal>
            <div className="price-grid">
              {general.map((p) => {
                const d = raw(p.slug);
                return (
                  <PackageCard
                    key={p.slug}
                    locale={params.locale}
                    slug={p.slug}
                    name={d.name}
                    price={d.price}
                    priceModel={d.priceModel}
                    setup={d.setup}
                    badge={d.badge ?? null}
                    audience={d.audience}
                    t={tt}
                  />
                );
              })}
            </div>

            <Reveal className="group-title-dark" style={{ marginTop: 60 }}>{t('industryTitle')}</Reveal>
            <div className="price-grid">
              {industry.map((p) => {
                const d = raw(p.slug);
                return (
                  <PackageCard
                    key={p.slug}
                    locale={params.locale}
                    slug={p.slug}
                    name={d.name}
                    price={d.price}
                    priceModel={d.priceModel}
                    setup={d.setup}
                    badge={d.badge ?? null}
                    audience={d.audience}
                    t={tt}
                  />
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
