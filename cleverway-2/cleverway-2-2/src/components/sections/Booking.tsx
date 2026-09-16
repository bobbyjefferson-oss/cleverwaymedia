'use client';

import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';
import CalEmbed from '@/components/CalEmbed';
import { BOOKING_URL, CALCOM_LINK, CALCOM_ORIGIN } from '@/lib/site';

export default function Booking() {
  const t = useTranslations('booking');
  const mini = t.raw('mini') as string[];

  const bookHref = BOOKING_URL || '#kontakt';

  return (
    <section className="section book" id="termin">
      <div className="book__glow" />
      <div className="wrap book__inner">
        <Reveal as="span" className="eyebrow">{t('eyebrow')}</Reveal>
        <Reveal delay={0.08}>
          <h2>{t('h2a')} <span className="gold-text">{t('goldWord')}</span></h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="lead" style={{ margin: '0 auto' }}>{t('lead')}</p>
        </Reveal>

        {CALCOM_LINK ? (
          <Reveal delay={0.24} className="book__calendar">
            <CalEmbed calLink={CALCOM_LINK} origin={CALCOM_ORIGIN} />
          </Reveal>
        ) : (
          <Reveal delay={0.24}>
            <div className="book__cta">
              <a href={bookHref} className="btn btn--gold">{t('cta1')} <span className="btn__arrow">→</span></a>
              <a href="#kontakt" className="btn btn--ghost">{t('cta2')}</a>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.24}>
          <div className="book__mini">
            {mini.map((m, i) => (
              <span key={i}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

