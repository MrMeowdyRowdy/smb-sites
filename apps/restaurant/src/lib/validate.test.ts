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
    expect(validateMenu({ ...menu, seasonal: { ...menu.seasonal, from: '13-40' } }).join()).toMatch(/seasonal/);
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
  it('incomplete credit', () => expect(validateCredits([{ file: 'a.jpg' }]).length).toBe(3));
});
