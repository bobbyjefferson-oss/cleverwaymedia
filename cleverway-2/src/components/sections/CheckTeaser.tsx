import { useLocale, useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

export default function CheckTeaser() {
  const t = useTranslations('audit.teaser');
  const locale = useLocale();

  return (
    <section className="section wc-teaser" id="website-check">
      <div className="wrap">
        <Reveal className="wc-teaser__box">
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="h-md">{t('h2')}</h2>
            <p>{t('text')}</p>
          </div>
          <a href={`/${locale}/website-check`} className="btn btn--gold">
            {t('btn')} <span className="btn__arrow">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
