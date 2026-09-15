'use client';

import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';

export default function Hero() {
  const t = useTranslations('hero');
  const trust = t.raw('trust') as string[];
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>
      <div className="wrap hero__inner">
        <Reveal as="span" className="eyebrow">{t('eyebrow')}</Reveal>

        <Reveal delay={0.08}>
          <h1>
            {t('h1a')} <span className="ital">{t('ital1')}</span>
            <br />
            {t('h1b')} <span className="ital">{t('ital2')}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="lead">{t('lead')}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="hero__cta">
            <a href="#termin" className="btn btn--gold">{t('cta1')} <span className="btn__arrow">→</span></a>
            <a href="#leistungen" className="btn btn--ghost">{t('cta2')}</a>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="hero__trust">
            {trust.map((item, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span>{item}</span>
                {i < trust.length - 1 ? <span className="dot">·</span> : null}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="hero__stats">
            {stats.map((s, i) => (
              <div className="stat" key={i}>
                <b>
                  {s.value === '__counter__' ? (
                    <>
                      <Counter to={500} />+
                    </>
                  ) : (
                    s.value
                  )}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
