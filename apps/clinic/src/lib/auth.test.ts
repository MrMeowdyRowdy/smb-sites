import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SESSION_SECONDS, checkPassword, secret, signSession, verifySession } from './auth';

beforeEach(() => {
  process.env.ADMIN_PASSWORD = 'correct horse';
  process.env.SESSION_SECRET = 'unit-test-session-secret';
});
afterEach(() => {
  delete process.env.ADMIN_PASSWORD;
  delete process.env.SESSION_SECRET;
});

describe('admin session', () => {
  it('checks the password', () => {
    expect(checkPassword('correct horse')).toBe(true);
    expect(checkPassword('wrong')).toBe(false);
  });
  it('never matches when ADMIN_PASSWORD is unset', () => {
    delete process.env.ADMIN_PASSWORD;
    expect(checkPassword('')).toBe(false);
  });
  it('refuses sessions without a SESSION_SECRET of 16+ characters (no fallback to the password)', () => {
    delete process.env.SESSION_SECRET;
    expect(secret()).toBe('');
    expect(verifySession(signSession())).toBe(false);
    process.env.SESSION_SECRET = 'too-short';
    expect(verifySession(signSession())).toBe(false);
  });
  it('accepts its own cookie and rejects tampering and expiry', () => {
    const now = Date.now();
    const t = signSession(now);
    expect(verifySession(t, now)).toBe(true);
    expect(verifySession(t.replace(/.$/, (c) => (c === '0' ? '1' : '0')), now)).toBe(false);
    expect(verifySession(`9999999999.${t.split('.')[1]}`, now)).toBe(false);
    expect(verifySession(t, now + (SESSION_SECONDS + 1) * 1000)).toBe(false);
    expect(verifySession(undefined)).toBe(false);
  });
});
