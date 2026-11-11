import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { stayError } from '../booking/dates';

/** Accepts Indian and international numbers: 10–13 digits, optional +, spaces or dashes. */
export const phoneValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const value = String(c.value ?? '').trim();
  if (!value) return null;
  if (!/^\+?[\d\s-]+$/.test(value)) return { phone: true };
  const digits = value.replace(/\D/g, '').length;
  return digits >= 10 && digits <= 13 ? null : { phone: true };
};

/** Group validator for check-in / check-out controls (see stayError). */
export const stayValidator =
  (today: () => string): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null => {
    const error = stayError(group.get('checkIn')?.value, group.get('checkOut')?.value, today());
    return error ? { [error]: true } : null;
  };
