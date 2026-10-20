import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import menu from '../content/menu.json';
import { routes } from './routes';

for (const r of routes) {
  test.describe(r.path, () => {
    test('smoke: loads, right language, footer disclaimer, hreflang', async ({ page }) => {
      const res = await page.goto(r.path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', r.lang);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(r.h1);
      await expect(page.getByRole('contentinfo')).toContainText(r.lang === 'es' ? 'negocio ficticio' : 'fictional business');
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    });

    test('axe: no WCAG 2.1 AA violations', async ({ page }, info) => {
      await page.goto(r.path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      fs.mkdirSync('reports/axe', { recursive: true });
      const slug = r.path.replace(/\//g, '_') || '_';
      fs.writeFileSync(
        `reports/axe/${slug}.json`,
        JSON.stringify({ route: r.path, violations: results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })) }, null, 2),
      );
      expect(results.violations, info.title).toEqual([]);
    });
  });
}

test('language switch lands on the paired page', async ({ page }) => {
  for (const [from, to] of [['/', '/en/'], ['/menu/', '/en/menu/'], ['/menu/qr/', '/en/menu/qr/'], ['/calidad/', '/en/quality/'], ['/en/quality/', '/calidad/']]) {
    await page.goto(from);
    await page.getByRole('navigation', { name: /Idioma|Language/ }).getByRole('link').click();
    await expect(page).toHaveURL(to);
  }
});

test('cart builds the expected wa.me order link and survives a reload', async ({ page, context }) => {
  await page.goto('/menu/');
  await page.getByTestId('add-cafe-pasado').click();
  await page.getByTestId('add-cafe-pasado').click();
  await page.getByTestId('add-pan-de-yuca').click();

  const price = (id: string) => menu.items.find((i) => i.id === id)!.price;
  const total = (2 * price('cafe-pasado') + price('pan-de-yuca')).toFixed(2).replace('.', ',');
  await expect(page.getByTestId('total')).toHaveText(`$${total}`);

  const link = page.getByTestId('order-link');
  const href = (await link.getAttribute('href'))!;
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  const text = decodeURIComponent(href.split('?text=')[1]);
  expect(text).toContain('- 2 x Café pasado');
  expect(text).toContain('- 1 x Pan de yuca (4 unidades)');
  expect(text).toContain(`Total: $${total}`);

  // Clicking opens a new tab; WhatsApp itself is never contacted.
  await context.route('https://wa.me/**', (route) => route.fulfill({ body: 'stub', contentType: 'text/html' }));
  const [popup] = await Promise.all([context.waitForEvent('page'), link.click()]);
  expect(popup.url()).toBe(href);

  await page.reload();
  await expect(page.getByTestId('qty-cafe-pasado')).toHaveText('2');
});

test('contact form validates, then opens wa.me with the message', async ({ page, context }) => {
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Send on WhatsApp' }).click();
  await expect(page.getByText('Enter your name.')).toBeVisible();
  await expect(page.getByText('Enter your message.')).toBeVisible();

  await context.route('https://wa.me/**', (route) => route.fulfill({ body: 'stub', contentType: 'text/html' }));
  await page.getByRole('textbox', { name: 'Name' }).fill('Ñusta');
  await page.getByRole('textbox', { name: 'Message' }).fill('Table for 4\ntomorrow');
  const [popup] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', { name: 'Send on WhatsApp' }).click()]);
  const text = decodeURIComponent(popup.url().split('?text=')[1]);
  expect(text).toContain('Name: Ñusta');
  expect(text).toContain('Message: Table for 4\ntomorrow');
});
