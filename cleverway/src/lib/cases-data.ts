export type CaseSlug = 'steuerkanzlei-automatisierung' | 'gastronomie-lokal-seo';

export const CASE_SLUGS: { slug: CaseSlug }[] = [
  { slug: 'steuerkanzlei-automatisierung' },
  { slug: 'gastronomie-lokal-seo' },
];

export function isValidCaseSlug(slug: string): slug is CaseSlug {
  return CASE_SLUGS.some((c) => c.slug === slug);
}
