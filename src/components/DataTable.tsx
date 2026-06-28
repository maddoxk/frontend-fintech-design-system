import { useMemo, useRef, useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface Column<T> {
  key: keyof T & string;
  header: ReactNode;
  /** Right-align and use tabular figures. */
  numeric?: boolean;
  /** Allow sorting on this column. Defaults to true. */
  sortable?: boolean;
  /** Custom cell renderer. */
  render?: (row: T) => ReactNode;
  /** Custom sort accessor. Defaults to row[key]. */
  sortValue?: (row: T) => number | string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Stable row id accessor. */
  rowKey: (row: T) => string;
  caption?: ReactNode;
  /** Enable windowed rendering for large datasets. */
  virtualized?: boolean;
  /** Visible viewport height in px when virtualized. Default 360. */
  height?: number;
  /** Row height in px when virtualized. Default 44. */
  rowHeight?: number;
}

type SortDir = 'asc' | 'desc';

/**
 * Sortable data table. When `virtualized`, only the visible window of rows is
 * rendered inside a scroll container, keeping the DOM small for large datasets.
 * Sorting is announced to assistive tech via aria-sort.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  caption,
  virtualized = false,
  height = 360,
  rowHeight = 44,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    const accessor =
      col.sortValue ?? ((row: T) => row[col.key as keyof T] as unknown as number | string);
    const copy = [...data];
    copy.sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, columns, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const total = sorted.length;
  let startIndex = 0;
  let endIndex = total;
  let padTop = 0;
  let padBottom = 0;

  if (virtualized) {
    const overscan = 4;
    startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(height / rowHeight) + overscan * 2;
    endIndex = Math.min(total, startIndex + visibleCount);
    padTop = startIndex * rowHeight;
    padBottom = (total - endIndex) * rowHeight;
  }

  const visibleRows = sorted.slice(startIndex, endIndex);

  const table = (
    <table className="fds-table">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col) => {
            const isSortable = col.sortable !== false;
            const isSorted = sortKey === col.key;
            const ariaSort = isSorted
              ? sortDir === 'asc'
                ? 'ascending'
                : 'descending'
              : isSortable
                ? 'none'
                : undefined;
            return (
              <th
                key={col.key}
                aria-sort={ariaSort}
                className={cx(col.numeric && 'fds-th--numeric', isSortable && 'fds-th--sortable')}
                onClick={isSortable ? () => toggleSort(col.key) : undefined}
                onKeyDown={
                  isSortable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSort(col.key);
                        }
                      }
                    : undefined
                }
                tabIndex={isSortable ? 0 : undefined}
                role={isSortable ? 'columnheader button' : undefined}
              >
                {col.header}
                {isSortable && (
                  <span className="fds-th__sort" aria-hidden="true">
                    {isSorted ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {virtualized && padTop > 0 && (
          <tr aria-hidden="true" style={{ height: padTop }}>
            <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
          </tr>
        )}
        {visibleRows.map((row) => (
          <tr key={rowKey(row)} style={virtualized ? { height: rowHeight } : undefined}>
            {columns.map((col) => (
              <td key={col.key} className={cx(col.numeric && 'fds-td--numeric')}>
                {col.render ? col.render(row) : (row[col.key as keyof T] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
        {virtualized && padBottom > 0 && (
          <tr aria-hidden="true" style={{ height: padBottom }}>
            <td colSpan={columns.length} style={{ padding: 0, border: 'none' }} />
          </tr>
        )}
      </tbody>
    </table>
  );

  if (!virtualized) {
    return <div className="fds-table-wrap">{table}</div>;
  }

  return (
    <div className="fds-table-wrap">
      <div
        ref={scrollRef}
        className="fds-table__scroll"
        style={{ maxHeight: height }}
        onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      >
        {table}
      </div>
    </div>
  );
}
