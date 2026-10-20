import { type Locale, t } from '@smb/i18n';
import { waLink } from './whatsapp';

type Props = { phone: string; text: string; locale: Locale; label?: string; className?: string };

export function WhatsAppButton({ phone, text, locale, label, className }: Props) {
  const d = t(locale).whatsapp;
  return (
    <a href={waLink(phone, text)} target="_blank" rel="noopener noreferrer" className={className}>
      {label ?? d.cta}
      <span className="visually-hidden"> ({d.opensIn})</span>
    </a>
  );
}
