import type { Locale } from '@smb/i18n';
import { BookingForm } from '@/components/BookingForm';
import { Shell } from '@/components/Shell';
import { copy } from '@/copy';
import { content } from '@/lib/content';
import { addDays, clinicNow } from '@/lib/slots';

export function BookingView({ locale }: { locale: Locale }) {
  const c = copy(locale);
  const today = clinicNow(content.timezone).date;
  return (
    <Shell locale={locale}>
      <h1>{c.title}</h1>
      <p>{c.tagline}</p>
      <p className="muted">{c.hours}</p>
      <BookingForm locale={locale} c={c} services={content.services.map((s) => ({ id: s.id, label: `${s[locale]} ($${s.price})` }))} min={today} max={addDays(today, content.horizonDays)} />
    </Shell>
  );
}
