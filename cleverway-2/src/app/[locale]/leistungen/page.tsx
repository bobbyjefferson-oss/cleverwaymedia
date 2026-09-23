import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { SERVICE_SLUGS } from '@/lib/services-data';
import { SITE_URL } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'servicesHub' });
  return {
    title: `${t('h1')} — Clever Way Media`,
    description: t('lead'),
    alternates: { canonical: `${SITE_URL}/${params.locale}/leistungen`, languages: { de: `${SITE_URL}/de/leistungen`, hu: `${SITE_URL}/hu/leistungen`, ro: `${SITE_URL}/ro/leistungen`, 'x-default': `${SITE_URL}/de/leistungen` } },
  };
}

export default async function ServicesHubPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'servicesHub' });
  const td = await getTranslations({ locale: params.locale, namespace: 'servicesDetail' });
  const nav = await getTranslations({ locale: params.locale, namespace: 'nav' });

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('allServices'), url: `${SITE_URL}/${params.locale}/leistungen` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <Nav />
      <main>
        <Breadcrumbs
          items={[
            { label: 'Clever Way Media', href: `/${params.locale}#top` },
            { label: t('allServices') },
          ]}
        />
        <section className="section panel-light" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <Reveal className="shead">
              <span className="eyebrow">{t('eyebrow')}</span>
              <h1 className="h-lg">{t('h1')}</h1>
              <p className="lead" style={{ marginTop: 18 }}>{t('lead')}</p>
            </Reveal>

            <div className="svc-grid" style={{ marginTop: 48 }}>
              {SERVICE_SLUGS.map((s, i) => {
                const title = td(`${s.slug}.title`);
                const subtitle = td(`${s.slug}.subtitle`);
                return (
                  <Reveal as="article" className="svc" key={s.slug} delay={(i % 3) * 0.06}>
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                    <Link
                      href={`/${params.locale}/leistungen/${s.slug}`}
                      className="btn btn--dark"
                      style={{ marginTop: 16, alignSelf: 'flex-start' }}
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
