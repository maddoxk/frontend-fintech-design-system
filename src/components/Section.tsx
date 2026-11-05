import { createElement, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import type { HeadingLevel } from './Widget';

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Section title; becomes the accessible name of the region. */
  title: ReactNode;
  /** Heading level for the title. Default 2. */
  headingLevel?: HeadingLevel;
  /** Actions slot, aligned to the end of the header. */
  actions?: ReactNode;
  /** Grid columns for the body (collapses to one column on small screens). Default 1. */
  columns?: number;
  /** Number of grid columns to span inside a Page grid. */
  span?: number;
}

/** Section surface (6px radius, 20px padding) with header and a responsive body grid. */
export function Section({
  title,
  headingLevel = 2,
  actions,
  columns = 1,
  span,
  className,
  children,
  style,
  ...rest
}: SectionProps) {
  const titleId = useId();
  const merged = {
    ...style,
    '--fds-grid-columns': columns,
    ...(span && span > 1 ? { gridColumn: `span ${span}` } : null),
  } as CSSProperties;
  return (
    <section className={cx('fds-section', className)} aria-labelledby={titleId} style={merged} {...rest}>
      <div className="fds-section__header">
        {createElement(`h${headingLevel}`, { id: titleId, className: 'fds-section__title' }, title)}
        {actions != null && <div className="fds-section__actions">{actions}</div>}
      </div>
      <div className="fds-section__body">{children}</div>
    </section>
  );
}
