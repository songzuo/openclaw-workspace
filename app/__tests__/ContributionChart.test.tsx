import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ContributionChart } from '../components/ContributionChart';

// Mock 数据
const mockMembers = [
  {
    id: 'expert',
    name: '智能体世界专家',
    emoji: '🌟',
    role: '视角转换/未来布局',
    provider: 'minimax',
    status: 'working' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=expert',
    currentTask: '研究新技术',
    completedTasks: 15,
  },
  {
    id: 'architect',
    name: '架构师',
    emoji: '🏗️',
    role: '设计/规划',
    provider: 'self-claude',
    status: 'busy' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=architect',
    currentTask: '系统设计',
    completedTasks: 8,
  },
  {
    id: 'executor',
    name: 'Executor',
    emoji: '⚡',
    role: '执行/实现',
    provider: 'volcengine',
    status: 'working' as const,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=executor',
    currentTask: '开发新功能',
    completedTasks: 12,
  },
];

describe('ContributionChart', () => {
  // 每个测试前清理
  beforeEach(() => {
    cleanup();
  });

  it('renders title correctly', () => {
    render(<ContributionChart members={mockMembers} title="贡献统计" />);
    expect(screen.getByText('贡献统计')).toBeDefined();
  });

  it('renders default title when not provided', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getByText('贡献统计')).toBeDefined();
  });

  it('displays all member names', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getAllByText('智能体世界专家').length).toBeGreaterThan(0);
    expect(screen.getAllByText('架构师').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Executor').length).toBeGreaterThan(0);
  });

  it('displays member emojis', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getAllByText('🌟').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🏗️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('⚡').length).toBeGreaterThan(0);
  });

  it('displays total contributions', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getAllByText(/总贡献/).length).toBeGreaterThan(0);
  });

  it('renders progress bars for each member', () => {
    render(<ContributionChart members={mockMembers} />);
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    expect(progressBars.length).toBe(mockMembers.length);
  });

  it('renders contribution list with correct structure', () => {
    render(<ContributionChart members={mockMembers} />);
    const listItems = document.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBe(mockMembers.length);
  });

  it('handles empty members array', () => {
    render(<ContributionChart members={[]} />);
    expect(screen.getAllByText(/总贡献/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('renders contribution legend', () => {
    render(<ContributionChart members={mockMembers} />);
    expect(screen.getAllByText('提交 (Commits)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('任务 (Tasks)').length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes', () => {
    render(<ContributionChart members={mockMembers} />);
    
    // 检查标题有正确的 aria-labelledby
    const heading = screen.getAllByRole('heading', { level: 2 })[0];
    expect(heading.getAttribute('id')).toBeTruthy();
    
    // 检查进度条有正确的 role 和 aria 属性
    const progressBars = document.querySelectorAll('[role="progressbar"]');
    progressBars.forEach(bar => {
      expect(bar.getAttribute('aria-valuemin')).toBeTruthy();
      expect(bar.getAttribute('aria-valuemax')).toBeTruthy();
      expect(bar.getAttribute('aria-valuenow')).toBeTruthy();
    });
  });

  it('displays correct task counts', () => {
    render(<ContributionChart members={mockMembers} />);
    // 任务数量显示
    const taskTexts = screen.getAllByText(/任务:/);
    expect(taskTexts.length).toBe(mockMembers.length);
  });
});
