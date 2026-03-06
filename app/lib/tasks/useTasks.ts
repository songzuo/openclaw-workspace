import { useState, useCallback, useMemo, useEffect } from 'react';
import { Task, TaskFilter, TaskPriority, TaskStatus, TaskTag, DEFAULT_TAGS } from './types';
import { filterTasks, sortTasks, getTaskStats } from './utils';

// 本地存储键
const TASKS_STORAGE_KEY = '7zi_tasks';
const CUSTOM_TAGS_KEY = '7zi_custom_tags';

/**
 * 任务管理 Hook
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customTags, setCustomTags] = useState<TaskTag[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'createdAt'>('priority');
  const [isLoading, setIsLoading] = useState(true);

  // 所有可用标签
  const allTags = useMemo(() => [...DEFAULT_TAGS, ...customTags], [customTags]);

  // 从本地存储加载数据
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      const storedTags = localStorage.getItem(CUSTOM_TAGS_KEY);

      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        // 转换日期字符串为 Date 对象
        const tasksWithDates = parsed.map((t: any) => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        }));
        setTasks(tasksWithDates);
      }

      if (storedTags) {
        setCustomTags(JSON.parse(storedTags));
      }
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CUSTOM_TAGS_KEY, JSON.stringify(customTags));
    }
  }, [customTags, isLoading]);

  // 过滤和排序后的任务
  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filter);
    return sortTasks(filtered, sortBy);
  }, [tasks, filter, sortBy]);

  // 统计信息
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  // 添加任务
  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    },
    []
  );

  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date(),
              completedAt: updates.status === 'done' ? new Date() : task.completedAt,
            }
          : task
      )
    );
  }, []);

  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  // 批量更新任务状态
  const batchUpdateStatus = useCallback((taskIds: string[], status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        taskIds.includes(task.id)
          ? {
              ...task,
              status,
              updatedAt: new Date(),
              completedAt: status === 'done' ? new Date() : task.completedAt,
            }
          : task
      )
    );
  }, []);

  // 添加自定义标签
  const addCustomTag = useCallback((tag: Omit<TaskTag, 'id'>) => {
    const newTag: TaskTag = {
      ...tag,
      id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setCustomTags((prev) => [...prev, newTag]);
    return newTag;
  }, []);

  // 删除自定义标签
  const deleteCustomTag = useCallback((tagId: string) => {
    setCustomTags((prev) => prev.filter((tag) => tag.id !== tagId));
    // 同时从所有任务中移除该标签
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag.id !== tagId),
      }))
    );
  }, []);

  // 更新过滤器
  const updateFilter = useCallback((newFilter: Partial<TaskFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  // 重置过滤器
  const resetFilter = useCallback(() => {
    setFilter({});
  }, []);

  // 根据ID获取任务
  const getTaskById = useCallback(
    (taskId: string) => {
      return tasks.find((task) => task.id === taskId);
    },
    [tasks]
  );

  // 根据标签获取任务
  const getTasksByTag = useCallback(
    (tagId: string) => {
      return tasks.filter((task) => task.tags.some((tag) => tag.id === tagId));
    },
    [tasks]
  );

  // 根据负责人获取任务
  const getTasksByAssignee = useCallback(
    (assigneeId: string) => {
      return tasks.filter((task) => task.assignee === assigneeId);
    },
    [tasks]
  );

  return {
    // 状态
    tasks: filteredTasks,
    allTasks: tasks,
    customTags,
    allTags,
    filter,
    sortBy,
    isLoading,
    stats,

    // 操作
    addTask,
    updateTask,
    deleteTask,
    batchUpdateStatus,
    addCustomTag,
    deleteCustomTag,
    updateFilter,
    resetFilter,
    setSortBy,

    // 查询
    getTaskById,
    getTasksByTag,
    getTasksByAssignee,
  };
}
