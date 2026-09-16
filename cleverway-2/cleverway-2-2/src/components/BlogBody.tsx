import Reveal from '@/components/Reveal';

type Block = { type: 'p'; text: string } | { type: 'h2'; text: string } | { type: 'ul'; items: string[] };

export default function BlogBody({ blocks }: { blocks: Block[] }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {blocks.map((b, i) => {
        if (b.type === 'h2') {
          return (
            <Reveal key={i} delay={i * 0.03}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginTop: 14 }}>{b.text}</h2>
            </Reveal>
          );
        }
        if (b.type === 'ul') {
          return (
            <Reveal key={i} delay={i * 0.03}>
              <ul style={{ display: 'grid', gap: 10, paddingLeft: 0, listStyle: 'none' }}>
                {b.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--paper-muted)', lineHeight: 1.6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-3)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 4 }}>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        }
        return (
          <Reveal key={i} delay={i * 0.03}>
            <p style={{ color: 'var(--paper-muted)', lineHeight: 1.75, fontSize: 15.5 }}>{b.text}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
