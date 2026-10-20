/** Checks the client-editable JSON files. Returns a list of problems; empty means valid. */
const LOCALES = ['es', 'en'] as const;
const TAGS = ['vegetarian', 'vegan', 'gluten-free'];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const text = (v: unknown) => typeof v === 'string' && v.trim() !== '';
const bothLocales = (v: unknown) => isObj(v) && LOCALES.every((l) => text(v[l]));

export function validateMenu(data: unknown): string[] {
  const errors: string[] = [];
  if (!isObj(data) || !Array.isArray(data.categories) || !Array.isArray(data.items)) return ['menu: needs "categories" and "items" arrays'];
  const catIds = new Set<string>();
  for (const c of data.categories as Obj[]) {
    if (!text(c.id)) errors.push('category without id');
    else if (catIds.has(c.id as string)) errors.push(`duplicate category id: ${c.id}`);
    else catIds.add(c.id as string);
    if (!bothLocales(c.name)) errors.push(`category ${c.id}: name needs es and en`);
  }
  const ids = new Set<string>();
  for (const i of data.items as Obj[]) {
    if (!text(i.id)) errors.push('item without id');
    else if (ids.has(i.id as string)) errors.push(`duplicate item id: ${i.id}`);
    else ids.add(i.id as string);
    if (!catIds.has(i.category as string)) errors.push(`item ${i.id}: unknown category "${i.category}"`);
    if (!bothLocales(i.name)) errors.push(`item ${i.id}: name needs es and en`);
    if (!bothLocales(i.description)) errors.push(`item ${i.id}: description needs es and en`);
    if (typeof i.price !== 'number' || !(i.price > 0)) errors.push(`item ${i.id}: price must be a number above 0`);
    if (!Array.isArray(i.tags) || i.tags.some((t) => !TAGS.includes(t as string))) errors.push(`item ${i.id}: tags must be from ${TAGS.join(', ')}`);
    if (typeof i.available !== 'boolean') errors.push(`item ${i.id}: available must be true or false`);
  }
  return errors;
}

export function validateSite(data: unknown): string[] {
  const errors: string[] = [];
  if (!isObj(data)) return ['site: must be an object'];
  if (!text(data.name)) errors.push('site: name missing');
  if (!bothLocales(data.tagline)) errors.push('site: tagline needs es and en');
  if (!bothLocales(data.description)) errors.push('site: description needs es and en');
  const a = data.address;
  if (!isObj(a) || !['street', 'neighborhood', 'city', 'region', 'country'].every((k) => text(a[k]))) errors.push('site: address incomplete');
  const g = data.geo;
  if (!isObj(g) || typeof g.latitude !== 'number' || typeof g.longitude !== 'number') errors.push('site: geo needs latitude and longitude numbers');
  if (!/^\d{8,15}$/.test(String(data.whatsapp ?? ''))) errors.push('site: whatsapp must be digits with country code');
  if (!text(data.priceRange)) errors.push('site: priceRange missing');
  if (!Array.isArray(data.hours) || data.hours.length === 0) errors.push('site: hours missing');
  else
    for (const h of data.hours as Obj[]) {
      if (!bothLocales(h.label)) errors.push('site: hours label needs es and en');
      if (!Array.isArray(h.days) || h.days.length === 0) errors.push('site: hours days missing');
      for (const k of ['opens', 'closes'] as const) if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(h[k]))) errors.push(`site: hours ${k} must be HH:MM`);
    }
  if (!isObj(data.social)) errors.push('site: social must be an object');
  return errors;
}

export function validateCredits(data: unknown): string[] {
  if (!Array.isArray(data)) return ['credits: must be an array'];
  return (data as Obj[]).flatMap((c, n) =>
    ['file', 'author', 'source', 'licence'].filter((k) => !text(c[k])).map((k) => `credits[${n}]: ${k} missing`),
  );
}
