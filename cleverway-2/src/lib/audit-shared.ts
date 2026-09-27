// Types + scoring shared by the audit API routes and the WebsiteCheck client component.

export type CheckStatus = 'pass' | 'warn' | 'fail';
export type CheckResult = { id: string; status: CheckStatus; weight: number; value?: string | number };
export type AuditResult = { url: string; host: string; ms: number; checks: CheckResult[] };

export function scoreOf(checks: CheckResult[]) {
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + c.weight * (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0), 0);
  return total ? Math.round((got / total) * 100) : 0;
}

/** Problems first: fails before warnings, heavier checks first. */
export function sortByPriority(checks: CheckResult[]) {
  const rank = { fail: 0, warn: 1, pass: 2 } as const;
  return [...checks].sort((a, b) => rank[a.status] - rank[b.status] || b.weight - a.weight);
}
