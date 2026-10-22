import type { Locale } from '@smb/i18n';

const es = {
  title: 'Reserva tu cita',
  tagline: 'Elige un servicio, un día y una hora libre. Sin llamadas.',
  demo: 'Clínica ficticia de demostración. No es un negocio real.',
  hours: 'Horario: lunes a viernes 09:00 a 17:00, sábados 09:00 a 13:00.',
  service: 'Servicio',
  date: 'Fecha',
  slots: 'Hora disponible',
  pickDate: 'Elige una fecha para ver las horas.',
  noSlots: 'No hay horas ese día. Prueba otra fecha.',
  taken: 'ocupada',
  name: 'Nombre completo',
  phone: 'Teléfono',
  submit: 'Reservar cita',
  sending: 'Reservando…',
  errors: {
    required: 'Este campo es obligatorio.',
    invalid: 'Revisa este campo.',
    unavailable: 'Esa hora ya no está disponible. Elige otra.',
    limit: 'Este teléfono ya tiene 3 citas próximas, el máximo.',
    server: 'No pudimos reservar. Inténtalo de nuevo.',
  },
  confirmedTitle: 'Cita confirmada',
  confirmedIntro: 'Te esperamos. Guarda estos datos.',
  cancelled: 'Esta cita fue cancelada.',
  labels: { service: 'Servicio', day: 'Día', time: 'Hora', name: 'Nombre', phone: 'Teléfono', code: 'Código' },
  another: 'Reservar otra cita',
  skip: 'Saltar al contenido',
};

const en: typeof es = {
  title: 'Book your appointment',
  tagline: 'Pick a service, a day and a free time. No phone calls.',
  demo: 'Fictional demo clinic. Not a real business.',
  hours: 'Hours: Monday to Friday 09:00 to 17:00, Saturday 09:00 to 13:00.',
  service: 'Service',
  date: 'Date',
  slots: 'Available time',
  pickDate: 'Pick a date to see the times.',
  noSlots: 'No times that day. Try another date.',
  taken: 'taken',
  name: 'Full name',
  phone: 'Phone',
  submit: 'Book appointment',
  sending: 'Booking…',
  errors: {
    required: 'This field is required.',
    invalid: 'Check this field.',
    unavailable: 'That time is no longer available. Pick another.',
    limit: 'This phone already has 3 upcoming appointments, the maximum.',
    server: 'We could not book. Please try again.',
  },
  confirmedTitle: 'Appointment confirmed',
  confirmedIntro: 'See you then. Keep these details.',
  cancelled: 'This appointment was cancelled.',
  labels: { service: 'Service', day: 'Day', time: 'Time', name: 'Name', phone: 'Phone', code: 'Code' },
  another: 'Book another appointment',
  skip: 'Skip to content',
};

export const copy = (l: Locale) => (l === 'es' ? es : en);
export type Copy = typeof es;
export const bookingPath = (l: Locale) => (l === 'es' ? '/' : '/en');
export const confirmationPath = (l: Locale, id: string) => (l === 'es' ? `/cita/${id}` : `/en/appointment/${id}`);
