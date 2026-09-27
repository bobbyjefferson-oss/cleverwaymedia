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
  const clientRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endCall = useCallback(() => {
    try {
      clientRef.current?.stopCall?.();
    } catch {
      /* no-op: call may already be closed */
    }
    cleanup();
    setStatus((s) => (s === 'error' ? s : 'ended'));
  }, [cleanup]);

  useEffect(() => cleanup, [cleanup]);

  const startCall = useCallback(async () => {
    if (!AGENT_ID || !PUBLIC_KEY) {
      setStatus('error');
      return;
    }
    setStatus('connecting');
    setSeconds(0);
    try {
      const { RetellClient } = await import('retell-client-js-sdk');
      const client = new RetellClient({ key: PUBLIC_KEY });
      clientRef.current = client;

      client.on?.('call_started', () => setStatus('active'));
      client.on?.('call_ended', () => {
        cleanup();
        setStatus('ended');
      });
      client.on?.('error', () => {
        cleanup();
        setStatus('error');
      });

      await client.createWebCall({ agentId: AGENT_ID });

      // Fallback: if no 'call_started' event fires, still reflect connection.
      setStatus('active');
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            endCall();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      cleanup();
      setStatus('error');
    }
  }, [cleanup, endCall]);

  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
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

      {status === 'active' ? (
        <button type="button" className="btn btn--ghost voice-demo__btn" onClick={endCall}>
          {t('endBtn')}
        </button>
      ) : (
        <button
          type="button"
          className="btn btn--gold voice-demo__btn"
          onClick={startCall}
          disabled={status === 'connecting'}
        >
          {status === 'connecting' ? t('connecting') : t('startBtn')} <span className="btn__arrow">→</span>
        </button>
      )}

      <p className="voice-demo__note">{t('privacyNote')}</p>
    </div>
  );
}
