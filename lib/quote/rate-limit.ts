type Hit = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * A sliding window in module memory.
 *
 * ⚠️  Serverless caveat, stated rather than buried: this is per instance, so
 *     a determined flood spread across cold starts gets through. It is a
 *     speed bump for the ordinary case — a stuck submit button, one bot — and
 *     it costs nothing. If real spam appears, move this to Upstash or
 *     Vercel KV so the counter is shared, and only then consider a captcha.
 *     The brief's order is right: honeypot, then rate limit, then captcha
 *     only if needed.
 */
const hits = new Map<string, Hit>();

export function rateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = hits.get(key);

  if (!existing || now > existing.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic sweep — no timers in a serverless function.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > MAX_PER_WINDOW) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Bots fill a form faster than a person can read it. */
export const MIN_FILL_MS = 4000;
