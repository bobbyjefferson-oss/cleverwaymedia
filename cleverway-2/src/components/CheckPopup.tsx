'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

const DELAY_MS = 8000;
const STORAGE_KEY = 'cwm_check_popup';
const SNOOZE_DAYS = 7; // after closing or using it, don't show again for a week

function recentlySeen() {
  try {
    const ts = Number(localStorage.getItem(STORAGE_KEY) || 0);
    return Date.now() - ts < SNOOZE_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* private mode — fine, it just may show again */
  }
}

export default function CheckPopup() {
  const t = useTranslations('audit');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const onCheckPage = pathname.endsWith('/website-check');

  useEffect(() => {
    if (onCheckPage || recentlySeen()) return;
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [onCheckPage]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function close() {
    remember();
    setOpen(false);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = String(new FormData(e.currentTarget).get('url') || '').trim();
    if (!url) return;
    remember();
    window.location.href = `/${locale}/website-check?url=${encodeURIComponent(url)}`;
  }

  if (onCheckPage) return null;

  return (
    <div
      className={`modal modal--check${open ? ' open' : ''}`}
      aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="modal__box" role="dialog" aria-modal="true" aria-labelledby="check-popup-title">
        <div className="modal__glow" />
        <button className="modal__x" aria-label={t('popup.close')} onClick={close}>×</button>
        <span className="eyebrow">{t('popup.eyebrow')}</span>
        <h3 className="h-md" id="check-popup-title">{t('popup.title')}</h3>
        <p>{t('popup.text')}</p>
        <form className="modal__form" onSubmit={submit}>
          <input type="text" inputMode="url" name="url" placeholder={t('placeholder')} aria-label={t('placeholder')} required tabIndex={open ? 0 : -1} />
          <button className="btn btn--gold" type="submit" tabIndex={open ? 0 : -1}>{t('popup.btn')} <span className="btn__arrow">→</span></button>
        </form>
        <div className="modal__trust">{t('popup.trust')}</div>
      </div>
    </div>
  );
}
