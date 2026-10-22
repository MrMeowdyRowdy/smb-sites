import client from 'prom-client';

// Registered once per process (globalThis survives route-module reloads and duplicates).
const g = globalThis as unknown as { __clinicMetrics?: { registry: client.Registry; created: client.Counter; conflicts: client.Counter } };

if (!g.__clinicMetrics) {
  const registry = new client.Registry();
  client.collectDefaultMetrics({ register: registry });
  g.__clinicMetrics = {
    registry,
    created: new client.Counter({ name: 'clinic_bookings_created_total', help: 'Appointments booked', registers: [registry] }),
    conflicts: new client.Counter({ name: 'clinic_booking_conflicts_total', help: 'Booking attempts refused because the slot was taken', registers: [registry] }),
  };
}

export const metrics = g.__clinicMetrics;
