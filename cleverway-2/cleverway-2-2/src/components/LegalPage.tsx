import Reveal from '@/components/Reveal';

type Section = { h: string; p: string };

export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <Reveal>
          <h1 className="h-lg" style={{ marginBottom: 20 }}>{title}</h1>
          <p className="lead" style={{ marginBottom: 40 }}>{intro}</p>
        </Reveal>
        {sections.map((s, i) => (
          <Reveal key={i} delay={i * 0.04} className="legal-block">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', marginBottom: 10, marginTop: 32 }}>{s.h}</h2>
            <p style={{ color: 'var(--muted)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{s.p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
