import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TaskBoard } from '../components/TaskBoard';
import type { GitHubIssue } from '../dashboard/page';

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

  it('should render task board header', () => {
    render(<TaskBoard issues={mockIssues} />);
    // Use first() to handle StrictMode duplicate renders
    expect(screen.getAllByText('GitHub 任务')[0]).toBeDefined();
  });

  it('should show empty state when no issues', () => {
    render(<TaskBoard issues={[]} />);
    expect(screen.getAllByText('暂无任务')[0]).toBeDefined();
  });

  it('should display progress with correct percentage', () => {
    render(<TaskBoard issues={mockIssues} />);
    // 1 open + 1 closed = 50% complete
    expect(screen.getAllByText(/50%/)[0]).toBeDefined();
  });

  it('should render at least one issue when filtered', () => {
    render(<TaskBoard issues={mockIssues} />);
    // Default filter is 'open', should show the open issue
    const articles = screen.getAllByRole('listitem');
    expect(articles.length).toBeGreaterThan(0);
  });
});
