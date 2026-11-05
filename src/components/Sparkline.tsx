import { useMemo } from 'react';
import { cx } from '../utils/cx';

export interface SparklineProps {
  /** Series of numeric values to plot. */
  data: number[];
  width?: number;
  height?: number;
  /** Render a flat (no gradient) tinted area beneath the line (AreaChart mode). */
  area?: boolean;
  /** Show the end-point marker (shape encodes trend: circle up, square down, bar flat). */
  showLastDot?: boolean;
  /** Line width in screen px (non-scaling). */
  strokeWidth?: number;
  /** Intent colour from tokens (default: primary). */
  intent?: 'primary' | 'positive' | 'negative' | 'warning';
  /** Accessible label describing the trend. */
  ariaLabel?: string;
}

/**
 * Pure-SVG sparkline / area chart. No dependencies. Scales the series to fit
 * the viewBox and exposes an accessible label (role="img") that states the
 * trend direction in words.
 */
export function Sparkline({
  data: rawData,
  width = 160,
  height = 48,
  area = false,
  showLastDot = true,
  strokeWidth = 1.5,
  intent = 'primary',
  ariaLabel,
}: SparklineProps) {
  const data = useMemo(() => rawData.filter((v) => Number.isFinite(v)), [rawData]);
  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (data.length === 0) {
      return { linePath: '', areaPath: '', lastPoint: null as null | { x: number; y: number } };
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = strokeWidth + 4;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

    const points = data.map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + innerH - ((v - min) / range) * innerH;
      return { x, y };
    });

    const line = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ');
    const areaD = `${line} L${points[points.length - 1].x.toFixed(2)},${(
      height - pad
    ).toFixed(2)} L${points[0].x.toFixed(2)},${(height - pad).toFixed(2)} Z`;

    return { linePath: line, areaPath: areaD, lastPoint: points[points.length - 1] };
  }, [data, width, height, strokeWidth]);

  const first = data[0];
  const end = data[data.length - 1];
  const direction = end > first ? 'rising' : end < first ? 'falling' : 'flat';
  const label =
    ariaLabel ??
    (data.length > 1
      ? `Trend ${direction}, from ${first} to ${end} over ${data.length} points`
      : 'Sparkline');
  const m = 3;

  return (
    <svg
      className={cx('fds-chart', intent !== 'primary' && `fds-chart--${intent}`)}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      {area && areaPath && <path className="fds-chart__area" d={areaPath} />}
      {linePath && <path className="fds-chart__line" d={linePath} strokeWidth={strokeWidth} />}
      {showLastDot && lastPoint && direction === 'rising' && (
        <circle className="fds-chart__dot" cx={lastPoint.x} cy={lastPoint.y} r={m} data-trend="rising" />
      )}
      {showLastDot && lastPoint && direction === 'falling' && (
        <rect className="fds-chart__dot" x={lastPoint.x - m} y={lastPoint.y - m} width={m * 2} height={m * 2} data-trend="falling" />
      )}
      {showLastDot && lastPoint && direction === 'flat' && (
        <rect className="fds-chart__dot" x={lastPoint.x - m} y={lastPoint.y - 1} width={m * 2} height={2} data-trend="flat" />
      )}
    </svg>
  );
}

/** Alias: AreaChart is a Sparkline with the filled area always on. */
export function AreaChart(props: Omit<SparklineProps, 'area'>) {
  return <Sparkline {...props} area />;
}
