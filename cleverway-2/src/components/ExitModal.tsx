'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FORM_ENDPOINT, buildMailto } from '@/lib/site';

export default function ExitModal() {
  const t = useTranslations('exit');
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('cwm_exit')) return;
    let shown = false;
    const trigger = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      sessionStorage.setItem('cwm_exit', '1');
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 6) trigger();
    };
    document.addEventListener('mouseout', onMouseOut);

    let lastY = window.scrollY;
    let engaged = false;
    const eng = setTimeout(() => (engaged = true), 12000);
    const onScroll = () => {
      if (engaged && window.scrollY < lastY - 40 && window.scrollY > 400) trigger();
      lastY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(eng);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get('email') as string) || '';
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit-intent' }),
      }).catch(() => {
        window.location.href = buildMailto('Kostenlose Marketing-Analyse anfordern', { 'E-Mail': email });
      });
    } else {
      window.location.href = buildMailto('Kostenlose Marketing-Analyse anfordern', { 'E-Mail': email });
    }
    setSent(true);
    setTimeout(() => setOpen(false), 2600);
  }

  return (
    <>
      <div
        className={`modal${open ? ' open' : ''}${sent ? ' sent' : ''}`}
        aria-hidden={!open}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className="modal__box" role="dialog" aria-modal="true">
          <div className="modal__glow" />
          <button className="modal__x" aria-label="Schließen" onClick={() => setOpen(false)}>×</button>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h3 className="h-md">{t('title')}</h3>
          <p>{t('text')}</p>
          <form className="modal__form" onSubmit={submit}>
            <input type="email" name="email" placeholder={t('placeholder')} aria-label="E-Mail" required />
            <button className="btn btn--gold" type="submit">{t('btn')} <span className="btn__arrow">→</span></button>
          </form>
          <div className="modal__trust">{t('trust')}</div>
          <div className="modal__ok">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>
            <h3 className="h-md" style={{ marginBottom: 8 }}>{t('successTitle')}</h3>
            <p style={{ color: 'var(--muted)' }}>{t('successText')}</p>
          </div>
        </div>
      </div>

      <a href="#termin" className={`btn btn--gold float${showFloat ? ' show' : ''}`}>
        {t('floatCta')} <span className="btn__arrow">→</span>
      </a>
    </>
  );
}
