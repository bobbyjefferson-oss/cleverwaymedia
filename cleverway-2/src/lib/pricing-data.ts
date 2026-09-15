export type PackageSlug =
  | 'start'
  | 'wachstum'
  | 'komplett'
  | 'steuerkanzlei'
  | 'gastronomie'
  | 'ecommerce'
  | 'lokale-dienstleister'
  | 'immobilien'
  | 'b2b-experten';

export const PACKAGE_SLUGS: { slug: PackageSlug; category: 'general' | 'industry' }[] = [
  { slug: 'start', category: 'general' },
  { slug: 'wachstum', category: 'general' },
  { slug: 'komplett', category: 'general' },
  { slug: 'steuerkanzlei', category: 'industry' },
  { slug: 'gastronomie', category: 'industry' },
  { slug: 'ecommerce', category: 'industry' },
  { slug: 'lokale-dienstleister', category: 'industry' },
  { slug: 'immobilien', category: 'industry' },
  { slug: 'b2b-experten', category: 'industry' },
];

export function isValidPackageSlug(slug: string): slug is PackageSlug {
  return PACKAGE_SLUGS.some((p) => p.slug === slug);
}
