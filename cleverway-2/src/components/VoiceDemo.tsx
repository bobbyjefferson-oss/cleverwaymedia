'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID || 'agent_f8be111504f83c267bdc21551f';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY || 'public_key_5d41d70fdd30653b2fb7c';
const MAX_SECONDS = 120; // hard cap so a public demo can't run away in cost

type Status = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

export default function VoiceDemo() {
  const t = useTranslations('voiceDemo');
  const [status, setStatus] = useState<Status>('idle');
  const [seconds, setSeconds] = useState(0);
  // Typed as `any` on purpose: keeps the build independent of SDK typing changes.
  const callRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (next >= MAX_SECONDS) {
          stopTimer();
          try {
            callRef.current?.end?.();
          } catch {
            /* already ended */
          }
        }
        return next;
      });
    }, 1000);
  }, [stopTimer]);

  const endCall = useCallback(async () => {
    try {
      await callRef.current?.end?.();
    } catch {
      /* already ended */
    }
    stopTimer();
    setStatus((s) => (s === 'error' ? s : 'ended'));
  }, [stopTimer]);

  // Clean up if the user navigates away mid-call.
  useEffect(
    () => () => {
      stopTimer();
      try {
        callRef.current?.end?.();
      } catch {
        /* no-op */
      }
    },
    [stopTimer]
  );

  const startCall = useCallback(async () => {
    if (callRef.current && callRef.current.status !== 'ended') return;
    setStatus('connecting');
    setSeconds(0);
    try {
      const mod: any = await import('retell-client-js-sdk');
      const client: any = new mod.RetellClient({ key: PUBLIC_KEY });

      callRef.current = client.createWebCall({
        agent_id: AGENT_ID,
        hooks: {
          onStatus: (s: string) => {
            if (s === 'live') {
              setStatus('active');
              startTimer();
            } else if (s === 'ended') {
              stopTimer();
              setStatus((prev) => (prev === 'error' ? prev : 'ended'));
            }
          },
          onEnd: () => {
            stopTimer();
            setStatus((prev) => (prev === 'error' ? prev : 'ended'));
          },
          onError: () => {
            stopTimer();
            setStatus('error');
          },
        },
      });
    } catch {
      stopTimer();
      setStatus('error');
    }
  }, [startTimer, stopTimer]);

  const mm = String(Math.floor(seconds / 60));
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="voice-demo">
      <div className="voice-demo__row">
        <div className={`voice-demo__dot voice-demo__dot--${status}`} />
        <div className="voice-demo__text">
          {status === 'idle' && <p>{t('idle')}</p>}
          {status === 'connecting' && <p>{t('connecting')}</p>}
          {status === 'active' && (
            <p>
              {t('active')} <span className="voice-demo__timer">{mm}:{ss}</span>
            </p>
          )}
          {status === 'ended' && <p>{t('ended')}</p>}
          {status === 'error' && <p>{t('error')}</p>}
        </div>
      </div>

      {status === 'active' || status === 'connecting' ? (
        <button type="button" className="btn btn--ghost voice-demo__btn" onClick={endCall}>
          {t('endBtn')}
        </button>
      ) : (
        <button type="button" className="btn btn--gold voice-demo__btn" onClick={startCall}>
          {t('startBtn')} <span className="btn__arrow">→</span>
        </button>
      )}

      <p className="voice-demo__note">{t('privacyNote')}</p>
    </div>
  );
}
