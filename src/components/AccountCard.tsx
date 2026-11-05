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

/** Palantir-style widget summarising a single financial account. */
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
      <div className="fds-account-card__field">
        <span className="fds-account-card__label">Balance</span>
        <MoneyAmount
          className="fds-account-card__balance"
          value={balance}
          currency={currency}
          locale={locale}
        />
      </div>
      <div className="fds-account-card__meta">
        {accountNumber && (
          <div className="fds-account-card__field">
            <span className="fds-account-card__label">Account</span>
            <span className="fds-account-card__id">{accountNumber}</span>
          </div>
        )}
        {trailing}
      </div>
    </div>
  );
}
