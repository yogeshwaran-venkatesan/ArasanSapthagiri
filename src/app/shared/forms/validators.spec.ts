import { FormControl, FormGroup } from '@angular/forms';
import { phoneValidator, stayValidator } from './validators';

describe('phoneValidator', () => {
  const check = (value: string) => phoneValidator(new FormControl(value));

  it('accepts Indian and international formats', () => {
    for (const ok of ['9876543210', '98765 43210', '+91 98765 43210', '+91-452-439-0902', '04524390902']) {
      expect(check(ok)).withContext(ok).toBeNull();
    }
  });

  it('rejects too short, too long or non-numeric input', () => {
    for (const bad of ['12345', '+91 98765 43210 999', 'call me', '98765abc10']) {
      expect(check(bad)).withContext(bad).toEqual({ phone: true });
    }
  });

  it('ignores an empty value (handled by Validators.required)', () => {
    expect(check('')).toBeNull();
  });
});

describe('stayValidator', () => {
  const group = (checkIn: string, checkOut: string) =>
    new FormGroup(
      { checkIn: new FormControl(checkIn), checkOut: new FormControl(checkOut) },
      { validators: stayValidator(() => '2026-11-11') },
    );

  it('is valid for a stay of at least one night', () => {
    expect(group('2026-11-11', '2026-11-13').errors).toBeNull();
  });

  it('flags past check-in and reversed dates', () => {
    expect(group('2026-11-01', '2026-11-13').errors).toEqual({ checkInPast: true });
    expect(group('2026-11-13', '2026-11-12').errors).toEqual({ checkOutBeforeCheckIn: true });
  });
});
