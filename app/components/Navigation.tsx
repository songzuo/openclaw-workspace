'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: '首页',
    icon: '🏠',
  },
  {
    href: '/dashboard',
    label: '实时看板',
    icon: '📊',
  },
  {
    href: '/subagents',
    label: '子代理',
    icon: '🤖',
  },
  {
    href: '/tasks',
    label: '任务',
    icon: '📋',
  },
  {
    href: '/profile',
    label: '个人资料',
    icon: '👤',
  },
  {
    href: '/settings',
    label: '设置',
    icon: '⚙️',
  },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { toggleTheme, resolvedTheme } = useTheme();

  // 键盘导航处理
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = NAV_ITEMS.length;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (index + 1) % items;
        const nextLink = document.querySelector(
          `[data-nav-index="${nextIndex}"]`
        ) as HTMLAnchorElement;
        nextLink?.focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (index - 1 + items) % items;
        const prevLink = document.querySelector(
          `[data-nav-index="${prevIndex}"]`
        ) as HTMLAnchorElement;
        prevLink?.focus();
        break;
      case 'Home':
        e.preventDefault();
        const firstLink = document.querySelector('[data-nav-index="0"]') as HTMLAnchorElement;
        firstLink?.focus();
        break;
      case 'End':
        e.preventDefault();
        const lastLink = document.querySelector(
          `[data-nav-index="${items - 1}"]`
        ) as HTMLAnchorElement;
        lastLink?.focus();
        break;
    }
  };

  return (
    <nav
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors"
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg"
            aria-label="AI 团队首页"
          >
            <span className="text-2xl" aria-hidden="true">
              🤖
            </span>
            <span className="font-bold text-gray-900 dark:text-white hidden sm:inline">AI 团队</span>
          </Link>

          {/* 导航链接 */}
          <div className="flex items-center gap-1" role="menubar" aria-label="页面导航">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                data-nav-index={index}
                role="menuitem"
                tabIndex={0}
                aria-current={pathname === item.href ? 'page' : undefined}
                aria-label={`${item.label}${pathname === item.href ? '（当前页面）' : ''}`}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  flex items-center gap-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                  ${
                    pathname === item.href
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2" role="group" aria-label="用户操作">
            {/* 主题切换按钮 */}
            <ThemeToggle size="md" />
            <button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="通知"
              type="button"
            >
              <span aria-hidden="true">🔔</span>
            </button>
            <Link
              href="/settings"
              className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                pathname === '/settings'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="设置"
              aria-current={pathname === '/settings' ? 'page' : undefined}
            >
              <span aria-hidden="true">⚙️</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
