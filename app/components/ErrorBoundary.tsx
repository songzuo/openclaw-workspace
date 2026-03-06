'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary 组件 - 捕获子组件错误
 * 
 * 功能：
 * - 捕获 React 组件树中的错误
 * - 显示友好的错误界面
 * - 提供错误报告机制
 * - 支持错误恢复
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误到控制台（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary 捕获错误:', error, errorInfo);
    }

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 可以在这里发送错误报告到服务器
    if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
      try {
        const payload = JSON.stringify({
          type: 'react-error',
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
        window.navigator.sendBeacon('/api/errors', payload);
      } catch (e) {
        // 忽略发送失败
      }
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果有自定义 fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误界面
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            {/* 错误图标 */}
            <div className="text-6xl mb-4" aria-hidden="true">
              ⚠️
            </div>
            
            {/* 错误标题 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              出现了一些问题
            </h2>
            
            {/* 错误描述 */}
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || '发生了未知错误，请稍后重试。'}
            </p>
            
            {/* 错误详情 (仅开发环境) */}
            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <details className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  错误详情
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            {/* 操作按钮 */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                重试
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
