'use client';

import { useTranslations } from 'next-intl';
import { OPEN_VOICE_EVENT } from '@/components/VoiceWidget';

export default function VoiceOpenButton() {
  const t = useTranslations('voiceWidget');
  return (
    <button
      type="button"
      className="btn btn--gold vw-tile-btn"
      onClick={() => window.dispatchEvent(new Event(OPEN_VOICE_EVENT))}
    >
      {t('tileBtn')} <span className="btn__arrow">→</span>
    </button>
  );
}
