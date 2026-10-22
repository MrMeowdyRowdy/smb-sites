import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'clinic_admin';
export const SESSION_SECONDS = 8 * 3600;

// No fallback to ADMIN_PASSWORD: a cookie signed with it would let a stolen cookie crack the password offline.
export const secret = (): string => ((process.env.SESSION_SECRET ?? '').length >= 16 ? process.env.SESSION_SECRET! : '');
const mac = (payload: string): string => createHmac('sha256', secret()).update(payload).digest('hex');
const sha = (s: string): Buffer => createHash('sha256').update(s).digest();

/** Constant-time comparison against ADMIN_PASSWORD. An unset password never matches. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && timingSafeEqual(sha(input), sha(expected));
}

/** Cookie value: expiry (unix seconds) and an HMAC of it. No user data inside. */
export function signSession(now = Date.now()): string {
  const exp = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${exp}.${mac(exp)}`;
}

export function verifySession(token: string | undefined, now = Date.now()): boolean {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) * 1000 < now) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(mac(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
