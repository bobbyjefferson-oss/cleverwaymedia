import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { SERVICE_SLUGS } from '@/lib/services-data';
import { PACKAGE_SLUGS } from '@/lib/pricing-data';
import { CASE_SLUGS } from '@/lib/cases-data';
import { BLOG_SLUGS } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    '',
    '/impressum',
    '/datenschutz',
    '/agb',
    '/ueber-uns',
    '/leistungen',
    ...SERVICE_SLUGS.map((s) => `/leistungen/${s.slug}`),
    '/preise',
    ...PACKAGE_SLUGS.map((p) => `/preise/${p.slug}`),
    '/referenzen',
    ...CASE_SLUGS.map((c) => `/referenzen/${c.slug}`),
    '/blog',
    ...BLOG_SLUGS.map((b) => `/blog/${b.slug}`),
  ];

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority:
        route === ''
          ? 1
          : route.startsWith('/leistungen/') || route.startsWith('/preise/') || route.startsWith('/referenzen/') || route.startsWith('/blog/')
            ? 0.85
            : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${route}`]),
        ),
      },
    })),
  );
}



