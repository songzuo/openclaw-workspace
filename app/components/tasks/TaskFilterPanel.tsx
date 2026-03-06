'use client';

import React from 'react';
import { TaskFilter, TaskPriority, TaskStatus, TaskTag } from '@/lib/tasks/types';
import { PriorityBadge } from './PriorityBadge';

interface TaskFilterPanelProps {
  filter: TaskFilter;
  onFilterChange: (filter: Partial<TaskFilter>) => void;
  onReset: () => void;
  availableTags?: TaskTag[];
  assignees?: string[];
  className?: string;
}

/**
 * 任务过滤器面板组件
 */
export function TaskFilterPanel({
  filter,
  onFilterChange,
  onReset,
  availableTags = [],
  assignees = [],
  className = '',
}: TaskFilterPanelProps) {
  const hasActiveFilters =
    filter.priority || filter.status || (filter.tags && filter.tags.length > 0) || filter.assignee || filter.search;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">筛选任务</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            重置筛选
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 搜索 */}
        <div>
          <label
            htmlFor="filter-search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            搜索
          </label>
          <input
            id="filter-search"
            type="text"
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
            placeholder="搜索任务标题或描述..."
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* 优先级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            优先级
          </label>
          <div className="flex flex-wrap gap-2">
            {(['high', 'medium', 'low'] as TaskPriority[]).map((priority) => {
              const isActive = filter.priority === priority;
              return (
                <button
                  key={priority}
                  onClick={() =>
                    onFilterChange({ priority: isActive ? undefined : priority })
                  }
                  className={`
                    px-3 py-1.5 text-sm rounded-lg border-2 transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                  aria-pressed={isActive}
                >
                  <PriorityBadge priority={priority} size="sm" showLabel />
                </button>
              );
            })}
          </div>
        </div>

        {/* 状态 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            状态
          </label>
          <div className="flex flex-wrap gap-2">
            {(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((status) => {
              const isActive = filter.status === status;
              const statusLabels: Record<TaskStatus, string> = {
                todo: '待办',
                in_progress: '进行中',
                review: '评审中',
                done: '已完成',
              };
              return (
                <button
                  key={status}
                  onClick={() =>
                    onFilterChange({ status: isActive ? undefined : status })
                  }
                  className={`
                    px-3 py-1.5 text-sm rounded-lg border-2 transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                  aria-pressed={isActive}
                >
                  {statusLabels[status]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 标签 */}
        {availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标签
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isActive = filter.tags?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      const currentTags = filter.tags || [];
                      const newTags = isActive
                        ? currentTags.filter((id) => id !== tag.id)
                        : [...currentTags, tag.id];
                      onFilterChange({ tags: newTags.length > 0 ? newTags : undefined });
                    }}
                    className={`
                      px-3 py-1.5 text-sm rounded-lg border-2 transition-all
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 负责人 */}
        {assignees.length > 0 && (
          <div>
            <label
              htmlFor="filter-assignee"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              负责人
            </label>
            <select
              id="filter-assignee"
              value={filter.assignee || ''}
              onChange={(e) =>
                onFilterChange({ assignee: e.target.value || undefined })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">全部</option>
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
