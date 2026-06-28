import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Visible label text. Always rendered for accessibility. */
  label: ReactNode;
  /** Helper text shown below the input when there is no error. */
  hint?: ReactNode;
  /** Error message. When set, the input is marked invalid and described by it. */
  error?: ReactNode;
  /** Marks the field visually and via aria-required. */
  required?: boolean;
  id?: string;
}

/**
 * Labeled text input (Field). Wires up `htmlFor`, `aria-describedby`,
 * `aria-invalid`, and `aria-required` so it is accessible by construction.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, required, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = cx(error ? errorId : undefined, hint ? hintId : undefined) || undefined;

  return (
    <div className="fds-field">
      <label className="fds-field__label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="fds-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cx('fds-input', error && 'fds-input--invalid', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        {...rest}
      />
      {error ? (
        <span className="fds-field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : (
        hint && (
          <span className="fds-field__hint" id={hintId}>
            {hint}
          </span>
        )
      )}
    </div>
  );
});
