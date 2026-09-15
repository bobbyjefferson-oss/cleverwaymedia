export type ServiceSlug =
  | 'webdesign'
  | 'webentwicklung'
  | 'seo'
  | 'local-seo'
  | 'google-ads'
  | 'meta-ads'
  | 'social-media'
  | 'branding'
  | 'content-creation'
  | 'crm-automatisierung'
  | 'email-marketing'
  | 'ki-automatisierung'
  | 'funnel-aufbau'
  | 'landingpages'
  | 'conversion-optimierung';

export const SERVICE_SLUGS: { slug: ServiceSlug; icon: string }[] = [
  { slug: 'webdesign', icon: 'website' },
  { slug: 'webentwicklung', icon: 'dev' },
  { slug: 'seo', icon: 'seo' },
  { slug: 'local-seo', icon: 'pin' },
  { slug: 'google-ads', icon: 'ads' },
  { slug: 'meta-ads', icon: 'meta' },
  { slug: 'social-media', icon: 'social' },
  { slug: 'branding', icon: 'branding' },
  { slug: 'content-creation', icon: 'content' },
  { slug: 'crm-automatisierung', icon: 'lead' },
  { slug: 'email-marketing', icon: 'mail' },
  { slug: 'ki-automatisierung', icon: 'workflow' },
  { slug: 'funnel-aufbau', icon: 'funnel' },
  { slug: 'landingpages', icon: 'landing' },
  { slug: 'conversion-optimierung', icon: 'cro' },
];

export function isValidSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SLUGS.some((s) => s.slug === slug);
}
