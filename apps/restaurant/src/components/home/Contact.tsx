import type { Locale } from '@smb/i18n';
import { ContactForm } from '@smb/ui';
import { ui } from '../../copy';
import { site } from '../../lib/content';

export function Contact({ locale }: { locale: Locale }) {
  const u = ui[locale].contact;
  return (
    <section aria-labelledby="contact-title">
      <h2 id="contact-title">{u.title}</h2>
      <p>{u.lead}</p>
      <ContactForm phone={site.whatsapp} locale={locale} />
    </section>
  );
}
