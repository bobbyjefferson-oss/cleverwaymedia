export type PackageSlug = 'start' | 'wachstum' | 'komplett';

export const PACKAGE_SLUGS: { slug: PackageSlug; category: 'general' }[] = [
  { slug: 'start', category: 'general' },
  { slug: 'wachstum', category: 'general' },
  { slug: 'komplett', category: 'general' },
];

export function isValidPackageSlug(slug: string): slug is PackageSlug {
  return PACKAGE_SLUGS.some((p) => p.slug === slug);
}
