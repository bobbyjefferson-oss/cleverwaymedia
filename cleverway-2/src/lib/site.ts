import type { Metadata } from 'next';
import { locales } from '@/i18n/routing';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.cleverwaymedia.de';
export const SITE_NAME = 'Clever Way Media';
export const CONTACT_EMAIL = 'info@cleverwaymedia.de';
export const CONTACT_PHONE = '+49 177 5401500';
export const CONTACT_PHONE_HREF = 'tel:+491775401500';

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
 * website forms genuinely send an email even before a backend
 * (Formspree/Resend) is wired up via NEXT_PUBLIC_FORM_ENDPOINT.
 */
export function buildMailto(subject: string, fields: Record<string, string | undefined>) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`);
  const body = encodeURIComponent(lines.join('\n'));
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
}


// Google shows ~60 title chars and ~155 description chars; keep snippets untruncated.
export const OG_LOCALE: Record<string, string> = { de: 'de_DE', hu: 'hu_HU', ro: 'ro_RO', en: 'en_US' };

export function seoTitle(base: string, suffix = ' — Clever Way Media') {
  return (base + suffix).length <= 60 ? base + suffix : base;
}

export function seoDescription(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

export function pageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  description = seoDescription(description);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        'x-default': `${SITE_URL}/de${path}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Clever Way Media',
      title,
      description,
      locale: OG_LOCALE[locale] ?? locale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
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

// KI-Telefonassistent live demo (VoiceDemo component).
// Set these in Vercel → Project → Settings → Environment Variables:
//   NEXT_PUBLIC_RETELL_AGENT_ID  = agent_f8be111504f83c267bdc21551f
//   NEXT_PUBLIC_RETELL_PUBLIC_KEY = public_key_... (copy the FULL value from Retell → Settings → API Keys → Public Keys)

/** Sends a form submission via our own /api/lead relay (see app/api/lead/route.ts). */
export async function postLead(fields: Record<string, string | undefined>) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  return res.ok;
}
