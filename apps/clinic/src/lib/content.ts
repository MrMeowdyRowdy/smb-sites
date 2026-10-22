import clinic from '../../content/clinic.json';
import type { Hours } from './slots';

export type Service = { id: string; es: string; en: string; price: number };

export const content = clinic as typeof clinic & { hours: Hours; services: Service[] };
