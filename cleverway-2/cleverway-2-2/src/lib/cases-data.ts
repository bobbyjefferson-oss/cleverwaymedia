export type CaseSlug = 'ki-telefonassistent' | 'website-lokale-sichtbarkeit';

export const CASE_SLUGS: { slug: CaseSlug }[] = [
  { slug: 'ki-telefonassistent' },
  { slug: 'website-lokale-sichtbarkeit' },
];

export function isValidCaseSlug(slug: string): slug is CaseSlug {
  return CASE_SLUGS.some((c) => c.slug === slug);
}
