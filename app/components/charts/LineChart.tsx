'use client';

import { useMemo, useState } from 'react';
import { ChartContainer, ChartLegend, TimeSeriesPoint, CHART_COLORS } from './Chart';

// ===== Line Chart =====
interface LineChartProps {
  data: { label: string; value: number }[];
  title: string;
  subtitle?: string;
  height?: number;
  color?: string;
  showArea?: boolean;
  showPoints?: boolean;
  animate?: boolean;
}

export function LineChart({
  data,
  title,
  subtitle,
  height = 300,
  color = CHART_COLORS.blue,
  showArea = true,
  showPoints = true,
  animate = true,
}: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { minValue, maxValue, total } = useMemo(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    return { minValue: Math.min(0, min), maxValue: max || 1, total: sum };
  }, [data]);

  const chartDimensions = {
    width: 500,
    height,
    padding: { top: 30, right: 30, bottom: 60, left: 60 },
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  const points = useMemo(() => {
    return data.map((d, i) => ({
      x: chartDimensions.padding.left + (chartWidth / (data.length - 1 || 1)) * i,
      y: chartDimensions.padding.top + chartHeight - ((d.value - minValue) / (maxValue - minValue || 1)) * chartHeight,
      value: d.value,
      label: d.label,
    }));
  }, [data, chartWidth, chartHeight, minValue, maxValue]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      d += ` Q ${points[i - 1].x} ${points[i - 1].y} ${xc} ${yc}`;
    }
    d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    if (!showArea || points.length === 0) return '';
    const yBase = chartDimensions.padding.top + chartHeight;
    return `${pathD} L ${points[points.length - 1].x} ${yBase} L ${points[0].x} ${yBase} Z`;
  }, [pathD, showArea, points]);

  return (
    <ChartContainer title={title} subtitle={subtitle}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={chartDimensions.padding.left}
            y1={chartDimensions.padding.top + (chartHeight / 4) * i}
            x2={chartDimensions.width - chartDimensions.padding.right}
            y2={chartDimensions.padding.top + (chartHeight / 4) * i}
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray="4,4"
          />
        ))}

        {/* Y-axis labels */}
        {[maxValue, Math.round(((maxValue - minValue) * 0.75 + minValue)), Math.round(((maxValue - minValue) * 0.5 + minValue)), Math.round(((maxValue - minValue) * 0.25 + minValue)), minValue].map(
          (label, i) => (
            <text
              key={i}
              x={chartDimensions.padding.left - 10}
              y={chartDimensions.padding.top + (chartHeight / 4) * i}
              textAnchor="end"
              alignmentBaseline="middle"
              className="fill-gray-500 dark:fill-gray-400 text-xs"
            >
              {label}
            </text>
          )
        )}

        {/* Area fill */}
        {showArea && areaD && (
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        {showArea && areaD && (
          <path
            d={areaD}
            fill={`url(#gradient-${title})`}
            className={animate ? 'animate-fade-in' : ''}
          />
        )}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? 'animate-draw-line' : ''}
          style={{ strokeDasharray: 1000, strokeDashoffset: animate ? 1000 : 0 }}
        />

        {/* Points */}
        {showPoints &&
          points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === i ? 6 : 4}
                fill={color}
                stroke="white"
                strokeWidth={2}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {hoveredIndex === i && (
                <g>
                  <rect
                    x={point.x - 30}
                    y={point.y - 35}
                    width={60}
                    height={24}
                    fill="currentColor"
                    className="text-gray-900 dark:text-gray-700"
                    rx={4}
                  />
                  <text
                    x={point.x}
                    y={point.y - 18}
                    textAnchor="middle"
                    className="fill-white text-xs font-semibold"
                  >
                    {point.value}
                  </text>
                </g>
              )}
            </g>
          ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          // Show every nth label based on data length
          const showLabel = data.length <= 10 || i % Math.ceil(data.length / 10) === 0;
          if (!showLabel) return null;
          return (
            <text
              key={i}
              x={chartDimensions.padding.left + (chartWidth / (data.length - 1 || 1)) * i}
              y={chartDimensions.height - chartDimensions.padding.bottom + 20}
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400 text-xs"
            >
              {d.label.length > 8 ? d.label.slice(0, 8) : d.label}
            </text>
          );
        })}
      </svg>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">最小值</div>
          <div className="font-semibold text-gray-900 dark:text-white">{minValue}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">最大值</div>
          <div className="font-semibold text-gray-900 dark:text-white">{maxValue}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">总计</div>
          <div className="font-semibold text-gray-900 dark:text-white">{total}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-draw-line {
          animation: draw-line 1s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </ChartContainer>
  );
}

// ===== Real-time Line Chart =====
interface RealtimeLineChartProps {
  title: string;
  data: TimeSeriesPoint[];
  height?: number;
  color?: string;
  maxPoints?: number;
  updateInterval?: number;
}

export function RealtimeLineChart({
  title,
  data,
  height = 250,
  color = CHART_COLORS.green,
}: RealtimeLineChartProps) {
  const { minValue, maxValue } = useMemo(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { minValue: Math.min(0, min), maxValue: max || 1 };
  }, [data]);

  const chartDimensions = {
    width: 400,
    height,
    padding: { top: 20, right: 20, bottom: 30, left: 50 },
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  const points = useMemo(() => {
    if (data.length === 0) return [];
    return data.map((d, i) => ({
      x: chartDimensions.padding.left + (chartWidth / (data.length - 1 || 1)) * i,
      y: chartDimensions.padding.top + chartHeight - ((d.value - minValue) / (maxValue - minValue || 1)) * chartHeight,
      value: d.value,
    }));
  }, [data, chartWidth, chartHeight, minValue, maxValue]);

  const pathD = points.length > 0
    ? points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
    : '';

  const latestValue = data[data.length - 1]?.value.toFixed(1) || '0';

  return (
    <ChartContainer
      title={title}
      actions={
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-400">实时</span>
        </div>
      }
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
      >
        {/* Grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={chartDimensions.padding.left}
            y1={chartDimensions.padding.top + (chartHeight / 4) * i}
            x2={chartDimensions.width - chartDimensions.padding.right}
            y2={chartDimensions.padding.top + (chartHeight / 4) * i}
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray="4,4"
          />
        ))}

        {/* Line */}
        {points.length > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Latest point */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={4}
            fill={color}
            stroke="white"
            strokeWidth={2}
          />
        )}
      </svg>

      <div className="text-center mt-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{latestValue}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">当前值</span>
      </div>
    </ChartContainer>
  );
}

// ===== Multi-Line Chart =====
interface MultiLineChartProps {
  data: {
    name: string;
    values: number[];
    color?: string;
  }[];
  labels: string[];
  title: string;
  subtitle?: string;
  height?: number;
}

export function MultiLineChart({ data: series, labels, title, subtitle, height = 350 }: MultiLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ seriesIndex: number; pointIndex: number } | null>(null);

  const { minValue, maxValue } = useMemo(() => {
    const allValues = series.flatMap((s) => s.values);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    return { minValue: Math.min(0, min), maxValue: max || 1 };
  }, [series]);

  const chartDimensions = {
    width: 500,
    height,
    padding: { top: 30, right: 30, bottom: 60, left: 60 },
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  const allPoints = useMemo(() => {
    return series.map((s) => ({
      name: s.name,
      color: s.color || CHART_COLORS.blue,
      points: s.values.map((v, i) => ({
        x: chartDimensions.padding.left + (chartWidth / (labels.length - 1 || 1)) * i,
        y: chartDimensions.padding.top + chartHeight - ((v - minValue) / (maxValue - minValue || 1)) * chartHeight,
        value: v,
      })),
    }));
  }, [series, labels, chartWidth, chartHeight, minValue, maxValue]);

  return (
    <ChartContainer title={title} subtitle={subtitle}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
        className="overflow-visible"
      >
        {/* Grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={chartDimensions.padding.left}
            y1={chartDimensions.padding.top + (chartHeight / 4) * i}
            x2={chartDimensions.width - chartDimensions.padding.right}
            y2={chartDimensions.padding.top + (chartHeight / 4) * i}
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray="4,4"
          />
        ))}

        {/* Lines */}
        {allPoints.map((s, si) => {
          const pathD = s.points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
          return (
            <g key={si}>
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.points.map((p, pi) => (
                <circle
                  key={pi}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.seriesIndex === si && hoveredPoint?.pointIndex === pi ? 5 : 3}
                  fill={s.color}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({ seriesIndex: si, pointIndex: pi })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}

        {/* X-axis labels */}
        {labels.map((label, i) => {
          const showLabel = labels.length <= 10 || i % Math.ceil(labels.length / 10) === 0;
          if (!showLabel) return null;
          return (
            <text
              key={i}
              x={chartDimensions.padding.left + (chartWidth / (labels.length - 1 || 1)) * i}
              y={chartDimensions.height - chartDimensions.padding.bottom + 20}
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400 text-xs"
            >
              {label.length > 8 ? label.slice(0, 8) : label}
            </text>
          );
        })}
      </svg>

      <ChartLegend
        items={series.map((s) => ({ label: s.name, color: s.color || CHART_COLORS.blue }))}
        position="bottom"
      />
    </ChartContainer>
  );
}