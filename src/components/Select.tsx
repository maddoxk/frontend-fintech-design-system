import { forwardRef, useId, useState, type ChangeEvent, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  /** Visible label text. Always rendered for accessibility. */
  label: ReactNode;
  /** Helper text shown below the select when there is no error. */
  hint?: ReactNode;
  /** Error message. When set, the select is marked invalid and described by it. */
  error?: ReactNode;
  /** Marks the field visually and via aria-required. */
  required?: boolean;
  id?: string;
  /** Shorthand for `<option>` elements. Children are rendered after these. */
  options?: SelectOption[];
  /** Leading empty, disabled option shown until a real choice is made, then hidden. */
  placeholder?: string;
}

/**
 * Labeled native select. Mirrors Field's label/hint/error/ARIA wiring and uses
 * the native popup for best keyboard, mobile and screen-reader behaviour.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, required, id, className, options, children, disabled, placeholder, value, defaultValue, onChange, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;
  const controlled = value !== undefined;
  const [inner, setInner] = useState<typeof defaultValue>(defaultValue);
  const current = controlled ? value : inner;
  const hasChoice = Array.isArray(current) ? current.length > 0 : current !== undefined && current !== null && String(current) !== '';
  const valueProps = controlled
    ? { value }
    : { defaultValue: defaultValue ?? (placeholder !== undefined ? '' : undefined) };
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };
  const describedBy = cx(error ? errorId : undefined, hint ? hintId : undefined) || undefined;

  return (
    <div className="fds-field">
      <label className="fds-field__label" htmlFor={selectId}>
        {label}
        {required && (
          <span className="fds-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <span className={cx('fds-select-wrap', disabled && 'fds-select-wrap--disabled')}>
        <select
          ref={ref}
          id={selectId}
          className={cx('fds-input', 'fds-select', error && 'fds-input--invalid', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          required={required}
          disabled={disabled}
          {...rest}
          {...valueProps}
          onChange={handleChange}
        >
          {placeholder !== undefined && (
            <option value="" disabled hidden={hasChoice}>
              {placeholder}
            </option>
          )}
          {options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
          {children}
        </select>
      </span>
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
