import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

type Item = { id: string; title: string; text: string };

const ICONS: Record<string, React.ReactNode> = {
  website: (<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M7 12h6" /></>),
  shop: (<><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5" /><circle cx="12" cy="14" r="2.5" /></>),
  seo: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  ads: (<><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></>),
  meta: (<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />),
  social: (<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></>),
  branding: (<><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="14" r="2.5" /><circle cx="8.5" cy="17.5" r="2.5" /><circle cx="6.5" cy="9.5" r="2.5" /></>),
  graphic: (<path d="M12 19 7 22l1-5-4-4 5-1 3-5 3 5 5 1-4 4 1 5z" />),
  content: (<path d="M4 5h16M4 12h16M4 19h10" />),
};

export default function Services() {
  const t = useTranslations('services');
  const tu = useTranslations('ui');
  const locale = useLocale();
  const items = t.raw('items') as Item[];

  return (
    <section className="section panel-light" id="leistungen">
      <div className="wrap">
        <Reveal className="shead">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-lg">{t('h2')}</h2>
          <p className="lead" style={{ marginTop: 18 }}>{t('lead')}</p>
          <Link href={`/${locale}/leistungen`} className="btn btn--dark" style={{ marginTop: 20 }}>
            {t('hubLink')} <span className="btn__arrow">→</span>
          </Link>
        </Reveal>

        <div className="svc-group">
          <Reveal className="svc-group__title">{t('groupTitle')}</Reveal>
          <input type="checkbox" id="more-leistungen" className="m-toggle" aria-hidden="true" />
          <div className="svc-grid m-collapse">
            {items.map((it, i) => (
              <Reveal as="article" className="svc" key={it.id} delay={(i % 3) * 0.08}>
                <div className="svc__ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    {ICONS[it.id]}
                  </svg>
                </div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </Reveal>
            ))}
          </div>
          <label htmlFor="more-leistungen" className="m-more">{tu('more')}</label>
        </div>

        <Reveal className="svc-note">
          <div>
            <div className="svc-note__k">{t('note.title')}</div>
            <p>{t('note.text')}</p>
          </div>
          <a href="#ki" className="btn btn--dark">{t('note.btn')} <span className="btn__arrow">→</span></a>
        </Reveal>
      </div>
    </section>
  );
}
