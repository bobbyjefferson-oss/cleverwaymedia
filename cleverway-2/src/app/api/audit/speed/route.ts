import { NextResponse } from 'next/server';
import { AuditError, runSpeed } from '@/lib/audit';
import { rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  if (rateLimited(req, 'speed')) return NextResponse.json({ error: 'rate' }, { status: 429 });
  const { url } = await req.json().catch(() => ({ url: '' }));
  try {
    return NextResponse.json({ check: await runSpeed(String(url || '')) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof AuditError ? e.code : 'unreachable' }, { status: 400 });
  }
}
