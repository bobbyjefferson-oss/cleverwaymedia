export type BlogSlug =
  | 'website-kosten-2026'
  | 'steuerkanzlei-mandanten-gewinnen'
  | 'seo-oder-google-ads'
  | 'ki-automatisierung-einstieg'
  | 'local-seo-checkliste'
  | 'social-media-kosten';

export const BLOG_SLUGS: { slug: BlogSlug }[] = [
  { slug: 'website-kosten-2026' },
  { slug: 'steuerkanzlei-mandanten-gewinnen' },
  { slug: 'seo-oder-google-ads' },
  { slug: 'ki-automatisierung-einstieg' },
  { slug: 'local-seo-checkliste' },
  { slug: 'social-media-kosten' },
];

export function isValidBlogSlug(slug: string): slug is BlogSlug {
  return BLOG_SLUGS.some((b) => b.slug === slug);
}
