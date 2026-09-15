import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

type Tile = { id: string; title: string; text: string };

const ICONS: Record<string, React.ReactNode> = {
  telefon: (<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />),
  workflow: (<><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 6h10M6 8l5 8M18 8l-5 8" /></>),
  chatbot: (<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>),
  lead: (<path d="M3 4h18l-7 8v6l-4 2v-8z" />),
  invoice: (<><path d="M6 2h9l5 5v15H6z" /><path d="M15 2v5h5M9 13h6M9 17h4" /></>),
  offer: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M10 13l1.5 1.5L15 11" /></>),
  neukunden: (<><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>),
  termin: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18M9 16l2 2 4-4" /></>),
  content: (<><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>),
  reporting: (<><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>),
};

const VARIANT: Record<string, string> = { telefon: 'bx bx--feat', neukunden: 'bx bx--wide' };

function Ico({ id, size = 22 }: { id: string; size?: number }) {
  return (
    <div className="bx__ico">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        {ICONS[id]}
      </svg>
    </div>
  );
}

export default function Automation() {
  const t = useTranslations('automation');
  const tiles = t.raw('tiles') as Tile[];
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <section className="section diff" id="ki">
      <div className="diff__glow" />
      <div className="wrap">
        <Reveal className="shead" >
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-lg">{t('h2a')} <span className="gold-text">{t('goldWord')}</span></h2>
          <p className="lead" style={{ marginTop: 20 }}>
            {t('leadPre')} <span className="hl">{t('leadHl')}</span>{t('leadPost')}
          </p>
        </Reveal>

        <div className="bento">
          {tiles.map((tile, i) => (
            <Reveal
              key={tile.id}
              as="article"
              className={VARIANT[tile.id] ?? 'bx'}
              delay={(i % 3) * 0.08}
            >
              {tile.id === 'telefon' ? <span className="tag">{t('tag')}</span> : null}
              <Ico id={tile.id} size={tile.id === 'telefon' ? 24 : 22} />
              <h3>{tile.title}</h3>
              <p>{tile.text}</p>
            </Reveal>
          ))}

          <Reveal as="article" className="bx bx--cta">
            <a href="#termin" style={{ display: 'contents', color: 'inherit' }}>
              <div className="bx__ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
              <h3>{t('ctaTile.title')}</h3>
              <p>{t('ctaTile.text')}</p>
            </a>
          </Reveal>
        </div>

        <Reveal className="auto__foot">
          <div className="auto__stats">
            {stats.map((s, i) => (
              <div className="auto__stat" key={i}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <a href="#termin" className="btn btn--gold">{t('ctaBtn')} <span className="btn__arrow">→</span></a>
        </Reveal>
      </div>
    </section>
  );
}
