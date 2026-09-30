'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n/routing';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';

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
    document.body.classList.toggle('menu-open', open);
  }, [open]);

  // Safety net: if the desktop row (brand + links + languages + CTA) doesn't fit
  // at the current width/language, fall back to the burger instead of overlapping.
  const innerRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const check = () => {
      const header = inner.parentElement!;
      header.classList.remove('nav--compact');
      const links = inner.querySelector<HTMLElement>('.nav__links');
      if (!links || getComputedStyle(links).display === 'none') return setCompact(false);
      const cs = getComputedStyle(inner);
      const gap = parseFloat(cs.columnGap) || 0;
      const needed = [...inner.children]
        .filter((el) => getComputedStyle(el).display !== 'none')
        .reduce((sum, el, i) => sum + el.getBoundingClientRect().width + (i ? gap : 0), 0);
      const available = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const tooWide = needed > available - 8;
      header.classList.toggle('nav--compact', tooWide);
      setCompact(tooWide);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(inner);
    document.fonts?.ready.then(check);
    return () => ro.disconnect();
  }, [locale]);

  const Monogram = (
    <svg className="brand__mark" viewBox="0 0 100 100" aria-hidden="true">
      <text x="8" y="72" style={{ fontFamily: 'var(--font-fraunces)' }} fontWeight="600" fontSize="72" fill="currentColor">C</text>
      <text x="46" y="76" style={{ fontFamily: 'var(--font-fraunces)' }} fontStyle="italic" fontWeight="500" fontSize="58" fill="#c99f60">w</text>
    </svg>
  );

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}${compact ? ' nav--compact' : ''}`} id="nav">
        <div className="wrap nav__inner" ref={innerRef}>
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
            <a href={CONTACT_PHONE_HREF} className="mobile__mail">{CONTACT_PHONE}</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mobile__mail">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </>
  );
}

const SITE = 'Clever Way Media';

