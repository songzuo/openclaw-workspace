'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, TaskTag } from '@/lib/tasks/types';
import { PrioritySelector } from './PriorityBadge';
import { TagSelector } from './TagBadge';
import { validateTask } from '@/lib/tasks/utils';
import { DEFAULT_TAGS } from '@/lib/tasks/types';

interface TaskFormProps {
  task?: Task; // 编辑时传入现有任务
  availableTags?: TaskTag[];
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  assignees?: string[]; // 可选的负责人列表
  className?: string;
}

/**
 * 任务创建/编辑表单组件
 */
export function TaskForm({
  task,
  availableTags = DEFAULT_TAGS,
  onSubmit,
  onCancel,
  assignees = [],
  className = '',
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [tags, setTags] = useState<TaskTag[]>(task?.tags || []);
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [errors, setErrors] = useState<string[]>([]);

  // 重置表单
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setTags(task.tags);
      setAssignee(task.assignee || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title,
      description: description || undefined,
      priority,
      status,
      tags,
      assignee: assignee || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    // 验证
    const validationErrors = validateTask(taskData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSubmit(taskData);
  };

  const handleReset = () => {
    if (task) {
      // 重置为原始值
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setTags(task.tags);
      setAssignee(task.assignee || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    } else {
      // 清空表单
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setTags([]);
      setAssignee('');
      setDueDate('');
    }
    setErrors([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {task ? '编辑任务' : '创建新任务'}
      </h2>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 任务标题 */}
      <div className="mb-4">
        <label
          htmlFor="task-title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          任务标题 <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入任务标题..."
          maxLength={200}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {title.length}/200 字符
        </p>
      </div>

      {/* 任务描述 */}
      <div className="mb-4">
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          任务描述
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="详细描述任务内容..."
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500 resize-none"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description.length}/2000 字符
        </p>
      </div>

      {/* 优先级选择 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          优先级
        </label>
        <PrioritySelector value={priority} onChange={setPriority} />
      </div>

      {/* 状态选择 */}
      <div className="mb-4">
        <label
          htmlFor="task-status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          状态
        </label>
        <select
          id="task-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="todo">待办</option>
          <option value="in_progress">进行中</option>
          <option value="review">评审中</option>
          <option value="done">已完成</option>
        </select>
      </div>

      {/* 标签选择 */}
      <div className="mb-4">
        <TagSelector
          selectedTags={tags}
          availableTags={availableTags}
          onChange={setTags}
          maxTags={5}
        />
      </div>

      {/* 负责人选择 */}
      {assignees.length > 0 && (
        <div className="mb-4">
          <label
            htmlFor="task-assignee"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            负责人
          </label>
          <select
            id="task-assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">未分配</option>
            {assignees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 截止日期 */}
      <div className="mb-6">
        <label
          htmlFor="task-due-date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          截止日期
        </label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
              bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg
              hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2
              focus:ring-blue-500 transition-colors"
          >
            取消
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg
            hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2
            focus:ring-blue-500 transition-colors"
        >
          重置
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:ring-offset-2 transition-colors"
        >
          {task ? '保存更改' : '创建任务'}
        </button>
      </div>
    </form>
  );
}
