import { type Locale, formatUsd, t } from '@smb/i18n';

export type OrderLine = { qty: number; name: string; price: number };

/** wa.me link. Non-digits are stripped from the phone; the text is URL-encoded (accents, ñ, line breaks). */
export const waLink = (phone: string, text: string): string =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export type OrderMode = 'takeaway' | 'here';

export function orderMessage(lines: OrderLine[], locale: Locale, mode?: OrderMode): string {
  const m = t(locale).messages;
  const cents = lines.reduce((sum, l) => sum + l.qty * Math.round(l.price * 100), 0);
  return [
    m.orderIntro,
    ...lines.map((l) => `- ${l.qty} x ${l.name} (${formatUsd(l.price, locale)})`),
    `${m.total}: ${formatUsd(cents / 100, locale)}`,
    ...(mode ? [m[mode === 'here' ? 'here' : 'takeaway']] : []),
  ].join('\n');
}

export function contactMessage(fields: { name: string; message: string }, locale: Locale): string {
  const m = t(locale).messages;
  return [m.contactIntro, `${m.name}: ${fields.name.trim()}`, `${m.message}: ${fields.message.trim()}`].join('\n');
}
