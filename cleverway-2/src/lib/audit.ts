import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

// Server-side engine for the free Website-Check (/website-check).
// Texts for every check id live in messages/*.json under "audit.checks".

import type { AuditResult, CheckResult, CheckStatus } from './audit-shared';

const UA = 'Mozilla/5.0 (compatible; CleverWayMediaCheck/1.0; +https://www.cleverwaymedia.de)';
const MAX_BYTES = 3_000_000;

export class AuditError extends Error {
  constructor(public code: 'invalid' | 'blocked' | 'unreachable' | 'notHtml') {
    super(code);
  }
}

/** Accepts "example.de", "www.example.de/page", "https://…" and returns a normalized URL. */
export function normalizeUrl(input: string): URL {
  let s = (input || '').trim();
  if (!s || s.length > 300) throw new AuditError('invalid');
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    throw new AuditError('invalid');
  }
  if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) throw new AuditError('invalid');
  if (u.port && !['80', '443'].includes(u.port)) throw new AuditError('invalid');
  if (!u.hostname.includes('.') || isIP(u.hostname)) throw new AuditError('invalid');
  return u;
}

function isPrivateIp(ip: string) {
  if (ip.includes(':')) {
    const v = ip.toLowerCase();
    if (v.startsWith('::ffff:')) return isPrivateIp(v.slice(7));
    return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80');
  }
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
  );
}

// Refuse anything that resolves to an internal address (SSRF protection).
async function assertPublicHost(hostname: string) {
  let addrs: { address: string }[];
  try {
    addrs = await lookup(hostname, { all: true });
  } catch {
    throw new AuditError('unreachable');
  }
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new AuditError('blocked');
}

/** fetch with manual redirects so every hop is re-validated. */
async function safeFetch(url: URL, timeoutMs = 10_000) {
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    await assertPublicHost(current.hostname);
    const res = await fetch(current, {
      redirect: 'manual',
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*;q=0.8' },
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    });
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      current = normalizeUrl(new URL(loc, current).toString());
      continue;
    }
    return { res, finalUrl: current };
  }
  throw new AuditError('unreachable');
}

async function readText(res: Response) {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder('utf-8').decode(Buffer.concat(chunks));
}

async function exists(url: URL) {
  try {
    const { res } = await safeFetch(url, 6_000);
    res.body?.cancel().catch(() => {});
    return res.ok;
  } catch {
    return false;
  }
}

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))?.slice(1).find((v) => v !== undefined);
const metaContent = (html: string, key: string) => {
  const tag = (html.match(/<meta\b[^>]*>/gi) || []).find((m) => {
    const k = (attr(m, 'name') || attr(m, 'property') || '').toLowerCase();
    return k === key;
  });
  return tag ? (attr(tag, 'content') || '').trim() : undefined;
};
const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

export async function runAudit(input: string): Promise<AuditResult> {
  let res: Response, finalUrl: URL;
  let start = Date.now();
  const target = normalizeUrl(input);
  try {
    ({ res, finalUrl } = await safeFetch(target));
  } catch (e) {
    if (e instanceof AuditError && e.code !== 'unreachable') throw e;
    // Typed without a scheme and HTTPS failed: many older sites only answer on plain HTTP.
    if (/^https?:\/\//i.test(input.trim())) throw new AuditError('unreachable');
    try {
      start = Date.now();
      ({ res, finalUrl } = await safeFetch(new URL(target.toString().replace(/^https:/, 'http:'))));
    } catch (e2) {
      if (e2 instanceof AuditError) throw e2;
      throw new AuditError('unreachable');
    }
  }
  const ms = Date.now() - start;
  if (!(res.headers.get('content-type') || '').includes('html')) throw new AuditError('notHtml');
  const html = await readText(res);
  if (!res.ok || !/<html|<head|<body/i.test(html)) throw new AuditError('unreachable');

  const origin = new URL('/', finalUrl);
  const [robots, sitemap] = await Promise.all([
    exists(new URL('/robots.txt', origin)),
    exists(new URL('/sitemap.xml', origin)),
  ]);

  const checks: CheckResult[] = [];
  const add = (id: string, weight: number, status: CheckStatus, value?: string | number) =>
    checks.push({ id, weight, status, value });

  // 1. HTTPS
  add('https', 10, finalUrl.protocol === 'https:' ? 'pass' : 'fail');

  // 2. Server response time
  add('response', 8, ms < 800 ? 'pass' : ms < 2000 ? 'warn' : 'fail', ms);

  // 3. Mobile viewport
  const viewport = metaContent(html, 'viewport') || '';
  add('viewport', 10, /width\s*=\s*device-width/i.test(viewport) ? 'pass' : 'fail');

  // 4. Title
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  add('title', 8, !title ? 'fail' : title.length >= 15 && title.length <= 65 ? 'pass' : 'warn', title.length);

  // 5. Meta description
  const desc = decode(metaContent(html, 'description') || '');
  add('description', 8, !desc ? 'fail' : desc.length >= 70 && desc.length <= 165 ? 'pass' : 'warn', desc.length);

  // 6. H1
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  add('h1', 6, h1 === 1 ? 'pass' : h1 > 1 ? 'warn' : 'fail', h1);

  // 7. Contact options on the page
  const tel = /href\s*=\s*["']tel:/i.test(html);
  const mail = /href\s*=\s*["']mailto:/i.test(html) || /<form\b/i.test(html) || /wa\.me\/|api\.whatsapp\.com/i.test(html);
  add('contact', 8, tel ? 'pass' : mail ? 'warn' : 'fail');

  // 8. Legal pages (Impressum / privacy)
  const links = (html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || []).join(' ').toLowerCase();
  const imprint = /impressum|imprint|impresszum|legal notice|mentions/.test(links);
  const privacy = /datenschutz|privacy|adatv[ée]delem|confiden[țt]ialitate|gdpr|dsgvo/.test(links);
  add('legal', 6, imprint && privacy ? 'pass' : imprint || privacy ? 'warn' : 'fail');

  // 9. Structured data (Google understands the business)
  const ld = (html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []).join(' ');
  const business = /"@type"\s*:\s*"?[^"]*(LocalBusiness|Organization|ProfessionalService|Store|Restaurant|Dentist|Physician|Attorney|HomeAndConstructionBusiness|AutomotiveBusiness|HealthAndBeautyBusiness)/i.test(ld);
  add('schema', 6, business ? 'pass' : ld ? 'warn' : 'fail');

  // 10. Image alt texts
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const withAlt = imgs.filter((t) => (attr(t, 'alt') ?? '').trim().length > 0).length;
  const altRatio = imgs.length ? withAlt / imgs.length : 1;
  add('alt', 5, altRatio >= 0.9 ? 'pass' : altRatio >= 0.5 ? 'warn' : 'fail', Math.round(altRatio * 100));

  // 11. robots.txt + sitemap
  add('crawl', 5, robots && sitemap ? 'pass' : robots || sitemap ? 'warn' : 'fail');

  // 12. Social previews (Open Graph)
  const og = [metaContent(html, 'og:title'), metaContent(html, 'og:image')].filter(Boolean).length;
  add('og', 4, og === 2 ? 'pass' : og === 1 ? 'warn' : 'fail');

  // 13. Language attribute
  add('lang', 3, /<html[^>]*\blang\s*=\s*["']?[a-z]{2}/i.test(html) ? 'pass' : 'fail');

  // 14. Favicon
  add('favicon', 2, /<link[^>]+rel\s*=\s*["'][^"']*icon/i.test(html) ? 'pass' : 'warn');

  return { url: finalUrl.toString(), host: finalUrl.hostname.replace(/^www\./, ''), ms, checks };
}

/** Google PageSpeed Insights, mobile. Returns null when the API is unavailable. */
export async function runSpeed(input: string): Promise<CheckResult | null> {
  const url = normalizeUrl(input).toString();
  const qs = new URLSearchParams({ url, strategy: 'mobile', category: 'performance' });
  if (process.env.PAGESPEED_API_KEY) qs.set('key', process.env.PAGESPEED_API_KEY);
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${qs}`, {
      signal: AbortSignal.timeout(55_000),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const score = data?.lighthouseResult?.categories?.performance?.score;
    if (typeof score !== 'number') return null;
    const pct = Math.round(score * 100);
    return { id: 'speed', weight: 15, status: pct >= 80 ? 'pass' : pct >= 50 ? 'warn' : 'fail', value: pct };
  } catch {
    return null;
  }
}
