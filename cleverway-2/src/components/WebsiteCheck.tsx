'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FORM_ENDPOINT } from '@/lib/site';
import { scoreOf, sortByPriority, type AuditResult, type CheckResult } from '@/lib/audit-shared';

const FREE_ISSUES = 3;

type Phase = 'idle' | 'loading' | 'done' | 'error';

function StatusIcon({ status }: { status: CheckResult['status'] }) {
  return (
    <span className={`wc-ico wc-ico--${status}`} aria-hidden="true">
      {status === 'pass' ? '✓' : status === 'warn' ? '!' : '✕'}
    </span>
  );
}

export default function WebsiteCheck() {
  const t = useTranslations('audit');
  const locale = useLocale();
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [speed, setSpeed] = useState<CheckResult | null | 'pending'>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [sending, setSending] = useState(false);

  const checks = result ? [...result.checks, ...(speed && speed !== 'pending' ? [speed] : [])] : [];
  const score = scoreOf(checks);
  const sorted = sortByPriority(checks);
  const issues = sorted.filter((c) => c.status !== 'pass');
  const passed = sorted.filter((c) => c.status === 'pass');
  const verdict = score >= 80 ? 'good' : score >= 50 ? 'ok' : 'bad';
  const text = (c: CheckResult) => t(`checks.${c.id}.${c.status}`, { value: c.value ?? '' });

  async function onCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setPhase('loading');
    setError('');
    setResult(null);
    setUnlocked(false);
    setSpeed('pending');

    const post = (path: string) =>
      fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });

    // PageSpeed is slow (10–40 s): run it in parallel and merge it in when it arrives.
    post('/api/audit/speed')
      .then((r) => (r.ok ? r.json() : { check: null }))
      .then((d) => setSpeed(d.check ?? null))
      .catch(() => setSpeed(null));

    try {
      const res = await post('/api/audit');
      const data = await res.json();
      if (!res.ok) {
        const known = ['invalid', 'blocked', 'unreachable', 'notHtml', 'rate'];
        setError(t(`errors.${known.includes(data.error) ? data.error : 'generic'}`));
        setPhase('error');
        setSpeed(null);
        return;
      }
      setResult(data);
      setPhase('done');
    } catch {
      setError(t('errors.generic'));
      setPhase('error');
      setSpeed(null);
    }
  }

  async function onUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!result) return;
    const form = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setSending(true);
    try {
      if (FORM_ENDPOINT) {
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `Website-Check Lead: ${result.host} (${score}/100)`,
            source: 'Website-Check',
            name: form.name,
            email: form.email,
            phone: form.phone,
            website: result.url,
            score: `${score}/100`,
            language: locale.toUpperCase(),
            problems: issues.map((c) => `[${c.status.toUpperCase()}] ${t(`checks.${c.id}.name`)}: ${text(c)}`).join('\n'),
          }),
        });
      }
    } catch {
      // Never block the visitor from their report because of a form-backend hiccup.
    }
    setSending(false);
    setUnlocked(true);
  }

  const visibleIssues = unlocked ? issues : issues.slice(0, FREE_ISSUES);
  const lockedCount = checks.length - visibleIssues.length;
  const R = 52;
  const C = 2 * Math.PI * R;

  return (
    <div className="wc">
      <form className="wc-form" onSubmit={onCheck}>
        <label htmlFor="wc-url" className="sr-only">{t('placeholder')}</label>
        <input
          id="wc-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={t('placeholder')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={phase === 'loading'}
          required
        />
        <button className="btn btn--gold" type="submit" disabled={phase === 'loading'}>
          {phase === 'loading' ? t('checking') : t('submit')} {phase !== 'loading' && <span className="btn__arrow">→</span>}
        </button>
      </form>

      {phase === 'idle' && (
        <ul className="wc-bullets">
          {(t.raw('bullets') as string[]).map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}

      {phase === 'loading' && (
        <div className="wc-loading" role="status">
          <span className="wc-spinner" aria-hidden="true" />
          {t('checking')}
        </div>
      )}

      {phase === 'error' && <p className="wc-error" role="alert">{error}</p>}

      {phase === 'done' && result && (
        <div className="wc-result">
          <div className="wc-score">
            <svg viewBox="0 0 120 120" className="wc-ring" aria-hidden="true">
              <circle cx="60" cy="60" r={R} className="wc-ring__bg" />
              <circle
                cx="60" cy="60" r={R}
                className={`wc-ring__fg wc-ring__fg--${verdict}`}
                strokeDasharray={C}
                strokeDashoffset={C * (1 - score / 100)}
              />
            </svg>
            <div className="wc-score__num"><b>{score}</b><span>/100</span></div>
            <div className="wc-score__meta">
              <span className="wc-score__k">{t('scoreLabel')}</span>
              <span className={`wc-verdict wc-verdict--${verdict}`}>{t(`verdict.${verdict}`)}</span>
              <span className="wc-host">{result.host}</span>
              {speed === 'pending' && <span className="wc-pending"><span className="wc-spinner" aria-hidden="true" /> {t('speedPending')}</span>}
            </div>
          </div>

          <h2 className="h-md wc-h">{t('issuesTitle')}</h2>
          {issues.length === 0 ? (
            <p className="wc-empty">{t('noIssues')}</p>
          ) : (
            <ul className="wc-list">
              {visibleIssues.map((c) => (
                <li key={c.id} className="wc-item">
                  <StatusIcon status={c.status} />
                  <div>
                    <h3>{t(`checks.${c.id}.name`)}</h3>
                    <p>{text(c)}</p>
                    <p className="wc-tip"><b>{t('tipLabel')}:</b> {t(`checks.${c.id}.tip`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!unlocked && lockedCount > 0 && (
            <div className="wc-lock">
              <p className="wc-lock__count">🔒 {t('locked', { n: lockedCount })}</p>
              <form className="form wc-lead" onSubmit={onUnlock}>
                <h3 className="h-md">{t('unlock.title')}</h3>
                <p className="wc-lead__text">{t('unlock.text')}</p>
                <div className="frow">
                  <div className="field"><label htmlFor="wc-name">{t('unlock.name')}</label><input id="wc-name" name="name" type="text" required autoComplete="name" /></div>
                  <div className="field"><label htmlFor="wc-email">{t('unlock.email')}</label><input id="wc-email" name="email" type="email" required autoComplete="email" /></div>
                </div>
                <div className="field"><label htmlFor="wc-phone">{t('unlock.phone')}</label><input id="wc-phone" name="phone" type="tel" autoComplete="tel" /></div>
                <button className="btn btn--gold" type="submit" disabled={sending}>
                  {t('unlock.submit')} <span className="btn__arrow">→</span>
                </button>
                <p className="form__note">{t('unlock.note')}</p>
              </form>
            </div>
          )}

          {unlocked && passed.length > 0 && (
            <>
              <h2 className="h-md wc-h">{t('passedTitle')}</h2>
              <ul className="wc-list wc-list--passed">
                {passed.map((c) => (
                  <li key={c.id} className="wc-item">
                    <StatusIcon status={c.status} />
                    <div>
                      <h3>{t(`checks.${c.id}.name`)}</h3>
                      <p>{text(c)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="kar-cta wc-cta">
            <h3>{t('ctaTitle')}</h3>
            <p>{t('ctaText')}</p>
            <a href={`/${locale}#termin`} className="btn btn--gold">{t('ctaBtn')} <span className="btn__arrow">→</span></a>
          </div>

          <button
            type="button"
            className="wc-again"
            onClick={() => { setPhase('idle'); setResult(null); setUrl(''); setSpeed(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            ← {t('again')}
          </button>
        </div>
      )}

      <p className="wc-privacy">{t('privacy')}</p>
    </div>
  );
}
