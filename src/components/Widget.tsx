import { createElement, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface WidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Widget title (rendered as a heading). */
  title?: ReactNode;
  /** Heading level for the title. Default 3 (Page h1 > Section h2 > Widget h3). */
  headingLevel?: HeadingLevel;
  /** Actions slot, aligned to the end of the header (e.g. buttons). */
  actions?: ReactNode;
  /** Number of grid columns to span inside a Page/Section grid. */
  span?: number;
}

/** Bordered panel on the widget surface: 4px radius, 16px padding, title + actions. */
export function Widget({
  title,
  headingLevel = 3,
  actions,
  span,
  className,
  children,
  style,
  ...rest
}: WidgetProps) {
  const titleId = useId();
  const hasHeader = title != null || actions != null;
  const merged: CSSProperties | undefined =
    span && span > 1 ? { ...style, gridColumn: `span ${span}` } : style;
  return (
    <div
      className={cx('fds-widget', className)}
      role={title != null ? 'group' : undefined}
      aria-labelledby={title != null ? titleId : undefined}
      style={merged}
      {...rest}
    >
      {hasHeader && (
        <div className="fds-widget__header">
          {title != null &&
            createElement(`h${headingLevel}`, { id: titleId, className: 'fds-widget__title' }, title)}
          {actions != null && <div className="fds-widget__actions">{actions}</div>}
        </div>
      )}
      <div className="fds-widget__body">{children}</div>
    </div>
  );
}
