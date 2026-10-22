import { expect, test } from '@playwright/test';
import { ADMIN_PASSWORD, book, weekdayAhead } from './helpers';

test('admin sees upcoming appointments and cancels one, which frees the slot', async ({ page, request }) => {
  const date = weekdayAhead(5);
  const name = 'Paciente Admin';
  expect((await book(request, date, '14:00', name)).status()).toBe(201);

  await page.goto('/admin');
  await page.getByLabel('Contraseña').fill('wrong');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Contraseña incorrecta')).toBeVisible();

  await page.getByLabel('Contraseña').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: 'Citas próximas' })).toBeVisible();
  const row = page.getByRole('row').filter({ hasText: name });
  await expect(row).toContainText('14:00');

  await row.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByRole('row').filter({ hasText: name })).toHaveCount(0);

  const slots = await (await request.get(`/api/slots?date=${date}`)).json();
  expect(slots.slots.find((s: { time: string }) => s.time === '14:00').free).toBe(true);
  expect((await book(request, date, '14:00', 'Reemplazo')).status()).toBe(201);
});

test('admin routes refuse requests without a session', async ({ request }) => {
  const r = await request.post('/api/admin/appointments/00000000-0000-0000-0000-000000000000/cancel', { maxRedirects: 0 });
  expect(r.status()).toBe(401);
});

test('the admin cookie is httpOnly', async ({ page, context }) => {
  await page.goto('/admin');
  await page.getByLabel('Contraseña').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: 'Citas próximas' })).toBeVisible();
  const c = (await context.cookies()).find((x) => x.name === 'clinic_admin');
  expect(c?.httpOnly).toBe(true);
});
