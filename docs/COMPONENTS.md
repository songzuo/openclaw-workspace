# 组件参考文档

**最后更新**: 2026-03-06  
**版本**: v1.0.0

---

## 目录

1. [核心组件](#核心组件)
2. [消息组件](#消息组件)
3. [通知组件](#通知组件)
4. [UI 组件](#ui-组件)
5. [类型定义](#类型定义)

---

## 核心组件

### ActivityLog

实时活动日志组件，显示 GitHub 提交、任务和评论活动。

**文件位置**: `app/components/ActivityLog.tsx`

```tsx
import { ActivityLog } from '@/components/ActivityLog';
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `activities` | `ActivityItem[]` | 是 | - | 活动列表数据 |

#### ActivityItem 类型

```typescript
interface ActivityItem {
  id: string;
  type: 'commit' | 'issue' | 'comment';
  title: string;
  author: string;
  avatar?: string;
  timestamp: string;
  url: string;
}
```

#### 使用示例

```tsx
const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'commit',
    title: '添加用户认证功能',
    author: 'ai-agent',
    avatar: 'https://avatars.githubusercontent.com/u/123?v=4',
    timestamp: '2026-03-06T08:00:00Z',
    url: 'https://github.com/songzuo/7zi/commit/abc123'
  }
];

<ActivityLog activities={activities} />
```

#### 特性

- ✅ 支持深色模式
- ✅ 无障碍支持 (ARIA 标签)
- ✅ 键盘导航 (Enter/Space 打开链接)
- ✅ 自动刷新提示 (30 秒间隔)
- ✅ 空状态展示

---

### MemberPresenceBoard

团队成员在线状态看板。

**文件位置**: `app/components/MemberPresenceBoard.tsx`

```tsx
import { MemberPresenceBoard, MemberPresenceCard, PresenceIndicator, PresenceStats } from '@/components/MemberPresenceBoard';
```

#### Props

##### MemberPresenceBoard

无 props，组件内部自动加载成员状态数据。

##### MemberPresenceCard

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `presence` | `MemberPresence` | 是 | - | 成员状态数据 |
| `memberName` | `string` | 是 | - | 成员名称 |
| `memberEmoji` | `string` | 是 | - | 成员 emoji 标识 |
| `memberAvatar` | `string` | 是 | - | 成员头像 URL |

##### PresenceIndicator

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `presence` | `MemberPresence` | 是 | - | 成员状态数据 |

##### PresenceStats

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `stats` | `ReturnType<typeof getPresenceStats>` | 是 | - | 统计数据 |

#### 类型定义

```typescript
type MemberStatus = 'online' | 'offline' | 'away' | 'busy';

interface MemberPresence {
  memberId: string;
  status: MemberStatus;
  lastSeen: string;
  currentTask?: string;
  location?: 'workspace' | 'meeting' | 'break' | 'offline';
}
```

#### 使用示例

```tsx
// 完整看板
<MemberPresenceBoard />

// 单个成员卡片
<MemberPresenceCard
  presence={presenceData}
  memberName="架构师"
  memberEmoji="🏗️"
  memberAvatar="https://api.dicebear.com/7.x/bottts/svg?seed=architect"
/>

// 状态指示器
<PresenceIndicator presence={presenceData} />

// 统计信息
<PresenceStats stats={statsData} />
```

#### 特性

- ✅ 状态筛选 (全部/在线/忙碌/离开/离线)
- ✅ 自动排序 (在线优先)
- ✅ 10 秒自动刷新
- ✅ 深色模式支持

---

### Navigation

主导航组件，支持桌面端和移动端。

**文件位置**: `app/components/Navigation.tsx`

```tsx
import { Navigation } from '@/components/Navigation';
```

#### Props

无 props，组件内部使用 Next.js 路由。

#### 导航项配置

```typescript
interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/dashboard', label: '实时看板', icon: '📊' },
  { href: '/subagents', label: '子代理', icon: '🤖' },
  { href: '/tasks', label: '任务', icon: '📋' },
  { href: '/memory', label: '记忆', icon: '🧠' },
];
```

#### 使用示例

```tsx
// 在布局中使用
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

#### 特性

- ✅ 响应式设计 (桌面端/移动端)
- ✅ 主题切换按钮
- ✅ 键盘导航 (方向键、Home、End)
- ✅ ESC 关闭移动端菜单
- ✅ 当前页面高亮
- ✅ 无障碍支持 (ARIA 属性)

---

### TaskBoard

GitHub 任务看板组件。

**文件位置**: `app/components/TaskBoard.tsx`

```tsx
import { TaskBoard, TaskCard } from '@/components/TaskBoard';
```

#### Props

##### TaskBoard

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `issues` | `GitHubIssue[]` | 是 | - | GitHub Issues 列表 |

##### TaskCard

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `issue` | `GitHubIssue` | 是 | - | 单个 Issue 数据 |

#### GitHubIssue 类型

```typescript
interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url: string;
  };
  assignee: {
    login: string;
    avatar_url: string;
  } | null;
  labels: Array<{
    name: string;
    color: string;
  }>;
  updated_at: string;
  html_url: string;
}
```

#### 使用示例

```tsx
const issues: GitHubIssue[] = [
  {
    id: 1,
    number: 1,
    title: '修复登录页面样式问题',
    state: 'open',
    user: { login: 'songzuo', avatar_url: '...' },
    assignee: { login: 'ai-agent', avatar_url: '...' },
    labels: [{ name: 'bug', color: 'd73a4a' }],
    updated_at: '2026-03-06T08:00:00Z',
    html_url: 'https://github.com/songzuo/7zi/issues/1'
  }
];

<TaskBoard issues={issues} />
```

#### 特性

- ✅ 状态筛选 (进行中/已完成/全部)
- ✅ 进度条显示
- ✅ 标签展示 (最多 5 个)
- ✅ 指派人头像
- ✅ 时间格式化
- ✅ useMemo 性能优化

---

## 消息组件

### MessageCenter

消息中心主组件，包含对话列表和消息区域。

**文件位置**: `app/components/messages/MessageCenter.tsx`

```tsx
import { MessageCenter } from '@/components/messages/MessageCenter';
```

#### Props

无 props，组件内部使用 `useMessages` hook。

#### 使用示例

```tsx
<MessageCenter />
```

#### 功能

- 对话列表
- 消息发送
- 右键菜单 (置顶/静音/删除)
- 搜索过滤
- 未读计数

---

### ConversationItem

对话列表项组件。

**文件位置**: `app/components/messages/ConversationItem.tsx`

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `conversation` | `Conversation` | 是 | 对话数据 |
| `isActive` | `boolean` | 是 | 是否选中 |
| `onClick` | `() => void` | 是 | 点击回调 |
| `onContextMenu` | `(e: React.MouseEvent) => void` | 否 | 右键菜单回调 |

---

### MessageItem

消息项组件。

**文件位置**: `app/components/messages/MessageItem.tsx`

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `message` | `Message` | 是 | 消息数据 |
| `isOwn` | `boolean` | 是 | 是否为自己发送 |

---

### MessageInput

消息输入框组件。

**文件位置**: `app/components/messages/MessageInput.tsx`

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `onSend` | `(text: string) => void` | 是 | 发送回调 |
| `placeholder` | `string` | 否 | 输入提示 |
| `disabled` | `boolean` | 否 | 禁用状态 |

---

## 通知组件

### NotificationPanel

通知面板组件。

**文件位置**: `app/components/notifications/NotificationPanel.tsx`

```tsx
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `isOpen` | `boolean` | 是 | - | 面板是否打开 |
| `onClose` | `() => void` | 是 | - | 关闭回调 |

#### 使用示例

```tsx
const [isOpen, setIsOpen] = useState(false);

<NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

#### 功能

- 类型筛选 (info/success/warning/error/task/system)
- 搜索过滤
- 全部已读
- 清空通知
- ESC/点击外部关闭

---

### NotificationBell

通知铃铛图标组件。

**文件位置**: `app/components/notifications/NotificationBell.tsx`

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `count` | `number` | 是 | 未读数量 |
| `onClick` | `() => void` | 是 | 点击回调 |

---

### NotificationItem

通知项组件。

**文件位置**: `app/components/notifications/NotificationItem.tsx`

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `notification` | `Notification` | 是 | 通知数据 |
| `onMarkAsRead` | `(id: string) => void` | 是 | 标记已读回调 |
| `onDismiss` | `(id: string) => void` | 是 | 删除回调 |

---

## 通知类型定义

**文件位置**: `app/components/notifications/types.ts`

```typescript
export type NotificationType = 
  | 'info'      // 普通信息
  | 'success'   // 成功
  | 'warning'   // 警告
  | 'error'     // 错误
  | 'task'      // 任务相关
  | 'system';   // 系统通知

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string | number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  source?: string;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}
```

---

## UI 组件

### ProgressBar

进度条组件。

**文件位置**: `app/components/ProgressBar.tsx`

```tsx
import { ProgressBar } from '@/components/ProgressBar';
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `number` | 是 | - | 进度值 (0-100) |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 尺寸 |
| `color` | `'blue' \| 'green' \| 'yellow' \| 'red'` | 否 | `'blue'` | 颜色 |
| `showPercentage` | `boolean` | 否 | `false` | 显示百分比 |
| `animated` | `boolean` | 否 | `false` | 动画效果 |

---

### Loading / LoadingSpinner

加载状态组件。

**文件位置**: `app/components/Loading.tsx`, `app/components/LoadingSpinner.tsx`

```tsx
import { Loading } from '@/components/Loading';
import { LoadingSpinner } from '@/components/LoadingSpinner';
```

#### Loading Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `text` | `string` | 否 | `'加载中...'` | 加载文本 |

---

### Skeleton

骨架屏组件。

**文件位置**: `app/components/Skeleton.tsx`

```tsx
import { Skeleton } from '@/components/Skeleton';
```

---

### ErrorBoundary

错误边界组件。

**文件位置**: `app/components/ErrorBoundary.tsx`

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';
```

---

### ThemeProvider

主题提供者组件。

**文件位置**: `app/components/ThemeProvider.tsx`

```tsx
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
```

#### useTheme Hook

```tsx
const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
```

---

### ContributionChart

贡献图表组件。

**文件位置**: `app/components/ContributionChart.tsx`

---

### OptimizedImage

优化图片组件。

**文件位置**: `app/components/OptimizedImage.tsx`

---

### TaskComments

任务评论组件，用于显示和管理 GitHub Issue 评论。

**文件位置**: `app/components/TaskComments.tsx`

```tsx
import { TaskComments } from '@/components/TaskComments';
```

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `issueNumber` | `number` | 是 | GitHub Issue 编号 |
| `owner` | `string` | 是 | 仓库所有者用户名 |
| `repo` | `string` | 是 | 仓库名称 |
| `token` | `string` | 否 | GitHub Token (私有仓库或写操作必需) |

#### 类型定义

```typescript
interface TaskCommentsProps {
  issueNumber: number;
  owner: string;
  repo: string;
  token?: string;
}

interface GitHubComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}
```

#### 使用示例

```tsx
// 基础用法
<TaskComments
  issueNumber={1}
  owner="songzuo"
  repo="7zi"
/>

// 带 Token (支持评论功能)
<TaskComments
  issueNumber={1}
  owner="songzuo"
  repo="7zi"
  token={process.env.GITHUB_TOKEN}
/>
```

#### 功能

- ✅ 加载 Issue 评论列表
- ✅ 添加新评论 (需要 Token)
- ✅ 删除评论 (需要 Token)
- ✅ 错误处理和加载状态
- ✅ 深色模式支持

---

### MemberCard

成员卡片组件。

**文件位置**: `app/components/MemberCard.tsx`

---

## 通用类型

### ActivityItem

```typescript
interface ActivityItem {
  id: string;
  type: 'commit' | 'issue' | 'comment';
  title: string;
  author: string;
  avatar?: string;
  timestamp: string;
  url: string;
}
```

### MemberPresence

```typescript
type MemberStatus = 'online' | 'offline' | 'away' | 'busy';

interface MemberPresence {
  memberId: string;
  status: MemberStatus;
  lastSeen: string;
  currentTask?: string;
  location?: 'workspace' | 'meeting' | 'break' | 'offline';
}
```

---

## 相关链接

- [API 参考文档](./API-REFERENCE.md)
- [开发指南](./DEVELOPMENT.md)
- [架构设计](./ARCHITECTURE.md)

---

*文档由 7zi Studio AI 团队维护 🤖*
