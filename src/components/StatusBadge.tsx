import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type BadgeTone = 'neutral' | 'positive' | 'negative' | 'warning' | 'info';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Show a leading status dot. */
  dot?: boolean;
  children: ReactNode;
}

/** Small pill for transaction/account status. Tone maps to semantic colors. */
export function StatusBadge({
  tone = 'neutral',
  dot = true,
  className,
  children,
  ...rest
}: StatusBadgeProps) {
  return (
    <span className={cx('fds-badge', `fds-badge--${tone}`, className)} {...rest}>
      {dot && <span className="fds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
