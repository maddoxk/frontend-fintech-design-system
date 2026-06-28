import { type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { formatMoney } from '../utils/format';

export interface MoneyAmountProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The numeric amount (in major units, e.g. dollars). */
  value: number;
  /** ISO 4217 currency code. Defaults to USD. */
  currency?: string;
  /** BCP 47 locale. Defaults to the runtime locale. */
  locale?: string;
  /** Color positive green and negative red. */
  colorize?: boolean;
  /** Always render an explicit sign. */
  showSign?: boolean;
}

/**
 * Currency-aware amount, formatted with Intl.NumberFormat. Optionally colorized
 * for gains/losses. Renders an accessible label via aria-label.
 */
export function MoneyAmount({
  value,
  currency = 'USD',
  locale,
  colorize = false,
  showSign = false,
  className,
  ...rest
}: MoneyAmountProps) {
  const formatted = formatMoney(value, {
    currency,
    locale,
    signDisplay: showSign ? 'exceptZero' : 'auto',
  });
  const tone = value > 0 ? 'positive' : value < 0 ? 'negative' : undefined;
  return (
    <span
      className={cx('fds-money', colorize && tone && `fds-money--${tone}`, className)}
      aria-label={formatted}
      {...rest}
    >
      {formatted}
    </span>
  );
}
