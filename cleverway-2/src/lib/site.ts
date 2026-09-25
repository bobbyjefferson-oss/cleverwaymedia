import type { Metadata } from 'next';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.cleverwaymedia.de';
export const SITE_NAME = 'Clever Way Media';
export const CONTACT_EMAIL = 'info@cleverwaymedia.de';

// Central place to swap in your real booking + form endpoints later.
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? 'https://cal.eu/cleverwaymedia/1-hour-meeting';
export const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'cleverwaymedia/1-hour-meeting'; // username (+ /event-slug if you add one)
export const CALCOM_ORIGIN = process.env.NEXT_PUBLIC_CALCOM_ORIGIN ?? 'https://cal.eu'; // your Cal.com instance domain
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? 'https://formspree.io/f/mlgyvzne';

export const SOCIAL = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/profile.php?id=100091651446199',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://instagram.com/cleverwaymedia',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '',
};

/**
 * Builds a working mailto: link from form data so the contact form and
 * exit-intent modal genuinely send an email even before a backend
 * (Formspree/Resend) is wired up via NEXT_PUBLIC_FORM_ENDPOINT.
 */
export function buildMailto(subject: string, fields: Record<string, string | undefined>) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`);
  const body = encodeURIComponent(lines.join('\n'));
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
}


export function pageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: `${SITE_URL}/de${path}`,
        hu: `${SITE_URL}/hu${path}`,
        ro: `${SITE_URL}/ro${path}`,
        'x-default': `${SITE_URL}/de${path}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Clever Way Media',
      title,
      description,
      locale,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Clever Way Media' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
