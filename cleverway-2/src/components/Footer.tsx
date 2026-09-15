import { useTranslations, useLocale } from 'next-intl';
import { locales } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const services = t.raw('services') as string[];
  const agency = t.raw('agency') as string[];
  const legal = t.raw('legal') as string[];

  const serviceHrefs = ['#leistungen', '#leistungen', '#ki', '#ki'].map((h) => `/${locale}${h}`);
  const agencyHrefs = [
    `/${locale}/ueber-uns`,
    `/${locale}/blog`,
    `/${locale}#referenzen`,
    `/${locale}#preise`,
    `/${locale}#faq`,
    `/${locale}#termin`,
  ];
  const legalHrefs = [`/${locale}/impressum`, `/${locale}/datenschutz`, `/${locale}/agb`];

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a href={`/${locale}#top`} className="brand"><span><b>Clever</b><span className="w">Way</span> Media</span></a>
            <p>{t('tagline')}</p>
          </div>
          <div className="foot-col">
            <h4>{t('servicesTitle')}</h4>
            {services.map((l, i) => <a key={i} href={serviceHrefs[i]}>{l}</a>)}
          </div>
          <div className="foot-col">
            <h4>{t('agencyTitle')}</h4>
            {agency.map((l, i) => <a key={i} href={agencyHrefs[i]}>{l}</a>)}
          </div>
          <div className="foot-col">
            <h4>{t('legalTitle')}</h4>
            {legal.map((l, i) => <a key={i} href={legalHrefs[i]}>{l}</a>)}
          </div>
        </div>
        <div className="foot-bot">
          <span>{t('rights')}</span>
          <span>
            {t('langLabel')}:{' '}
            {locales.map((l, i) => (
              <span key={l}>
                <a href={`/${l}`} style={l === locale ? { color: 'var(--fg)' } : undefined}>{l.toUpperCase()}</a>
                {i < locales.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
