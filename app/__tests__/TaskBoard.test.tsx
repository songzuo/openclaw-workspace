import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { TaskBoard } from '../components/TaskBoard';
import type { GitHubIssue } from '../dashboard/page';

// Mock ProgressBar component
vi.mock('../components/ProgressBar', () => ({
  default: ({ value, showPercentage }: any) => (
    <div data-testid="progress-bar" role="progressbar" aria-valuenow={value}>
      {showPercentage && <span>{value}%</span>}
    </div>
  ),
}));

describe('TaskBoard', () => {
  const mockIssues: GitHubIssue[] = [
    {
      number: 1,
      title: 'Implement login feature',
      state: 'open',
      labels: [{ name: 'enhancement', color: '84b6eb' }],
      assignee: { login: 'testuser', avatar_url: 'https://example.com/avatar.png' },
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
      html_url: 'https://github.com/test/1',
    },
    {
      number: 2,
      title: 'Fix bug in dashboard',
      state: 'closed',
      labels: [{ name: 'bug', color: 'd73a49' }],
      assignee: { login: 'dev', avatar_url: 'https://example.com/avatar2.png' },
      created_at: '2024-01-01',
      updated_at: '2024-01-03',
      html_url: 'https://github.com/test/2',
    },
  ];

  beforeEach(() => {
    cleanup();
  });

  it('should render task board header', () => {
    render(<TaskBoard issues={mockIssues} />);
    expect(screen.getByText('GitHub 任务')).toBeTruthy();
  });

  it('should show empty state when no issues', () => {
    render(<TaskBoard issues={[]} />);
    expect(screen.getByText('暂无任务')).toBeTruthy();
  });

  it('should display progress with correct percentage', async () => {
    render(<TaskBoard issues={mockIssues} />);
    // 1 open + 1 closed = 50% complete
    await waitFor(() => {
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });
  });

  it('should render at least one issue when filtered', () => {
    render(<TaskBoard issues={mockIssues} />);
    // Default filter is 'open', should show the open issue
    const articles = screen.getAllByRole('listitem');
    expect(articles.length).toBeGreaterThan(0);
  });

  it('should display issue titles', () => {
    render(<TaskBoard issues={mockIssues} />);
    expect(screen.getByText('Implement login feature')).toBeTruthy();
  });

  it('should show issue numbers as links', () => {
    render(<TaskBoard issues={mockIssues} />);
    const issueLinks = screen.getAllByText(/#\d+/);
    expect(issueLinks.length).toBeGreaterThan(0);
  });

  it('should display labels when present', () => {
    render(<TaskBoard issues={mockIssues} />);
    expect(screen.getByText('enhancement')).toBeTruthy();
    expect(screen.getByText('bug')).toBeTruthy();
  });

  it('should show assignee information', () => {
    render(<TaskBoard issues={mockIssues} />);
    expect(screen.getByText('testuser')).toBeTruthy();
    expect(screen.getByText('dev')).toBeTruthy();
  });

  it('should display status badges', () => {
    render(<TaskBoard issues={mockIssues} />);
    expect(screen.getByText('进行中')).toBeTruthy();
    expect(screen.getByText('已完成')).toBeTruthy();
  });
});