import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { SERVICE_SLUGS, isValidSlug } from '@/lib/services-data';
import { SITE_URL } from '@/lib/site';
import { serviceSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';
import ServiceFaq from '@/components/ServiceFaq';

export function generateStaticParams() {
  return locales.flatMap((locale) => SERVICE_SLUGS.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  if (!isValidSlug(params.slug)) return {};
  const td = await getTranslations({ locale: params.locale, namespace: 'servicesDetail' });
  const title = td(`${params.slug}.title`);
  const subtitle = td(`${params.slug}.subtitle`);
  const url = `${SITE_URL}/${params.locale}/leistungen/${params.slug}`;

  return {
    title: `${title} — Clever Way Media`,
    description: subtitle,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/leistungen/${params.slug}`])),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  if (!isValidSlug(params.slug)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: 'servicesHub' });
  const td = await getTranslations({ locale: params.locale, namespace: 'servicesDetail' });
  const process = await getTranslations({ locale: params.locale, namespace: 'process' });

  const title = td(`${params.slug}.title`);
  const subtitle = td(`${params.slug}.subtitle`);
  const benefits = td.raw(`${params.slug}.benefits`) as string[];
  const results = td.raw(`${params.slug}.results`) as string[];
  const faq = td.raw(`${params.slug}.faq`) as { q: string; a: string }[];
  const steps = process.raw('steps') as { n: string; title: string; text: string }[];

  const url = `${SITE_URL}/${params.locale}/leistungen/${params.slug}`;
  const schemas = [
    serviceSchema({ name: title, description: subtitle, url }),
    faqSchema(faq),
    breadcrumbSchema([
      { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
      { name: t('allServices'), url: `${SITE_URL}/${params.locale}/leistungen` },
      { name: title, url },
    ]),
  ];

  const otherServices = SERVICE_SLUGS.filter((s) => s.slug !== params.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <Nav />
      <main>
        <Breadcrumbs
          items={[
            { label: 'Clever Way Media', href: `/${params.locale}#top` },
            { label: t('allServices'), href: `/${params.locale}/leistungen` },
            { label: title },
          ]}
        />

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <span className="eyebrow">{t('eyebrow')}</span>
              <h1 className="h-lg" style={{ marginTop: 16 }}>{title}</h1>
              <p className="lead" style={{ marginTop: 18 }}>{subtitle}</p>
            </Reveal>
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 22 }}>{t('benefitsTitle')}</h2>
            </Reveal>
            <ul style={{ display: 'grid', gap: 14 }}>
              {benefits.map((b, i) => (
                <Reveal as="li" key={i} delay={i * 0.05} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-3)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span style={{ color: 'var(--paper-muted)', lineHeight: 1.6 }}>{b}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <Reveal className="shead center">
              <h2 className="h-md">{t('processTitle')}</h2>
            </Reveal>
            <div className="steps">
              {steps.map((s, i) => (
                <Reveal as="div" className="step" key={s.n} delay={i * 0.08}>
                  <div className="step__n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 820 }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: 22 }}>{t('resultsTitle')}</h2>
            </Reveal>
            <ul style={{ display: 'grid', gap: 14 }}>
              {results.map((r, i) => (
                <Reveal as="li" key={i} delay={i * 0.05} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold-3)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>→</span>
                  <span style={{ color: 'var(--paper-muted)', lineHeight: 1.6 }}>{r}</span>
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
              <span className="eyebrow">{t('allServices')}</span>
            </Reveal>
            <div className="svc-grid">
              {otherServices.map((s, i) => (
                <Reveal as="article" className="svc" key={s.slug} delay={i * 0.06}>
                  <h3>{td(`${s.slug}.title`)}</h3>
                  <p>{td(`${s.slug}.subtitle`)}</p>
                  <Link href={`/${params.locale}/leistungen/${s.slug}`} className="btn btn--dark" style={{ marginTop: 16 }}>
                    {t('ctaLabel')} <span className="btn__arrow">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal style={{ textAlign: 'center', marginTop: 30 }}>
              <Link href={`/${params.locale}/leistungen`} className="btn btn--ghost">
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
