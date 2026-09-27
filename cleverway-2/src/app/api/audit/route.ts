import { NextResponse } from 'next/server';
import { AuditError, runAudit } from '@/lib/audit';
import { rateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  if (rateLimited(req, 'audit')) return NextResponse.json({ error: 'rate' }, { status: 429 });
  const { url } = await req.json().catch(() => ({ url: '' }));
  try {
    return NextResponse.json(await runAudit(String(url || '')));
  } catch (e) {
    const code = e instanceof AuditError ? e.code : 'unreachable';
    return NextResponse.json({ error: code }, { status: code === 'invalid' ? 400 : 422 });
  }
}
