import { describe, expect, it } from 'vitest';
import { defaultLocale, matchPath, otherLocale, pathFor, routes, switchPath } from './index';

describe('route map', () => {
  it('defaults to Spanish', () => expect(defaultLocale).toBe('es'));

  it('round-trips every path through the switch', () => {
    for (const r of routes) {
      expect(switchPath(r.es)).toBe(r.en);
      expect(switchPath(r.en)).toBe(r.es);
      expect(switchPath(switchPath(r.es)!)).toBe(r.es);
    }
  });

  it('pairs the unlike paths', () => {
    expect(switchPath('/calidad/')).toBe('/en/quality/');
    expect(switchPath('/en/')).toBe('/');
  });

  it('matches paths and ignores unknown ones', () => {
    expect(matchPath('/en/menu/qr/')).toEqual({ id: 'qr', locale: 'en' });
    expect(matchPath('/nope/')).toBeUndefined();
    expect(switchPath('/nope/')).toBeUndefined();
  });

  it('has no duplicate paths', () => {
    const all = routes.flatMap((r) => [r.es, r.en]);
    expect(new Set(all).size).toBe(all.length);
    expect(pathFor('home', otherLocale('es'))).toBe('/en/');
  });
});
