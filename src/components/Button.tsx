import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to fill the container width. */
  block?: boolean;
  /** Show a spinner and set aria-busy; the button is also disabled. */
  loading?: boolean;
  /** Optional leading icon. */
  leadingIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * Accessible button. Renders a native <button> so keyboard and focus behavior
 * are correct by default. While `loading`, it is disabled and announces busy.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    block = false,
    loading = false,
    leadingIcon,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'fds-btn',
        `fds-btn--${variant}`,
        `fds-btn--${size}`,
        block && 'fds-btn--block',
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="fds-spinner" aria-hidden="true" />
      ) : (
        leadingIcon && <span aria-hidden="true">{leadingIcon}</span>
      )}
      {children}
    </button>
  );
});
