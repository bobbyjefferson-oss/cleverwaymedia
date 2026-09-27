// Best-effort per-instance rate limit so the Website-Check can't be used to hammer other sites.
const hits = new Map<string, number[]>();

export function rateLimited(req: Request, bucket: string, max = 10, windowMs = 10 * 60_000) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
