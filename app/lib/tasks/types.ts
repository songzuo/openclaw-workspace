// 任务优先级和标签系统类型定义

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskTag {
  id: string;
  name: string;
  color: string; // Tailwind color class, e.g., 'blue', 'red', 'green'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: TaskTag[];
  assignee?: string; // 子代理 ID
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskFilter {
  priority?: TaskPriority;
  status?: TaskStatus;
  tags?: string[]; // Tag IDs
  assignee?: string;
  search?: string;
}

// 预定义标签
export const DEFAULT_TAGS: TaskTag[] = [
  { id: 'bug', name: 'Bug', color: 'red' },
  { id: 'feature', name: 'Feature', color: 'blue' },
  { id: 'enhancement', name: 'Enhancement', color: 'purple' },
  { id: 'documentation', name: 'Docs', color: 'green' },
  { id: 'urgent', name: 'Urgent', color: 'orange' },
  { id: 'ai-agent', name: 'AI Agent', color: 'pink' },
];

// 优先级配置
export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  high: { label: '高优先级', color: 'red', icon: '🔴' },
  medium: { label: '中优先级', color: 'yellow', icon: '🟡' },
  low: { label: '低优先级', color: 'green', icon: '🟢' },
};

// 状态配置
export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: '待办', color: 'gray' },
  in_progress: { label: '进行中', color: 'blue' },
  review: { label: '评审中', color: 'purple' },
  done: { label: '已完成', color: 'green' },
};
