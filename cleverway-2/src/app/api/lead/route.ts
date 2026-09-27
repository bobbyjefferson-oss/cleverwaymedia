import { NextResponse } from 'next/server';
import { FORM_ENDPOINT, SITE_URL } from '@/lib/site';
import { rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Forwards form submissions to Formspree from the server, so ad blockers and
// browser privacy settings can't silently drop a lead. Failures show up in Vercel logs.
export async function POST(req: Request) {
  if (rateLimited(req, 'lead', 6)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>).slice(0, 25)) {
    if (typeof v === 'string' || typeof v === 'number') fields[k.slice(0, 40)] = String(v).slice(0, 5000);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email || '')) {
    return NextResponse.json({ ok: false, error: 'email' }, { status: 400 });
  }
  if (fields.email) fields._replyto = fields.email;

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: SITE_URL,
        Referer: req.headers.get('referer') || SITE_URL,
      },
      body: JSON.stringify(fields),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      console.error('[lead] Formspree rejected submission', res.status, JSON.stringify(data), fields.source || '');
      return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 });
    }
    console.log('[lead] forwarded', fields.source || 'form', fields.email.replace(/^(.).*@/, '$1***@'));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[lead] Formspree unreachable', String(e));
    return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 });
  }
}
