import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';

type Step = { n: string; title: string; text: string };

export default function Process() {
  const t = useTranslations('process');
  const steps = t.raw('steps') as Step[];

  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="shead center">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-lg">{t('h2')}</h2>
        </Reveal>
        <div className="steps">
          {steps.map((s, i) => (
            <Reveal as="div" className="step" key={s.n} delay={i * 0.08}>
              <div className="step__n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
