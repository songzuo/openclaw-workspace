import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from '../components/Navigation';
import * as nextNavigation from 'next/navigation';

// Mock Next.js usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = nextNavigation.usePathname as ReturnType<typeof vi.fn>;

describe('Navigation', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    mockedUsePathname.mockClear();
  });

  it('renders navigation component', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('has correct aria-label', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation');
    expect(nav.getAttribute('aria-label')).toBe('主导航');
  });

  it('renders all navigation items', () => {
    render(<Navigation />);
    // 使用 getAllByText 并检查长度
    expect(screen.getAllByText('🏠').length).toBeGreaterThan(0);
    expect(screen.getAllByText('📊').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🤖').length).toBeGreaterThan(0);
    expect(screen.getAllByText('📋').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🧠').length).toBeGreaterThan(0);
  });

  it('renders navigation labels', () => {
    render(<Navigation />);
    expect(screen.getAllByText('首页').length).toBeGreaterThan(0);
    expect(screen.getAllByText('实时看板').length).toBeGreaterThan(0);
    expect(screen.getAllByText('子代理').length).toBeGreaterThan(0);
    expect(screen.getAllByText('任务').length).toBeGreaterThan(0);
    expect(screen.getAllByText('记忆').length).toBeGreaterThan(0);
  });

  it('renders logo with correct aria-label', () => {
    render(<Navigation />);
    const logoLink = screen.getByLabelText('AI 团队首页');
    expect(logoLink).toBeDefined();
  });

  it('renders notification button', () => {
    render(<Navigation />);
    const notificationButton = screen.getByLabelText('通知');
    expect(notificationButton).toBeDefined();
  });

  it('renders settings button', () => {
    render(<Navigation />);
    const settingsButton = screen.getByLabelText('设置');
    expect(settingsButton).toBeDefined();
  });

  it('highlights current page', () => {
    mockedUsePathname.mockReturnValue('/dashboard');
    render(<Navigation />);
    const dashboardLink = screen.getByLabelText('实时看板（当前页面）');
    expect(dashboardLink).toBeDefined();
  });

  it('has menuitem roles', () => {
    render(<Navigation />);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBe(5);
  });

  it('has proper keyboard navigation data attributes', () => {
    render(<Navigation />);
    const navLinks = document.querySelectorAll('[data-nav-index]');
    expect(navLinks.length).toBe(5);
  });
});
