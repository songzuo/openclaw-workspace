'use client';

import { useState, useEffect, useRef } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface RealtimeChartProps {
  title: string;
  maxDataPoints?: number;
  updateInterval?: number;
  color?: 'blue' | 'green' | 'red' | 'purple';
  height?: number;
}

export default function RealtimeChart({
  title,
  maxDataPoints = 20,
  updateInterval = 2000,
  color = 'blue',
  height = 200,
}: RealtimeChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Generate initial data
    const now = Date.now();
    const initialData = Array.from({ length: maxDataPoints }, (_, i) => ({
      timestamp: now - (maxDataPoints - i) * updateInterval,
      value: Math.random() * 80 + 20,
    }));
    setData(initialData);

    // Update data periodically
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev];
        if (newData.length >= maxDataPoints) {
          newData.shift();
        }
        newData.push({
          timestamp: Date.now(),
          value: Math.random() * 80 + 20,
        });
        return newData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [maxDataPoints, updateInterval]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = (rect.height / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Calculate points
    const padding = 20;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    const maxValue = Math.max(...data.map((d) => d.value), 100);
    const minValue = Math.min(...data.map((d) => d.value), 0);
    const valueRange = maxValue - minValue || 1;

    const points = data.map((point, index) => ({
      x: padding + (index / (data.length - 1)) * chartWidth,
      y: padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight,
    }));

    // Draw area fill
    const colorMap = {
      blue: { r: 59, g: 130, b: 246 },
      green: { r: 16, g: 185, b: 129 },
      red: { r: 239, g: 68, b: 68 },
      purple: { r: 139, g: 92, b: 246 },
    };

    const rgb = colorMap[color];
    const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding);
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

    ctx.beginPath();
    ctx.moveTo(points[0].x, rect.height - padding);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, rect.height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw latest point
    const latestPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(latestPoint.x, latestPoint.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw latest value
    const latestValue = data[data.length - 1].value;
    ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(latestValue.toFixed(1), rect.width - padding, padding - 5);

  }, [data, color]);

  const latestValue = data[data.length - 1]?.value.toFixed(1) || '0';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-400">实时</span>
        </div>
      </div>
      <div style={{ height }} className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="mt-4 text-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{latestValue}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">当前值</span>
      </div>
    </div>
  );
}

// Sparkline Component
export function Sparkline({
  data,
  color = 'blue',
  width = 100,
  height = 30,
}: {
  data: number[];
  color?: 'blue' | 'green' | 'red' | 'purple';
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - ((value - min) / range) * height * 0.8 - height * 0.1,
    }));

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    const colorMap = {
      blue: '#3b82f6',
      green: '#10b981',
      red: '#ef4444',
      purple: '#8b5cf6',
    };

    ctx.strokeStyle = colorMap[color];
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [data, color, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
