'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple' | 'gradient';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

/**
 * 进度条组件 - 显示任务完成进度
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  showPercentage = false,
  animated = true,
  striped = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    red: 'bg-red-600',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
  };

  const labelColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {showLabel && (
            <span className="text-sm text-gray-600">进度</span>
          )}
          {showPercentage && (
            <span className={`text-sm font-medium ${labelColorClasses[color]}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`
            ${sizeClasses[size]}
            ${colorClasses[color]}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${striped ? 'progress-striped' : ''}
            ${animated ? 'animate-progress' : ''}
            rounded-full
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// ============================================================================
// 带动画的环形进度条
// ============================================================================

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple';
  showValue?: boolean;
  label?: string;
}

/**
 * 环形进度条 - 更美观的圆形进度展示
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = 'blue',
  showValue = true,
  label
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  const colorMap = {
    blue: '#2563eb',
    green: '#16a34a',
    yellow: '#eab308',
    red: '#dc2626',
    indigo: '#4f46e5',
    purple: '#9333ea'
  };

  // 动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* 进度圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={colorMap[color]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg font-bold text-${color}-600`}>
            {Math.round(animatedValue)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 多步骤进度指示器
// ============================================================================

interface StepProgressProps {
  steps: string[];
  currentStep: number;
  showLabels?: boolean;
}

/**
 * 步骤进度条 - 用于多步骤流程
 */
export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  showLabels = true
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className={`flex items-center ${isLast ? 'flex-1' : 'flex-1'}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-300
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                {showLabels && (
                  <span
                    className={`
                      mt-2 text-xs text-center max-w-[80px]
                      ${isCurrent ? 'font-medium text-blue-600' : 'text-gray-500'}
                    `}
                  >
                    {step}
                  </span>
                )}
              </div>
              {!isLast && (
                <div
                  className={`
                    flex-1 h-1 mx-2 rounded transition-all duration-300
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 加载状态进度条 (不确定进度)
// ============================================================================

interface LoadingProgressProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 不确定进度的加载条 - 用于未知时长的加载
 */
export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  message = '加载中...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{message}</span>
        <span className="text-sm text-gray-400 animate-pulse">•••</span>
      </div>
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`
            ${sizeClasses[size]}
            bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
            animate-loading-bar
            rounded-full
          `}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
