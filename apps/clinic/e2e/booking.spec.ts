import { expect, test } from '@playwright/test';
import { book, randomPhone, weekdayAhead } from './helpers';

test('books a free slot and shows the confirmation', async ({ page }) => {
  const date = weekdayAhead(2);
  await page.goto('/');
  await page.getByLabel('Servicio').selectOption('filling');
  await page.getByLabel('Fecha').fill(date);
  await page.getByText('10:00', { exact: true }).click();
  await page.getByLabel('Nombre completo').fill('Ana Pérez');
  await page.getByLabel('Teléfono').fill('+593 99 111 2222');
  await page.getByRole('button', { name: 'Reservar cita' }).click();

  await expect(page).toHaveURL(/\/cita\/[0-9a-f-]{36}$/);
  await expect(page.getByRole('heading', { name: 'Cita confirmada' })).toBeVisible();
  await expect(page.getByText('Ana Pérez')).toBeVisible();
  await expect(page.getByText(date)).toBeVisible();
  await expect(page.getByText('10:00')).toBeVisible();
});

test('validation errors are shown and nothing is booked', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reservar cita' }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();
  await expect(page).toHaveURL('/');
});

test('a taken slot is disabled and the API refuses a second booking (409)', async ({ page, request }) => {
  const date = weekdayAhead(3);
  expect((await book(request, date, '11:00', 'Primero')).status()).toBe(201);
  const second = await book(request, date, '11:00', 'Segundo');
  expect(second.status()).toBe(409);
  expect(await second.json()).toEqual({ errors: { time: 'unavailable' } });

  await page.goto('/');
  await page.getByLabel('Fecha').fill(date);
  await expect(page.getByLabel(/^11:00/)).toBeDisabled();
});

test('losing the race for a slot shows an error and frees nothing', async ({ page, request }) => {
  const date = weekdayAhead(4);
  await page.goto('/');
  await page.getByLabel('Fecha').fill(date);
  await page.getByText('15:30', { exact: true }).click();
  await page.getByLabel('Nombre completo').fill('Segundo Paciente');
  await page.getByLabel('Teléfono').fill('0991234567');
  expect((await book(request, date, '15:30', 'Ganador')).status()).toBe(201); // someone else books first
  await page.getByRole('button', { name: 'Reservar cita' }).click();
  await expect(page.getByText('Esa hora ya no está disponible')).toBeVisible();
  await expect(page.getByLabel(/^15:30/)).toBeDisabled();
});

test('English pair works', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Book your appointment' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL('/');
});

test('rejects bad input at the API', async ({ request }) => {
  const r = await request.post('/api/appointments', { data: { service: 'nope', date: '2020-01-01', time: '09:00', name: 'x', phone: 'abc' } });
  expect(r.status()).toBe(400);
});

test('one phone gets at most 3 upcoming appointments (429 on the 4th)', async ({ request }) => {
  const date = weekdayAhead(6);
  const phone = randomPhone();
  for (const t of ['09:00', '09:30', '10:00']) expect((await book(request, date, t, 'Tope', phone)).status()).toBe(201);
  const fourth = await book(request, date, '10:30', 'Tope', phone.replace('+593 ', '0').replace(/ /g, '')); // same number, local format
  expect(fourth.status()).toBe(429);
  expect(await fourth.json()).toEqual({ errors: { phone: 'limit' } });
});
