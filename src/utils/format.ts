/** Formatting helpers built on the Intl API. */

export interface FormatMoneyOptions {
  /** ISO 4217 currency code, e.g. "USD", "EUR", "JPY". */
  currency?: string;
  /** BCP 47 locale, e.g. "en-US", "de-DE". Defaults to the runtime locale. */
  locale?: string;
  /** When true, always show the sign (+/-). Useful for deltas. */
  signDisplay?: 'auto' | 'always' | 'never' | 'exceptZero';
  /** Override fraction digits. Defaults to the currency's standard. */
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format a numeric amount as a localized currency string using Intl.NumberFormat.
 * Correctly handles zero-decimal currencies (JPY) and locale grouping.
 */
export function formatMoney(amount: number, options: FormatMoneyOptions = {}): string {
  const {
    currency = 'USD',
    locale,
    signDisplay = 'auto',
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    signDisplay,
    ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
    ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
  }).format(amount);
}

/** Return just the currency symbol for a given currency/locale. */
export function currencySymbol(currency = 'USD', locale?: string): string {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? currency;
}

/** Format a date as a short localized string. */
export function formatDate(
  date: Date | string | number,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/** Format a fractional number (0.0532) as a localized percent ("5.32%"). */
export function formatPercent(value: number, locale?: string, fractionDigits = 2): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
