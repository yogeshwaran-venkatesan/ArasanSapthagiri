/** Date helpers for the booking forms (local dates as YYYY-MM-DD strings). */

export const toIsoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return toIsoDate(new Date(y, m - 1, d + days));
};

/** Whole nights between two ISO dates (0 if invalid or not after). */
export const nightsBetween = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  const a = Date.UTC(...(checkIn.split('-').map(Number) as [number, number, number]));
  const b = Date.UTC(...(checkOut.split('-').map(Number) as [number, number, number]));
  const n = Math.round((b - a) / 86_400_000);
  return n > 0 ? n : 0;
};

/** True for a real calendar date written as YYYY-MM-DD. */
export const isIsoDate = (value: string | null | undefined): value is string => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

export type StayError = 'checkInPast' | 'checkOutBeforeCheckIn' | null;

/** Validates a stay: check-in today or later, check-out at least one night after. */
export const stayError = (checkIn: string, checkOut: string, today: string): StayError => {
  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) return null; // "required" handles empties
  if (checkIn < today) return 'checkInPast';
  if (nightsBetween(checkIn, checkOut) === 0) return 'checkOutBeforeCheckIn';
  return null;
};
