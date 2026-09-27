'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import VoiceDemo from '@/components/VoiceDemo';

export const OPEN_VOICE_EVENT = 'cwm:open-voice-widget';

export default function VoiceWidget() {
  const t = useTranslations('voiceWidget');
  const [open, setOpen] = useState(false);

  // Allow other buttons on the page (e.g. the KI-Telefonassistent card) to open the widget.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener(OPEN_VOICE_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_VOICE_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className={`vw${open ? ' vw--open' : ''}`}>
      {open ? (
        <div className="vw__panel" role="dialog" aria-label={t('title')}>
          <button type="button" className="vw__close" aria-label={t('close')} onClick={() => setOpen(false)}>
            ×
          </button>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h3 className="vw__title">{t('title')}</h3>
          <p className="vw__text">{t('text')}</p>
          {/* Mounted only while open: closing the panel also ends a running call. */}
          <VoiceDemo />
        </div>
      ) : null}

      <button
        type="button"
        className="vw__fab"
        aria-label={open ? t('close') : t('label')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )}
        {!open ? <span className="vw__label">{t('label')}</span> : null}
      </button>
    </div>
  );
}
