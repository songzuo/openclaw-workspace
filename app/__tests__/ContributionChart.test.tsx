import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ContributionChart from '../components/ContributionChart';

// Mock 数据 - 使用 TeamMember 类型
const mockMembers = [
  {
    id: 'expert',
    name: '智能体世界专家',
    role: '视角转换/未来布局',
    status: 'active' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=expert',
    currentTask: '研究新技术',
    completedTasks: 15,
    contributionScore: 150,
  },
  {
    id: 'architect',
    name: '架构师',
    role: '设计/规划',
    status: 'active' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=architect',
    currentTask: '系统设计',
    completedTasks: 8,
    contributionScore: 80,
  },
  {
    id: 'executor',
    name: 'Executor',
    role: '执行/实现',
    status: 'idle' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=executor',
    currentTask: '开发新功能',
    completedTasks: 12,
    contributionScore: 120,
  },
];

describe('ContributionChart', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders contribution statistics', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getAllByText(/贡献/).length).toBeGreaterThan(0);
  });

  it('renders chart correctly', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getByText('贡献度排行')).toBeTruthy();
  });

  it('displays all member names', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getAllByText('智能体世界专家').length).toBeGreaterThan(0);
    expect(screen.getAllByText('架构师').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Executor').length).toBeGreaterThan(0);
  });

  it('displays member roles', () => {
    render(<ContributionChart members={mockMembers} />);
    // Component displays member names with roles in parentheses
    expect(screen.getByText(/\(视角转换\/未来布局\)/)).toBeTruthy();
    expect(screen.getByText(/\(设计\/规划\)/)).toBeTruthy();
    expect(screen.getByText(/\(执行\/实现\)/)).toBeTruthy();
  });

  it('displays total contributions', () => {
    render(<ContributionChart members={mockMembers} />);
    const totalContributions = mockMembers.reduce((sum, m) => sum + m.contributionScore, 0);
    expect(screen.getByText(totalContributions.toString())).toBeTruthy();
  });

  it('renders progress bars for each member', () => {
    render(<ContributionChart members={mockMembers} />);
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('renders contribution list with correct structure', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getByText('贡献度排行')).toBeTruthy();
    expect(screen.getByText(/15 任务/)).toBeTruthy();
    expect(screen.getByText(/150 分/)).toBeTruthy();
  });

  it('handles empty members array', () => {
    render(<ContributionChart members={[]} />);
    expect(screen.getAllByText(/贡献/).length).toBeGreaterThan(0);
    // NaN is handled - shows 0 or NaN depending on implementation
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });

  it('renders contribution legend', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getByText('状态分布')).toBeTruthy();
    expect(screen.getByText('任务完成率')).toBeTruthy();
  });

  it('has proper accessibility attributes', () => {
    render(<ContributionChart members={mockMembers} />);
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    expect(progressBars.length).toBeGreaterThan(0);
    
    const firstBar = progressBars[0];
    expect(firstBar.getAttribute('aria-valuenow')).toBeTruthy();
    expect(firstBar.getAttribute('aria-valuemin')).toBe('0');
    expect(firstBar.getAttribute('aria-valuemax')).toBeTruthy();
    expect(firstBar.getAttribute('aria-label')).toBeTruthy();
  });

  it('displays correct task counts', () => {
    render(<ContributionChart members={mockMembers} />);
    const totalTasks = mockMembers.reduce((sum, m) => sum + m.completedTasks, 0);
    expect(screen.getByText(totalTasks.toString())).toBeTruthy();
  });
});
