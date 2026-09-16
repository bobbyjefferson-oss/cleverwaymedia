'use client';

import { useState } from 'react';
import Reveal from '@/components/Reveal';

type QA = { q: string; a: string };

export default function ServiceFaq({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <Reveal className={`qa${isOpen ? ' open' : ''}`} key={i}>
            <button className="qa__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              {it.q}
              <span className="qa__ico" />
            </button>
            <div className="qa__a" style={{ maxHeight: isOpen ? 400 : 0 }}>
              <p>{it.a}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
