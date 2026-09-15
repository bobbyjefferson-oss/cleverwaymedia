import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

type Plan = {
  name: string;
  price: string;
  unit: string;
  setup: string;
  features: string[];
  feat?: boolean;
  badge?: string;
  btn: string;
  slug?: string;
};

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function Pricing() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const plans = t.raw('plans') as Plan[];

  return (
    <section className="section" id="preise">
      <div className="wrap">
        <Reveal className="shead center">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-lg">{t('h2')}</h2>
        </Reveal>

        <div className="price-grid">
          {plans.map((p, i) => (
            <Reveal className={`plan${p.feat ? ' plan--feat' : ''}`} key={i} delay={i * 0.08}>
              {p.badge ? <span className="badge">{p.badge}</span> : null}
              <div className="plan__name">{p.name}</div>
              <div className="plan__price">{p.price}<small> {p.unit}</small></div>
              <div className="plan__setup">{p.setup}</div>
              <ul>
                {p.features.map((f, j) => (
                  <li key={j}><Check />{f}</li>
                ))}
              </ul>
              <a href="#termin" className={`btn ${p.feat ? 'btn--gold' : 'btn--ghost'}`}>
                {p.btn}{p.feat ? <span className="btn__arrow"> →</span> : null}
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal style={{ textAlign: 'center', marginTop: 12 }}>
          <Link href={`/${locale}/preise`} className="btn btn--ghost">
            {t('hubLink')} <span className="btn__arrow">→</span>
          </Link>
        </Reveal>

        <Reveal><p className="price-note">{t('note')}</p></Reveal>
        <Reveal><p className="price-foot">{t('foot')}</p></Reveal>
      </div>
    </section>
  );
}
