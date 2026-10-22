CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  day date NOT NULL,
  slot time NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One booked appointment per slot. Cancelled rows are kept and free the slot.
CREATE UNIQUE INDEX appointments_one_booked_per_slot ON appointments (day, slot) WHERE status = 'booked';
