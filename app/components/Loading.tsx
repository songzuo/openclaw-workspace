'use client';

import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import {
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
  SkeletonStatCard,
  SkeletonTable,
} from './Skeleton';
import { ProgressBar, CircularProgress, StepProgress, LoadingProgress } from './ProgressBar';

export {
  LoadingSpinner,
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
  SkeletonStatCard,
  SkeletonTable,
  ProgressBar,
  CircularProgress,
  StepProgress,
  LoadingProgress,
};

// ============================================================================
// 预构建加载页面组件
// ============================================================================

interface LoadingPageProps {
  message?: string;
  showSpinner?: boolean;
}

/**
 * 通用加载页面 - 用于路由切换时的加载
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = '加载中...',
  showSpinner = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {showSpinner && (
          <>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 font-medium">{message}</p>
          </>
        )}
        {!showSpinner && <LoadingProgress message={message} size="lg" />}
      </div>
    </div>
  );
};

// ============================================================================
// 骨架屏内容加载
// ============================================================================

interface LoadingContentProps {
  type?: 'card' | 'list' | 'table' | 'stats';
  count?: number;
}

/**
 * 骨架屏内容 - 用于页面内容区域的占位加载
 */
export const LoadingContent: React.FC<LoadingContentProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} lines={3} />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow">
            <SkeletonAvatar size="md" />
            <div className="flex-1">
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="40%" height={12} className="mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <SkeletonTable rows={count} columns={4} />
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    );
  }

  return null;
};

// ============================================================================
// 带进度显示的加载组件
// ============================================================================

interface LoadingWithProgressProps {
  progress: number;
  message?: string;
  total?: number;
}

/**
 * 带进度条的加载 - 用于文件上传等有明确进度的场景
 */
export const LoadingWithProgress: React.FC<LoadingWithProgressProps> = ({
  progress,
  message = '处理中',
  total = 100,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
        </div>
        <ProgressBar
          value={progress}
          max={total}
          color="gradient"
          size="lg"
          showPercentage
          animated
        />
        <p className="mt-4 text-center text-sm text-gray-500">{progress}% - 请稍候...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
