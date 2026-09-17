'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/Reveal';
import { CONTACT_EMAIL, FORM_ENDPOINT, SOCIAL, buildMailto } from '@/lib/site';

export default function Contact() {
  const t = useTranslations('contact');
  const budgetOptions = t.raw('form.budgetOptions') as string[];
  const serviceOptions = t.raw('form.serviceOptions') as string[];
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;

    if (FORM_ENDPOINT) {
      try {
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch {
        // Endpoint failed — still fall back to mailto so the message isn't lost.
        window.location.href = buildMailto(`Neue Anfrage von ${data.name || 'Website'}`, data);
      }
    } else {
      // No backend configured yet — open the visitor's mail client with everything pre-filled.
      window.location.href = buildMailto(`Neue Anfrage von ${data.name || 'Website'}`, data);
    }
    setSent(true);
  }

  return (
    <section className="section" id="kontakt" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <div className="contact-grid">
          <Reveal className="contact__info">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="h-md">{t('h2')}</h2>
            <p className="lead" style={{ marginTop: 16, fontSize: '1.05rem' }}>{t('lead')}</p>
            <div className="contact__block"><div className="k">{t('emailLabel')}</div><div className="v">{CONTACT_EMAIL}</div></div>
            <div className="contact__block"><div className="k">{t('marketsLabel')}</div><div className="v">{t('markets')}</div></div>
            <div className="contact__block"><div className="k">{t('langLabel')}</div><div className="v">{t('langs')}</div></div>
            <div className="contact__block">
              <div className="k">{t('followLabel')}</div>
              <div className="socials">
                {SOCIAL.instagram ? (
                  <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
                ) : (
                  <span className="social-soon" title={t('soon')} aria-disabled="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></span>
                )}
                {SOCIAL.linkedin ? (
                  <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" /></svg></a>
                ) : (
                  <span className="social-soon" title={t('soon')} aria-disabled="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" /></svg></span>
                )}
                {SOCIAL.facebook ? (
                  <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
                ) : (
                  <span className="social-soon" title={t('soon')} aria-disabled="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></span>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal as="div" delay={0.1}>
            {sent ? (
              <div className="form" style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold-2)" strokeWidth="1.8" style={{ margin: '0 auto 12px' }}><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>
                <h3 className="h-md" style={{ marginBottom: 8 }}>{t('form.successTitle')}</h3>
                <p style={{ color: 'var(--muted)' }}>{t('form.successText')}</p>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit}>
                <div className="frow">
                  <div className="field"><label htmlFor="name">{t('form.name')}</label><input id="name" name="name" type="text" /></div>
                  <div className="field"><label htmlFor="company">{t('form.company')}</label><input id="company" name="company" type="text" /></div>
                </div>
                <div className="frow">
                  <div className="field"><label htmlFor="email">{t('form.email')}</label><input id="email" name="email" type="email" required /></div>
                  <div className="field"><label htmlFor="phone">{t('form.phone')}</label><input id="phone" name="phone" type="tel" /></div>
                </div>
                <div className="frow">
                  <div className="field"><label htmlFor="budget">{t('form.budget')}</label>
                    <select id="budget" name="budget" defaultValue="">
                      <option value="" disabled>{t('form.select')}</option>
                      {budgetOptions.map((o, i) => <option key={i}>{o}</option>)}
                    </select>
                  </div>
                  <div className="field"><label htmlFor="service">{t('form.service')}</label>
                    <select id="service" name="service" defaultValue="">
                      <option value="" disabled>{t('form.select')}</option>
                      {serviceOptions.map((o, i) => <option key={i}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field"><label htmlFor="message">{t('form.message')}</label><textarea id="message" name="message" /></div>
                <button className="btn btn--gold" type="submit">{t('form.submit')} <span className="btn__arrow">→</span></button>
                <p className="form__note">{t('form.note')}</p>
              </form>
            )}
          </Reveal>
        </div>

        <Reveal className="coverage">
          <div className="coverage__head">
            <h3>{t('coverageTitle')}</h3>
            <span className="coverage__remote">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" /></svg>
              {t('remote')}
            </span>
          </div>
          <p className="coverage__text">{t('coverageText')}</p>
          <div className="coverage__markets">
            {(t.raw('marketsList') as { code: string; name: string }[]).map((m) => (
              <div className="coverage__market" key={m.code}>
                <span className="coverage__code">{m.code}</span>
                <span className="coverage__name">{m.name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
