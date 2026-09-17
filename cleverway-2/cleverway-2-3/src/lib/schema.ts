import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from './site';

type FaqItem = { q: string; a: string };

export function organizationSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    description,
    url: SITE_URL,
    slogan: 'Marketing trifft Automation',
    areaServed: [
      { '@type': 'Country', name: 'Deutschland' },
      { '@type': 'Country', name: 'Ungarn' },
      { '@type': 'Country', name: 'Rumänien' },
    ],
    knowsLanguage: ['de', 'hu', 'ro'],
    email: CONTACT_EMAIL,
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website-Erstellung' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Suchmaschinenoptimierung (SEO)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KI-Automatisierung & Workflow-Automatisierung' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KI-Chatbot & Sprachassistent' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automatisierte Neukundengewinnung' } },
    ],
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@type': 'ProfessionalService', name: SITE_NAME, url: SITE_URL },
    areaServed: ['DE', 'AT', 'CH', 'HU', 'RO'],
  };
}

export function caseStudySchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    author: { '@type': 'ProfessionalService', name: SITE_NAME, url: SITE_URL },
  };
}

export function blogPostingSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    author: { '@type': 'ProfessionalService', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'ProfessionalService', name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function offerSchema(opts: {
  name: string;
  description: string;
  url: string;
  price: string; // numeric string, e.g. "530"
  priceCurrency?: string;
  billingIncrement?: 'once' | 'monthly';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    price: opts.price,
    priceCurrency: opts.priceCurrency ?? 'EUR',
    availability: 'https://schema.org/InStock',
    ...(opts.billingIncrement === 'monthly'
      ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: opts.price, priceCurrency: 'EUR', unitCode: 'MON' } }
      : {}),
  };
}
