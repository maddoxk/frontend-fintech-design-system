import { useMemo } from 'react';

export interface SparklineProps {
  /** Series of numeric values to plot. */
  data: number[];
  width?: number;
  height?: number;
  /** Render the filled area beneath the line (AreaChart mode). */
  area?: boolean;
  /** Show a dot on the last point. */
  showLastDot?: boolean;
  strokeWidth?: number;
  /** Accessible label describing the trend. */
  ariaLabel?: string;
}

/**
 * Pure-SVG sparkline / area chart. No dependencies. Scales the series to fit
 * the viewBox and exposes an accessible label (role="img").
 */
export function Sparkline({
  data,
  width = 160,
  height = 48,
  area = true,
  showLastDot = true,
  strokeWidth = 2,
  ariaLabel,
}: SparklineProps) {
  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (data.length === 0) {
      return { linePath: '', areaPath: '', lastPoint: null as null | { x: number; y: number } };
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = strokeWidth + 1;
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

  const label =
    ariaLabel ??
    (data.length > 1
      ? `Trend from ${data[0]} to ${data[data.length - 1]} over ${data.length} points`
      : 'Sparkline');

  return (
    <svg
      className="fds-chart"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      {area && areaPath && <path className="fds-chart__area" d={areaPath} />}
      {linePath && <path className="fds-chart__line" d={linePath} strokeWidth={strokeWidth} />}
      {showLastDot && lastPoint && (
        <circle className="fds-chart__dot" cx={lastPoint.x} cy={lastPoint.y} r={strokeWidth + 1} />
      )}
    </svg>
  );
}

/** Alias: AreaChart is a Sparkline with the filled area always on. */
export function AreaChart(props: Omit<SparklineProps, 'area'>) {
  return <Sparkline {...props} area />;
}
