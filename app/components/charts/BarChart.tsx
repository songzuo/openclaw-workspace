'use client';

import { useMemo, useState } from 'react';
import { ChartDataPoint, ChartContainer, ChartLegend, CHART_COLORS } from './Chart';

interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  horizontal?: boolean;
  stacked?: boolean;
  animate?: boolean;
}

export function BarChart({
  data,
  title,
  subtitle,
  height = 300,
  showLegend = false,
  horizontal = false,
  animate = true,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { maxValue, total } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value));
    const sum = data.reduce((acc, d) => acc + d.value, 0);
    return { maxValue: max || 1, total: sum };
  }, [data]);

  const chartDimensions = {
    width: horizontal ? 500 : 400,
    height,
    padding: { top: 20, right: 30, bottom: horizontal ? 60 : 40, left: horizontal ? 80 : 60 },
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;

  const yLabels = [maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), 0];

  return (
    <ChartContainer title={title} subtitle={subtitle}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {yLabels.map((_, i) => (
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
        {yLabels.map((label, i) => (
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
        ))}

        {/* Bars */}
        {data.map((item, index) => {
          const barWidth = chartWidth / data.length * 0.7;
          const gap = chartWidth / data.length * 0.3;
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = chartDimensions.padding.left + (chartWidth / data.length) * index + gap / 2;
          const y = chartDimensions.padding.top + chartHeight - barHeight;
          const color = item.color || CHART_COLORS.blue;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={4}
                className={`transition-all duration-300 ${animate ? 'animate-grow-up' : ''} ${
                  hoveredIndex === index ? 'opacity-100 brightness-110' : 'opacity-90'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transformOrigin: `${x + barWidth / 2}px ${chartDimensions.padding.top + chartHeight}px`,
                }}
              />
              {/* Value label on hover */}
              {hoveredIndex === index && (
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-gray-900 dark:fill-white text-sm font-semibold"
                >
                  {item.value}
                </text>
              )}
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={chartDimensions.height - chartDimensions.padding.bottom + 20}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400 text-xs"
              >
                {item.label.length > 8 ? item.label.slice(0, 8) + '...' : item.label}
              </text>
            </g>
          );
        })}
      </svg>

      {showLegend && (
        <ChartLegend
          items={data.map((d) => ({ label: d.label, color: d.color || CHART_COLORS.blue }))}
          position="bottom"
        />
      )}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">总计</span>
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
      </div>

      <style jsx>{`
        @keyframes grow-up {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
        .animate-grow-up {
          animation: grow-up 0.5s ease-out forwards;
        }
      `}</style>
    </ChartContainer>
  );
}

// ===== Grouped Bar Chart =====
interface GroupedBarChartProps {
  categories: string[];
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  title: string;
  subtitle?: string;
  height?: number;
}

export function GroupedBarChart({ categories, series, title, subtitle, height = 350 }: GroupedBarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ catIndex: number; seriesIndex: number } | null>(null);

  const maxValue = useMemo(() => {
    const allValues = series.flatMap((s) => s.data);
    return Math.max(...allValues) || 1;
  }, [series]);

  const chartDimensions = {
    width: 500,
    height,
    padding: { top: 30, right: 30, bottom: 60, left: 60 },
  };

  const chartWidth = chartDimensions.width - chartDimensions.padding.left - chartDimensions.padding.right;
  const chartHeight = chartDimensions.height - chartDimensions.padding.top - chartDimensions.padding.bottom;
  const groupWidth = chartWidth / categories.length;
  const barWidth = (groupWidth * 0.8) / series.length;

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
        {[maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), 0].map(
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

        {/* Bars */}
        {categories.map((category, catIndex) => (
          <g key={catIndex}>
            {series.map((s, seriesIndex) => {
              const barHeight = (s.data[catIndex] / maxValue) * chartHeight;
              const x = chartDimensions.padding.left + groupWidth * catIndex + (groupWidth * 0.1) + barWidth * seriesIndex;
              const y = chartDimensions.padding.top + chartHeight - barHeight;
              const isHovered =
                hoveredBar?.catIndex === catIndex && hoveredBar?.seriesIndex === seriesIndex;

              return (
                <rect
                  key={seriesIndex}
                  x={x}
                  y={y}
                  width={barWidth - 2}
                  height={barHeight}
                  fill={s.color || CHART_COLORS.blue}
                  rx={3}
                  className={`transition-all duration-200 ${isHovered ? 'brightness-110' : 'opacity-90'}`}
                  onMouseEnter={() => setHoveredBar({ catIndex, seriesIndex })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
              );
            })}
            {/* Category label */}
            <text
              x={chartDimensions.padding.left + groupWidth * catIndex + groupWidth / 2}
              y={chartDimensions.height - chartDimensions.padding.bottom + 20}
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400 text-xs"
            >
              {category.length > 8 ? category.slice(0, 8) + '...' : category}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <ChartLegend
        items={series.map((s) => ({ label: s.name, color: s.color || CHART_COLORS.blue }))}
        position="bottom"
      />
    </ChartContainer>
  );
}
