import { createElement, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { clampHeadingLevel, positiveInt, type HeadingLevel } from './Widget';

export interface PageProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Page title (32/700). */
  title: ReactNode;
  /** Heading level for the title. Default 1. */
  headingLevel?: HeadingLevel;
  /** Element to render. Use "main" for the primary landmark. Default "div". */
  as?: 'div' | 'main';
  /** Actions slot next to the title. */
  actions?: ReactNode;
  /** Grid columns on large screens (collapses to one column on small screens). Default 1. */
  columns?: number;
}

/** Page surface with a title and a responsive grid that collapses to a single column. */
export function Page({
  title,
  headingLevel = 1,
  as = 'div',
  actions,
  columns = 1,
  className,
  children,
  style,
  ...rest
}: PageProps) {
  const titleId = useId();
  const level = clampHeadingLevel(headingLevel, 1);
  const cols = positiveInt(columns, 1) as number;
  return createElement(
    as,
    {
      className: cx('fds-page', className),
      ...(as === 'main' ? { 'aria-labelledby': titleId } : { role: 'region', 'aria-labelledby': titleId }),
      style: { ...style, '--fds-grid-columns': cols } as CSSProperties,
      ...rest,
    },
    <div className="fds-page__header" key="h">
      {createElement(`h${level}`, { id: titleId, className: 'fds-page__title' }, title)}
      {actions != null && <div className="fds-page__actions">{actions}</div>}
    </div>,
    <div className="fds-page__grid" key="g">
      {children}
    </div>,
  );
}
