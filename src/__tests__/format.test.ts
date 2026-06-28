import { describe, it, expect } from 'vitest';
import { formatMoney, formatPercent, formatDate, currencySymbol } from '../utils/format';

describe('formatMoney', () => {
  it('formats USD with two decimals', () => {
    expect(formatMoney(1234.5, { currency: 'USD', locale: 'en-US' })).toBe('$1,234.50');
  });

  it('handles zero-decimal currencies (JPY)', () => {
    // JPY has no minor units.
    expect(formatMoney(1500, { currency: 'JPY', locale: 'en-US' })).toBe('¥1,500');
  });

  it('formats EUR in a German locale', () => {
    const out = formatMoney(1234.5, { currency: 'EUR', locale: 'de-DE' });
    expect(out).toContain('1.234,50');
    expect(out).toContain('€');
  });

  it('shows an explicit sign with exceptZero', () => {
    expect(formatMoney(10, { currency: 'USD', locale: 'en-US', signDisplay: 'exceptZero' })).toBe(
      '+$10.00',
    );
    expect(formatMoney(0, { currency: 'USD', locale: 'en-US', signDisplay: 'exceptZero' })).toBe(
      '$0.00',
    );
  });

  it('renders negatives', () => {
    expect(formatMoney(-42, { currency: 'USD', locale: 'en-US' })).toBe('-$42.00');
  });
});

describe('formatPercent', () => {
  it('formats a fraction as a percent', () => {
    expect(formatPercent(0.0532, 'en-US', 2)).toBe('5.32%');
  });
});

describe('currencySymbol', () => {
  it('returns the symbol for USD', () => {
    expect(currencySymbol('USD', 'en-US')).toBe('$');
  });
});

describe('formatDate', () => {
  it('formats an ISO date', () => {
    const out = formatDate('2026-01-15T00:00:00Z', 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    expect(out).toBe('Jan 15, 2026');
  });
});
