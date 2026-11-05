import { type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { MoneyAmount } from './MoneyAmount';
import { StatusBadge, type BadgeTone } from './StatusBadge';
import { formatDate } from '../utils/format';

export interface Transaction {
  id: string;
  merchant: string;
  /** Amount in major units. Negative = debit, positive = credit. */
  amount: number;
  /** ISO date string or Date. */
  date: string | Date;
  category?: string;
  /** Emoji or short glyph for the icon bubble. */
  icon?: string;
  /** Status text shown in a StatusBadge (the label always carries the meaning). */
  status?: string;
  /** Badge tone for `status`. Defaults to neutral. */
  statusTone?: BadgeTone;
}

export interface TransactionListProps extends HTMLAttributes<HTMLUListElement> {
  transactions: Transaction[];
  currency?: string;
  locale?: string;
}

/** Accessible list of transactions with localized dates and colorized amounts. */
export function TransactionList({
  transactions,
  currency = 'USD',
  locale,
  className,
  ...rest
}: TransactionListProps) {
  return (
    <ul className={cx('fds-txn-list', className)} aria-label="Transactions" {...rest}>
      {transactions.map((t) => (
        <li key={t.id} className="fds-txn">
          <span className="fds-txn__icon" aria-hidden="true">
            {t.icon ?? (t.amount >= 0 ? '↓' : '↑')}
          </span>
          <div className="fds-txn__body">
            <div className="fds-txn__merchant">{t.merchant}</div>
            <div className="fds-txn__sub">
              {formatDate(t.date, locale)}
              {t.category ? ` · ${t.category}` : ''}
            </div>
          </div>
          {t.status && (
            <StatusBadge className="fds-txn__status" tone={t.statusTone ?? 'neutral'}>
              {t.status}
            </StatusBadge>
          )}
          <MoneyAmount
            className="fds-txn__amount"
            value={t.amount}
            currency={currency}
            locale={locale}
            colorize
            showSign
          />
        </li>
      ))}
    </ul>
  );
}
