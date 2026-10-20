import { expect, test } from '@playwright/test';

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const p of ['/menu/', '/en/menu/qr/', '/calidad/', '/en/quality/']) expect(xml).toContain(p);
});

test('the home page ships JSON-LD for a CafeOrCoffeeShop and no third-party script', async ({ page }) => {
  await page.goto('/');
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld['@type']).toBe('CafeOrCoffeeShop');
  expect(ld.openingHoursSpecification.length).toBeGreaterThan(0);
  expect(ld.hasMenu.hasMenuSection.length).toBe(5);
  expect(await page.locator('script[src^="http"]').count()).toBe(0);
});
