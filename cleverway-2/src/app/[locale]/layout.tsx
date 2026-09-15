import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Fraunces, Inter, Cormorant_Garamond } from 'next/font/google';
import { routing, locales, type Locale } from '@/i18n/routing';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { organizationSchema, faqSchema } from '@/lib/schema';
import SmoothScroll from '@/components/SmoothScroll';
import '../globals.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`]));

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ...languages, 'x-default': `${SITE_URL}/de` },
    },
    openGraph: {
      type: 'website',
      locale,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });
  const faq = await getTranslations({ locale, namespace: 'faq' });

  const faqItems = (faq.raw('items') as { q: string; a: string }[]) ?? [];
  const jsonLd = [organizationSchema(t('description')), faqSchema(faqItems)];

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} ${cormorant.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
