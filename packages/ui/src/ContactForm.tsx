'use client';

import { useState } from 'react';
import { type Locale, t } from '@smb/i18n';
import { contactMessage, waLink } from './whatsapp';

export function ContactForm({ phone, locale, className }: { phone: string; locale: Locale; className?: string }) {
  const d = t(locale).contactForm;
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const next = { name: name ? undefined : d.nameRequired, message: message ? undefined : d.messageRequired };
    setErrors(next);
    if (next.name || next.message) return;
    window.open(waLink(phone, contactMessage({ name, message }, locale)), '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <p>
        <label htmlFor="cf-name">{d.name}</label>
        <input
          id="cf-name"
          name="name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
        />
        {errors.name && (
          <span id="cf-name-err" role="alert">
            {errors.name}
          </span>
        )}
      </p>
      <p>
        <label htmlFor="cf-message">{d.message}</label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
        />
        {errors.message && (
          <span id="cf-message-err" role="alert">
            {errors.message}
          </span>
        )}
      </p>
      <button type="submit">{d.send}</button>
      <p>{d.hint}</p>
    </form>
  );
}
