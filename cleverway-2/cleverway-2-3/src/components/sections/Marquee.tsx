import { useTranslations } from 'next-intl';

export default function Marquee() {
  const t = useTranslations('marquee');
  const items = t.raw('items') as string[];
  const loop = [...items, ...items];

  return (
    <div className="marquee">
      <div className="marquee__label">{t('label')}</div>
      <div className="marquee__track" aria-hidden="true">
        {loop.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
