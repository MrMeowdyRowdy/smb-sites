import { describe, expect, it } from 'vitest';
import credits from '../../content/credits.json';
import menu from '../../content/menu.json';
import site from '../../content/site.json';
import { validateCredits, validateMenu, validateSite } from './validate';

describe('shipped content', () => {
  it('menu.json is valid', () => expect(validateMenu(menu)).toEqual([]));
  it('site.json is valid', () => expect(validateSite(site)).toEqual([]));
  it('credits.json is valid', () => expect(validateCredits(credits)).toEqual([]));
  it('menu has about two dozen items in five categories', () => {
    expect(menu.categories).toHaveLength(5);
    expect(menu.items.length).toBeGreaterThanOrEqual(22);
  });
});

describe('menu validation catches mistakes', () => {
  const item = menu.items[0];
  const with_ = (items: unknown[]) => validateMenu({ ...menu, items });

  it('duplicate ids', () => expect(with_([item, item]).join()).toMatch(/duplicate item id/));
  it('missing locale', () => expect(with_([{ ...item, name: { es: 'x' } }]).join()).toMatch(/name needs es and en/));
  it('unknown category', () => expect(with_([{ ...item, category: 'nope' }]).join()).toMatch(/unknown category/));
  it('price not above zero', () => {
    expect(with_([{ ...item, price: 0 }]).join()).toMatch(/price/);
    expect(with_([{ ...item, price: '3' }]).join()).toMatch(/price/);
  });
  it('bad tag', () => expect(with_([{ ...item, tags: ['spicy'] }]).join()).toMatch(/tags/));
});

describe('featured, seasonal, rituals and origin', () => {
  it('featured must be exactly 4 existing ids', () => {
    expect(validateMenu({ ...menu, featured: menu.featured.slice(0, 3) }).join()).toMatch(/featured/);
    expect(validateMenu({ ...menu, featured: [...menu.featured.slice(0, 3), 'nope'] }).join()).toMatch(/featured/);
  });
  it('seasonal is optional but must be well formed', () => {
    const { seasonal: _s, ...rest } = menu;
    void _s;
    expect(validateMenu(rest)).toEqual([]);
    expect(validateMenu({ ...menu, seasonal: [{ ...menu.seasonal![0], from: '13-40' }] }).join()).toMatch(/seasonal/);
    expect(validateMenu({ ...menu, seasonal: menu.seasonal![0] }).join()).toMatch(/list of windows/);
    expect(validateMenu({ ...menu, seasonal: [{ ...menu.seasonal![0], photo: '' }] }).join()).toMatch(/photo/);
  });
  it('seasonal windows may not overlap, also across New Year', () => {
    const w = menu.seasonal![0];
    expect(validateMenu({ ...menu, seasonal: [w, { ...w, from: '12-15', to: '01-06' }] })).toEqual([]);
    expect(validateMenu({ ...menu, seasonal: [w, { ...w, from: '11-01', to: '11-10' }] }).join()).toMatch(/overlap/);
    expect(validateMenu({ ...menu, seasonal: [{ ...w, from: '12-30', to: '01-02' }, { ...w, from: '12-15', to: '01-06' }] }).join()).toMatch(/overlap/);
  });
  it('rituals need a valid time and both languages', () => {
    expect(validateSite({ ...site, rituals: [{ ...site.rituals[1], at: '25:00' }] }).join()).toMatch(/ritual pan: at/);
    expect(validateSite({ ...site, rituals: [{ ...site.rituals[1], note: { es: 'x' } }] }).join()).toMatch(/label and note/);
  });
  it('origin is optional (skipped) but must be complete when present', () => {
    const { origin: _o, ...rest } = site;
    void _o;
    expect(validateSite(rest)).toEqual([]);
    expect(validateSite({ ...site, origin: { ...site.origin, stages: site.origin.stages.slice(0, 3) } }).join()).toMatch(/origin/);
  });
  it('atmosphere must be fog or none', () => expect(validateSite({ ...site, atmosphere: 'rain' }).join()).toMatch(/atmosphere/));
});

describe('site and credits validation catch mistakes', () => {
  it('bad whatsapp and hours', () => {
    const e = validateSite({ ...site, whatsapp: '+593 9', hours: [{ ...site.hours[0], opens: '7:30' }] }).join();
    expect(e).toMatch(/whatsapp/);
    expect(e).toMatch(/opens/);
  });
  it('hours: real weekday names, each day once, open before close', () => {
    expect(validateSite({ ...site, hours: [{ ...site.hours[0], days: ['Lunes'] }] }).join()).toMatch(/weekday name/);
    expect(validateSite({ ...site, hours: [site.hours[0], { ...site.hours[1], days: ['Friday'] }] }).join()).toMatch(/Friday twice/);
    expect(validateSite({ ...site, hours: [{ ...site.hours[0], opens: '19:00', closes: '07:30' }] }).join()).toMatch(/open before they close/);
  });
  it('the shipped hours cover every day of the week', () => expect(site.hours.flatMap((h) => h.days).sort()).toEqual(['Friday', 'Monday', 'Saturday', 'Sunday', 'Thursday', 'Tuesday', 'Wednesday']));
  it('altitudes written in the origin text match the origin numbers, formatted per locale', () => {
    const o = site.origin;
    const fmt = (n: number, sep: string) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    const allowed = { es: [o.from.altitude, o.to.altitude].map((n) => fmt(n, '.')), en: [o.from.altitude, o.to.altitude].map((n) => fmt(n, ',')) };
    for (const g of o.stages)
      for (const l of ['es', 'en'] as const)
        for (const m of g.text[l].match(/\d[\d.,]*\d(?= (metros|meters))/g) ?? []) expect(allowed[l]).toContain(m);
  });
  it('incomplete credit', () => expect(validateCredits([{ file: 'a.jpg' }]).length).toBe(3));
});
