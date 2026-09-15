'use client';

import { useEffect, useId, useState } from 'react';

declare global {
  interface Window {
    Cal?: any;
  }
}

/**
 * Renders a real, inline Cal.com booking calendar (date + time picker).
 * Cal.com handles Google Calendar sync and automatic confirmation emails
 * on their side once you connect your calendar in the Cal.com dashboard —
 * no extra backend code needed here.
 *
 * Setup (5 minutes):
 * 1. Create a free account at https://cal.com
 * 2. Settings → Availability → connect your Google Calendar
 * 3. Create an event type (e.g. "30min") and copy your link,
 *    e.g. cal.com/marwan/30min → calLink = "marwan/30min"
 * 4. Put it in .env.local:  NEXT_PUBLIC_CALCOM_LINK=marwan/30min
 */
export default function CalEmbed({ calLink, origin = 'https://cal.com' }: { calLink: string; origin?: string }) {
  const containerId = useId().replace(/:/g, '');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!calLink) return;

    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    window.Cal('init', { origin });
    window.Cal('inline', {
      elementOrSelector: `#${containerId}`,
      calLink,
      layout: 'month_view',
      config: {
        theme: 'dark',
      },
    });
    window.Cal('ui', {
      theme: 'dark',
      cssVarsPerTheme: {
        dark: { 'cal-brand': '#c99f60' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });

    setReady(true);
  }, [calLink, containerId]);

  if (!calLink) return null;

  return (
    <div
      id={containerId}
      style={{
        width: '100%',
        minHeight: 650,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid var(--line)',
        background: 'rgba(255,255,255,.02)',
        opacity: ready ? 1 : 0,
        transition: 'opacity .4s',
      }}
    />
  );
}
