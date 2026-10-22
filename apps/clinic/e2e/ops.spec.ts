import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { weekdayAhead } from './helpers';

for (const path of ['/', '/en']) {
  test(`axe finds no violations on the booking page ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.locator('#date').fill(weekdayAhead(2)); // show the slot list too
    await expect(page.locator('.slots')).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test('health, ready and metrics endpoints', async ({ request }) => {
  expect((await request.get('/api/health')).status()).toBe(200);
  expect((await request.get('/api/ready')).status()).toBe(200);
  const r = await request.get('/api/metrics');
  // Behind the clinic-infra ingress the public /api/metrics answers 403 (Prometheus scrapes the Service instead).
  if (process.env.E2E_METRICS_BLOCKED === '1') return expect(r.status()).toBe(403);
  const m = await r.text();
  expect(m).toContain('clinic_bookings_created_total');
  expect(m).toContain('clinic_booking_conflicts_total');
  expect(m).toContain('process_cpu_user_seconds_total');
});
