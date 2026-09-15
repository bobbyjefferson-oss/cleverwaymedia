import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

type Kpi = { b: string; s: string };
type Case = { cat: string; title: string; text: string; kpis: Kpi[]; slug: string };

export default function CaseStudies() {
  const t = useTranslations('cases');
  const locale = useLocale();
  const items = t.raw('items') as Case[];

  return (
    <section className="section panel-light" id="referenzen">
      <div className="wrap">
        <Reveal className="shead">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-lg">{t('h2')}</h2>
          <p className="lead" style={{ marginTop: 18 }}>{t('lead')}</p>
        </Reveal>

        <div className="work-grid">
          {items.map((c, i) => (
            <Reveal as="article" className="case" key={i} delay={i * 0.1}>
              <div className="case__top">
                <span className="case__cat">{c.cat}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
              <div className="case__kpis">
                {c.kpis.map((k, j) => (
                  <div className="case__kpi" key={j}>
                    <b>{k.b}</b>
                    <span>{k.s}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 26px 26px' }}>
                <Link href={`/${locale}/referenzen/${c.slug}`} className="btn btn--dark">
                  {t('detailLabel')} <span className="btn__arrow">→</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href={`/${locale}/referenzen`} className="btn btn--dark">
            {t('hubLink')} <span className="btn__arrow">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
