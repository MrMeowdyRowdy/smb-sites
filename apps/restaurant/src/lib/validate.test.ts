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

describe('site and credits validation catch mistakes', () => {
  it('bad whatsapp and hours', () => {
    const e = validateSite({ ...site, whatsapp: '+593 9', hours: [{ ...site.hours[0], opens: '7:30' }] }).join();
    expect(e).toMatch(/whatsapp/);
    expect(e).toMatch(/opens/);
  });
  it('incomplete credit', () => expect(validateCredits([{ file: 'a.jpg' }]).length).toBe(3));
});
