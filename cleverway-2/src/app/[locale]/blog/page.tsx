import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { BLOG_SLUGS } from '@/lib/blog-data';
import { SITE_URL } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'blogHub' });
  return {
    title: `${t('h1')} — Clever Way Media Blog`,
    description: t('lead'),
    alternates: { canonical: `${SITE_URL}/${params.locale}/blog`, languages: { de: `${SITE_URL}/de/blog`, hu: `${SITE_URL}/hu/blog`, ro: `${SITE_URL}/ro/blog`, 'x-default': `${SITE_URL}/de/blog` } },
  };
}

export default async function BlogHubPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'blogHub' });
  const bd = await getTranslations({ locale: params.locale, namespace: 'blogDetail' });

  const crumbs = breadcrumbSchema([
    { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
    { name: t('h1'), url: `${SITE_URL}/${params.locale}/blog` },
  ]);

  const posts = BLOG_SLUGS.map(({ slug }) => ({
    slug,
    ...(bd.raw(slug) as { category: string; title: string; excerpt: string; date: string; readMin: number }),
  })).sort((a, b) => (a.date < b.date ? 1 : -1));

  const dateFmt = new Intl.DateTimeFormat(params.locale, { year: 'numeric', month: 'long', day: 'numeric' });

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

            <div className="svc-grid" style={{ marginTop: 44 }}>
              {posts.map((p, i) => (
                <Reveal as="article" className="svc" key={p.slug} delay={(i % 3) * 0.06}>
                  <span style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-3)', fontWeight: 600 }}>
                    {p.category}
                  </span>
                  <h3 style={{ marginTop: 10 }}>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12.5, color: 'var(--paper-muted)', margin: '14px 0 16px' }}>
                    <span>{dateFmt.format(new Date(p.date))}</span>
                    <span>·</span>
                    <span>{p.readMin} {t('readMinLabel')}</span>
                  </div>
                  <Link href={`/${params.locale}/blog/${p.slug}`} className="btn btn--dark">
                    {t('ctaLabel')} <span className="btn__arrow">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
