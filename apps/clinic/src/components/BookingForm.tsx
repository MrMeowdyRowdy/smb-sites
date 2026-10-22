'use client';

import { useState } from 'react';
import type { Locale } from '@smb/i18n';
import { confirmationPath, type Copy } from '@/copy';

type Svc = { id: string; label: string };
type Slot = { time: string; free: boolean };
type Errors = Record<string, string>;

export function BookingForm({ locale, c, services, min, max }: { locale: Locale; c: Copy; services: Svc[]; min: string; max: string }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  async function loadSlots(d: string) {
    setTime('');
    setSlots(null);
    if (!d) return;
    const r = await fetch(`/api/slots?date=${encodeURIComponent(d)}`);
    setSlots(r.ok ? (await r.json()).slots : []);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const f = new FormData(e.currentTarget);
    const body = { service: f.get('service'), date, time, name: f.get('name'), phone: f.get('phone') };
    try {
      const r = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (r.status === 201) {
        window.location.assign(confirmationPath(locale, (await r.json()).id));
        return;
      }
      const data = await r.json().catch(() => ({}));
      setErrors(Object.fromEntries(Object.entries((data.errors ?? { form: 'server' }) as Errors).map(([k, v]) => [k, c.errors[v as keyof Copy['errors']] ?? c.errors.server])));
      if (r.status === 409) loadSlots(date);
    } catch {
      setErrors({ form: c.errors.server });
    }
    setBusy(false);
  }

  const err = (k: string) => (errors[k] ? <p className="error" id={`${k}-err`} role="alert">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="card">
      <div>
        <label htmlFor="service">{c.service}</label>
        <select id="service" name="service" defaultValue={services[0].id}>
          {services.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {err('service')}
      </div>
      <div>
        <label htmlFor="date">{c.date}</label>
        <input id="date" type="date" min={min} max={max} value={date} onChange={(e) => { setDate(e.target.value); loadSlots(e.target.value); }} aria-describedby="date-err" />
        {err('date')}
      </div>
      <fieldset>
        <legend>{c.slots}</legend>
        {slots === null ? <p className="muted">{date ? '…' : c.pickDate}</p> : slots.length === 0 ? <p className="muted">{c.noSlots}</p> : (
          <div className="slots">
            {slots.map((s) => (
              <label key={s.time}>
                <input type="radio" name="time" value={s.time} checked={time === s.time} disabled={!s.free} onChange={() => setTime(s.time)} />
                <span>{s.time}{s.free ? '' : ` (${c.taken})`}</span>
              </label>
            ))}
          </div>
        )}
        {err('time')}
      </fieldset>
      <div>
        <label htmlFor="name">{c.name}</label>
        <input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="name-err" />
        {err('name')}
      </div>
      <div>
        <label htmlFor="phone">{c.phone}</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby="phone-err" />
        {err('phone')}
      </div>
      {err('form')}
      <button type="submit" disabled={busy}>{busy ? c.sending : c.submit}</button>
    </form>
  );
}
