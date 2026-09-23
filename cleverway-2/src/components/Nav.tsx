'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n/routing';
import { CONTACT_EMAIL } from '@/lib/site';

const NAV: { id: string; page?: string }[] = [
  { id: 'leistungen', page: 'leistungen' },
  { id: 'ki' },
  { id: 'referenzen', page: 'referenzen' },
  { id: 'preise', page: 'preise' },
  { id: 'karriere', page: 'karriere' },
  { id: 'faq' },
  { id: 'kontakt' },
];

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname(); // e.g. "/hu/impressum" or "/de"
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Strip the leading /{locale} so we can rebuild it for any target language.
  const restOfPath = pathname.replace(new RegExp(`^/${locale}`), '') || '';
  const home = `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const Monogram = (
    <svg className="brand__mark" viewBox="0 0 100 100" aria-hidden="true">
      <text x="8" y="72" style={{ fontFamily: 'var(--font-fraunces)' }} fontWeight="600" fontSize="72" fill="currentColor">C</text>
      <text x="46" y="76" style={{ fontFamily: 'var(--font-fraunces)' }} fontStyle="italic" fontWeight="500" fontSize="58" fill="#c99f60">w</text>
    </svg>
  );

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="wrap nav__inner">
          <a href={`${home}#top`} className="brand" aria-label={`${SITE} Startseite`}>
            {Monogram}
            <span><b>Clever</b><span className="w">Way</span></span>
          </a>

          <nav className="nav__links" aria-label="Hauptnavigation">
            {NAV.map((item) => (
              <a key={item.id} href={item.page ? `/${locale}/${item.page}` : `${home}#${item.id}`}>{t(`links.${item.id}`)}</a>
            ))}
          </nav>

          <div className="nav__cta">
            <a href="tel:+491775401500" className="nav__phone" aria-label="Jetzt anrufen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span className="nav__phone-num">+49 177 5401500</span>
            </a>
            <div className="lang">
              {locales.map((l, i) => (
                <span key={l}>
                  <a href={`/${l}${restOfPath}`}>{l === locale ? <b>{l.toUpperCase()}</b> : l.toUpperCase()}</a>
                  {i < locales.length - 1 ? <span> · </span> : null}
                </span>
              ))}
            </div>
            <a href={`${home}#termin`} className="btn btn--gold">
              {t('cta')} <span className="btn__arrow">→</span>
            </a>
          </div>

          <button
            className="burger"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className={`mobile${open ? ' open' : ''}`}>
        <nav className="mobile__links" aria-label="Mobile Navigation">
          {NAV.map((item, i) => (
            <a
              key={item.id}
              href={item.page ? `/${locale}/${item.page}` : `${home}#${item.id}`}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${70 + i * 45}ms` }}
            >
              {t(`links.${item.id}`)}
            </a>
          ))}
        </nav>

        <div className="mobile__foot">
          <a href={`${home}#termin`} className="btn btn--gold mobile__cta" onClick={() => setOpen(false)}>
            {t('cta')} <span className="btn__arrow">→</span>
          </a>
          <div className="mobile__meta">
            <div className="mobile__lang">
              {locales.map((l, i) => (
                <span key={l}>
                  <a
                    href={`/${l}${restOfPath}`}
                    onClick={() => setOpen(false)}
                    className={l === locale ? 'is-active' : ''}
                  >
                    {l.toUpperCase()}
                  </a>
                  {i < locales.length - 1 ? <i>·</i> : null}
                </span>
              ))}
            </div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mobile__mail">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </>
  );
}

const SITE = 'Clever Way Media';

