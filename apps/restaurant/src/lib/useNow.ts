import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000); // the snapshot only changes on a new minute
  return () => clearInterval(id);
};
const minute = () => Math.floor(Date.now() / 60_000) * 60_000;

/** null while rendering the static HTML (and during hydration), then the current minute, refreshed live. */
export function useNow(): Date | null {
  const t = useSyncExternalStore(subscribe, minute, () => null);
  return t === null ? null : new Date(t);
}
