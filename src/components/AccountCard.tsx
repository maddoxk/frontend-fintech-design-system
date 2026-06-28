import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { MoneyAmount } from './MoneyAmount';
import { StatusBadge, type BadgeTone } from './StatusBadge';

export interface AccountCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Display name, e.g. "Everyday Checking". */
  name: string;
  /** Current balance in major units. */
  balance: number;
  currency?: string;
  locale?: string;
  /** Masked or partial account number, e.g. "•••• 4821". */
  accountNumber?: string;
  /** Optional status pill, e.g. "Active". */
  status?: { label: ReactNode; tone?: BadgeTone };
  /** Optional trailing element (e.g. a Sparkline). */
  trailing?: ReactNode;
}

/** Summary card for a single financial account. */
export function AccountCard({
  name,
  balance,
  currency = 'USD',
  locale,
  accountNumber,
  status,
  trailing,
  className,
  ...rest
}: AccountCardProps) {
  return (
    <div
      className={cx('fds-card', 'fds-account-card', className)}
      role="group"
      aria-label={`${name} account`}
      {...rest}
    >
      <div className="fds-account-card__top">
        <span className="fds-account-card__name">{name}</span>
        {status && <StatusBadge tone={status.tone}>{status.label}</StatusBadge>}
      </div>
      <MoneyAmount
        className="fds-account-card__balance"
        value={balance}
        currency={currency}
        locale={locale}
      />
      <div className="fds-account-card__meta">
        <span>{accountNumber}</span>
        {trailing}
      </div>
    </div>
  );
}
