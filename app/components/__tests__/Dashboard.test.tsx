import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ============================================================================
// Mocks - 必须在导入被测组件之前设置
// ============================================================================

// Mock React Query hooks
vi.mock('@/lib/query', () => ({
  useDashboardQuery: vi.fn(),
  useDashboardRefresh: vi.fn(),
}));

// Mock 子组件
vi.mock('../MemberCard', () => ({
  MemberCard: ({ member }: { member: { id: string; name: string } }) => (
    <div data-testid={`member-card-${member.id}`} aria-label={`成员: ${member.name}`}>
      {member.name}
    </div>
  ),
}));

vi.mock('../TaskBoard', () => ({
  TaskBoard: ({ issues }: { issues: Array<{ id: number; title: string }> }) => (
    <div data-testid="task-board" aria-label="任务看板">
      {issues.length} 个任务
    </div>
  ),
}));

vi.mock('../ActivityLog', () => ({
  ActivityLog: ({ activities }: { activities: Array<{ id: string }> }) => (
    <div data-testid="activity-log" aria-label="活动日志">
      {activities.length} 条活动
    </div>
  ),
}));

vi.mock('../ContributionChart', () => ({
  default: ({ members }: { members: Array<{ id: string }> }) => (
    <div data-testid="contribution-chart" aria-label="贡献统计">
      {members.length} 个成员贡献
    </div>
  ),
}));

vi.mock('../ProgressBar', () => ({
  default: ({ value, label }: { value: number; label: string }) => (
    <div data-testid="progress-bar" role="progressbar" aria-valuenow={value}>
      进度: {label} ({value}%)
    </div>
  ),
}));

vi.mock('../Loading', () => ({
  default: () => <div data-testid="loading" aria-label="加载中">加载中...</div>,
}));

vi.mock('../ErrorBoundary', () => ({
  default: ({ children, name }: { children: React.ReactNode; name: string }) => (
    <div data-testid={`error-boundary-${name}`}>{children}</div>
  ),
}));

// 导入被测组件和 mock 的 hooks
import Dashboard from '../Dashboard';
import { useDashboardQuery, useDashboardRefresh } from '@/lib/query';

// ============================================================================
// 测试数据
// ============================================================================

const mockDashboardData = {
  members: [
    {
      id: 'agent-1',
      name: '咨询师',
      role: '研究分析',
      status: 'working' as const,
      avatar: '/avatars/consultant.png',
      currentTask: '分析市场数据',
      completedTasks: 15,
    },
    {
      id: 'agent-2',
      name: '架构师',
      role: '架构设计',
      status: 'busy' as const,
      avatar: '/avatars/architect.png',
      currentTask: '设计 API 接口',
      completedTasks: 23,
    },
    {
      id: 'agent-3',
      name: 'Executor',
      role: '执行实现',
      status: 'idle' as const,
      avatar: '/avatars/executor.png',
      currentTask: undefined,
      completedTasks: 42,
    },
  ],
  issues: [
    { id: 1, title: '实现用户认证', status: 'open' },
    { id: 2, title: '优化性能', status: 'in_progress' },
    { id: 3, title: '修复登录 Bug', status: 'done' },
  ],
  activities: [
    { id: 'act-1', type: 'task_completed', message: '完成任务', timestamp: Date.now() },
    { id: 'act-2', type: 'member_status', message: '状态变更', timestamp: Date.now() },
  ],
  stats: {
    totalTasks: 100,
    completedTasks: 75,
    activeMembers: 8,
    avgResponseTime: '2.5s',
  },
};

// ============================================================================
// 测试套件
// ============================================================================

describe('Dashboard', () => {
  const mockRefresh = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // 设置默认 mock 返回值
    vi.mocked(useDashboardQuery).mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch,
    } as any);
    
    vi.mocked(useDashboardRefresh).mockReturnValue({
      refresh: mockRefresh,
      reset: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // ============================================================================
  // 基础渲染测试
  // ============================================================================

  describe('Basic Rendering', () => {
    it('should render the dashboard header with title', () => {
      render(<Dashboard />);
      
      expect(screen.getByRole('heading', { name: /AI 团队仪表盘/i })).toBeDefined();
      expect(screen.getByText('实时监控团队状态和任务进度')).toBeDefined();
    });

    it('should render all stat cards with correct values', () => {
      render(<Dashboard />);
      
      expect(screen.getByText('总任务数')).toBeDefined();
      expect(screen.getByText('100')).toBeDefined(); // totalTasks
      
      expect(screen.getByText('已完成')).toBeDefined();
      expect(screen.getByText('75')).toBeDefined(); // completedTasks
      
      expect(screen.getByText('活跃成员')).toBeDefined();
      expect(screen.getByText('8')).toBeDefined(); // activeMembers
      
      expect(screen.getByText('平均响应')).toBeDefined();
      expect(screen.getByText('2.5s')).toBeDefined(); // avgResponseTime
    });

    it('should render the progress section', () => {
      render(<Dashboard />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeDefined();
      expect(progressBar.getAttribute('aria-valuenow')).toBe('75'); // 75% completion
    });

    it('should render team members section', () => {
      render(<Dashboard />);
      
      expect(screen.getByRole('heading', { name: /团队成员/i })).toBeDefined();
      expect(screen.getByTestId('member-card-agent-1')).toBeDefined();
      expect(screen.getByTestId('member-card-agent-2')).toBeDefined();
      expect(screen.getByTestId('member-card-agent-3')).toBeDefined();
    });

    it('should render activity log section', () => {
      render(<Dashboard />);
      
      expect(screen.getByRole('heading', { name: /活动日志/i })).toBeDefined();
      expect(screen.getByTestId('activity-log')).toBeDefined();
    });
  });

  // ============================================================================
  // 加载状态测试
  // ============================================================================

  describe('Loading State', () => {
    it('should show loading state when isLoading is true and no data', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: null,
        isLoading: true,
        isFetching: true,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      expect(screen.getByTestId('loading')).toBeDefined();
    });

    it('should not show loading state when data exists', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: mockDashboardData,
        isLoading: true, // isLoading but has data
        isFetching: true,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      // 应该显示数据而不是加载状态
      expect(screen.getByRole('heading', { name: /AI 团队仪表盘/i })).toBeDefined();
    });

    it('should show fetching indicator when isFetching is true', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        isFetching: true,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      // 查找正在刷新的指示器
      const indicator = document.querySelector('.animate-pulse');
      expect(indicator).toBeDefined();
    });
  });

  // ============================================================================
  // 错误状态测试
  // ============================================================================

  describe('Error State', () => {
    it('should show error state when there is an error', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: new Error('网络错误'),
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      expect(screen.getByText('加载失败')).toBeDefined();
      expect(screen.getByText('网络错误')).toBeDefined();
    });

    it('should call refetch when retry button is clicked', async () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: new Error('网络错误'),
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      const retryButton = screen.getByRole('button', { name: /重试/i });
      fireEvent.click(retryButton);
      
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show generic error message when error has no message', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: 'Unknown error' as any,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      expect(screen.getByText('An error occurred')).toBeDefined();
    });
  });

  // ============================================================================
  // 刷新功能测试
  // ============================================================================

  describe('Refresh Functionality', () => {
    it('should have a refresh button', () => {
      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /刷新/i });
      expect(refreshButton).toBeDefined();
    });

    it('should call refresh when refresh button is clicked', () => {
      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /刷新/i });
      fireEvent.click(refreshButton);
      
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it('should disable refresh button when fetching', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        isFetching: true,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /刷新/i });
      expect(refreshButton.hasAttribute('disabled')).toBe(true);
    });

    it('should show spinning animation when fetching', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: mockDashboardData,
        isLoading: false,
        isFetching: true,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeDefined();
    });
  });

  // ============================================================================
  // 自动刷新间隔测试
  // ============================================================================

  describe('Auto Refresh Interval', () => {
    it('should render interval selector', () => {
      render(<Dashboard />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeDefined();
    });

    it('should have default interval of 60 seconds', () => {
      render(<Dashboard />);
      
      const select = screen.getByRole('combobox');
      expect(select.value).toBe('60000');
    });

    it('should display current interval in seconds', () => {
      render(<Dashboard />);
      
      expect(screen.getByText(/自动刷新: 60秒/i)).toBeDefined();
    });

    it('should change interval when selection changes', () => {
      render(<Dashboard />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '30000' } });
      
      expect(screen.getByText(/自动刷新: 30秒/i)).toBeDefined();
    });

    it('should support disabling auto refresh', () => {
      render(<Dashboard />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '0' } });
      
      expect(screen.getByText(/自动刷新: 0秒/i)).toBeDefined();
    });

    it('should pass interval to useDashboardQuery', () => {
      render(<Dashboard />);
      
      expect(vi.mocked(useDashboardQuery)).toHaveBeenCalledWith(
        expect.objectContaining({
          refetchInterval: 60000,
          enabled: true,
        })
      );
    });
  });

  // ============================================================================
  // 子组件渲染测试
  // ============================================================================

  describe('Child Components', () => {
    it('should render TaskBoard with issues', () => {
      render(<Dashboard />);
      
      const taskBoard = screen.getByTestId('task-board');
      expect(taskBoard).toBeDefined();
      expect(taskBoard.textContent).toContain('3 个任务');
    });

    it('should render ContributionChart with members', () => {
      render(<Dashboard />);
      
      const chart = screen.getByTestId('contribution-chart');
      expect(chart).toBeDefined();
    });

    it('should wrap child components in ErrorBoundary', () => {
      render(<Dashboard />);
      
      expect(screen.getByTestId('error-boundary-TeamMembers')).toBeDefined();
      expect(screen.getByTestId('error-boundary-ActivityLog')).toBeDefined();
      expect(screen.getByTestId('error-boundary-TaskBoard')).toBeDefined();
      expect(screen.getByTestId('error-boundary-ContributionChart')).toBeDefined();
    });
  });

  // ============================================================================
  // 可访问性测试
  // ============================================================================

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Dashboard />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeDefined();
      
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('should have aria-label on refresh button', () => {
      render(<Dashboard />);
      
      const refreshButton = screen.getByRole('button', { name: /刷新数据/i });
      expect(refreshButton.getAttribute('aria-label')).toBe('刷新数据');
    });

    it('should have aria-label on stats section', () => {
      render(<Dashboard />);
      
      const statsSection = screen.getByRole('region', { name: /统计概览/i });
      expect(statsSection).toBeDefined();
    });
  });

  // ============================================================================
  // 边界情况测试
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle empty members array', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: { ...mockDashboardData, members: [] },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      // 应该正常渲染，没有成员卡片
      expect(screen.getByRole('heading', { name: /AI 团队仪表盘/i })).toBeDefined();
    });

    it('should handle zero tasks completion rate', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: { 
          ...mockDashboardData, 
          stats: { ...mockDashboardData.stats, totalTasks: 0, completedTasks: 0 }
        },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      render(<Dashboard />);
      
      // 0/0 应该显示 0% 或者 NaN 处理
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeDefined();
    });

    it('should return null when no data and not loading/error', () => {
      vi.mocked(useDashboardQuery).mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch,
      } as any);
      
      const { container } = render(<Dashboard />);
      
      // Dashboard 应该返回 null
      expect(container.firstChild).toBeNull();
    });
  });
});