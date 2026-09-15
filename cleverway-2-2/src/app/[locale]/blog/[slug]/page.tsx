import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { BLOG_SLUGS, isValidBlogSlug } from '@/lib/blog-data';
import { SITE_URL } from '@/lib/site';
import { blogPostingSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reveal from '@/components/Reveal';
import BlogBody from '@/components/BlogBody';
import ServiceFaq from '@/components/ServiceFaq';

type Block = { type: 'p'; text: string } | { type: 'h2'; text: string } | { type: 'ul'; items: string[] };
type Post = {
  category: string; title: string; description: string; excerpt: string;
  date: string; readMin: number; body: Block[]; faq: { q: string; a: string }[];
  relatedServiceSlug: string; relatedPackageSlug: string;
};

export function generateStaticParams() {
  return locales.flatMap((locale) => BLOG_SLUGS.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }) {
  if (!isValidBlogSlug(params.slug)) return {};
  const bd = await getTranslations({ locale: params.locale, namespace: 'blogDetail' });
  const p = bd.raw(params.slug) as Post;
  const url = `${SITE_URL}/${params.locale}/blog/${params.slug}`;
  return {
    title: `${p.title} — Clever Way Media Blog`,
    description: p.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}/blog/${params.slug}`])),
    },
  };
}

export default async function BlogPostPage({ params }: { params: { locale: Locale; slug: string } }) {
  if (!isValidBlogSlug(params.slug)) notFound();
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: 'blogHub' });
  const bd = await getTranslations({ locale: params.locale, namespace: 'blogDetail' });
  const st = await getTranslations({ locale: params.locale, namespace: 'servicesDetail' });
  const pt = await getTranslations({ locale: params.locale, namespace: 'pricingDetail' });

  const p = bd.raw(params.slug) as Post;
  const url = `${SITE_URL}/${params.locale}/blog/${params.slug}`;
  const dateFmt = new Intl.DateTimeFormat(params.locale, { year: 'numeric', month: 'long', day: 'numeric' });

  const relatedService = st.raw(p.relatedServiceSlug) as { title: string } | undefined;
  const relatedPackage = pt.raw(p.relatedPackageSlug) as { name: string } | undefined;

  const schemas = [
    blogPostingSchema({ title: p.title, description: p.description, url, datePublished: p.date }),
    faqSchema(p.faq),
    breadcrumbSchema([
      { name: 'Clever Way Media', url: `${SITE_URL}/${params.locale}` },
      { name: t('h1'), url: `${SITE_URL}/${params.locale}/blog` },
      { name: p.title, url },
    ]),
  ];

  const otherPosts = BLOG_SLUGS.filter((b) => b.slug !== params.slug).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <Nav />
      <main>
        <Breadcrumbs
          items={[
            { label: 'Clever Way Media', href: `/${params.locale}#top` },
            { label: t('h1'), href: `/${params.locale}/blog` },
            { label: p.title },
          ]}
        />

        <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <Reveal>
              <span className="eyebrow">{p.category}</span>
              <h1 className="h-lg" style={{ marginTop: 16 }}>{p.title}</h1>
              <div style={{ display: 'flex', gap: 12, fontSize: 13.5, color: 'var(--muted)', marginTop: 18 }}>
                <span>{dateFmt.format(new Date(p.date))}</span>
                <span>·</span>
                <span>{p.readMin} {t('readMinLabel')}</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section panel-light" style={{ paddingTop: 30, paddingBottom: 40 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <BlogBody blocks={p.body} />
          </div>
        </section>

        <section className="section" style={{ paddingTop: 40 }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <Reveal className="shead">
              <h2 className="h-md">{t('faqTitle')}</h2>
            </Reveal>
            <ServiceFaq items={p.faq} />
          </div>
        </section>

        {(relatedService || relatedPackage) && (
          <section className="section panel-light" style={{ paddingTop: 30, paddingBottom: 40 }}>
            <div className="wrap" style={{ maxWidth: 780, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {relatedService && (
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-3)', fontWeight: 600, marginBottom: 10 }}>
                    {t('relatedServiceTitle')}
                  </div>
                  <Link href={`/${params.locale}/leistungen/${p.relatedServiceSlug}`} className="btn btn--dark">
                    {relatedService.title} <span className="btn__arrow">→</span>
                  </Link>
                </div>
              )}
              {relatedPackage && (
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-3)', fontWeight: 600, marginBottom: 10 }}>
                    {t('relatedPackageTitle')}
                  </div>
                  <Link href={`/${params.locale}/preise/${p.relatedPackageSlug}`} className="btn btn--dark">
                    {relatedPackage.name} <span className="btn__arrow">→</span>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section" style={{ paddingTop: 40 }}>
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

        {otherPosts.length > 0 && (
          <section className="section panel-light" style={{ paddingTop: 40 }}>
            <div className="wrap">
              <div className="svc-grid" style={{ maxWidth: 780, margin: '0 auto' }}>
                {otherPosts.map((op, i) => {
                  const od = bd.raw(op.slug) as Post;
                  return (
                    <Reveal as="article" className="svc" key={op.slug} delay={i * 0.06}>
                      <span style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-3)', fontWeight: 600 }}>
                        {od.category}
                      </span>
                      <h3 style={{ marginTop: 10 }}>{od.title}</h3>
                      <p>{od.excerpt}</p>
                      <Link href={`/${params.locale}/blog/${op.slug}`} className="btn btn--dark" style={{ marginTop: 16 }}>
                        {t('ctaLabel')} <span className="btn__arrow">→</span>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
              <Reveal style={{ textAlign: 'center', marginTop: 30 }}>
                <Link href={`/${params.locale}/blog`} className="btn btn--dark">
                  {t('backToOverview')}
                </Link>
              </Reveal>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
