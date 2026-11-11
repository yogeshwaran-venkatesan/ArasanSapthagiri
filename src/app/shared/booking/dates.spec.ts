import { addDays, isIsoDate, nightsBetween, stayError, toIsoDate } from './dates';

describe('booking dates', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('adds days across month and year ends', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('counts nights and rejects check-out on/before check-in', () => {
    expect(nightsBetween('2026-11-11', '2026-11-14')).toBe(3);
    expect(nightsBetween('2026-11-11', '2026-11-11')).toBe(0);
    expect(nightsBetween('2026-11-12', '2026-11-11')).toBe(0);
  });
});

describe('isIsoDate', () => {
  it('accepts real calendar dates only', () => {
    expect(isIsoDate('2026-02-28')).toBeTrue();
    expect(isIsoDate('2028-02-29')).toBeTrue(); // leap year
    expect(isIsoDate('2026-02-29')).toBeFalse();
    expect(isIsoDate('2026-13-01')).toBeFalse();
    expect(isIsoDate('26-1-1')).toBeFalse();
    expect(isIsoDate('')).toBeFalse();
    expect(isIsoDate(null)).toBeFalse();
  });
});

describe('stayError', () => {
  const today = '2026-11-11';

  it('passes a valid future stay', () => {
    expect(stayError('2026-11-11', '2026-11-12', today)).toBeNull();
  });

  it('rejects a check-in in the past', () => {
    expect(stayError('2026-11-10', '2026-11-12', today)).toBe('checkInPast');
  });

  it('rejects check-out on or before check-in', () => {
    expect(stayError('2026-11-12', '2026-11-12', today)).toBe('checkOutBeforeCheckIn');
    expect(stayError('2026-11-12', '2026-11-11', today)).toBe('checkOutBeforeCheckIn');
  });

  it('leaves empty dates to the "required" validator', () => {
    expect(stayError('', '', today)).toBeNull();
  });
});
