# API 参考文档

**最后更新**: 2026-03-06  
**版本**: v1.0.0

---

## 目录

1. [概述](#概述)
2. [GitHub API](#github-api)
3. [Web API](#web-api)
4. [数据类型](#数据类型)
5. [使用示例](#使用示例)
6. [错误处理](#错误处理)

---

## 概述

7zi Studio 项目提供以下 API 集成：

- **GitHub API** - 同步 Issues 和 Commits
- **Web API** - 内部看板数据接口

---

## GitHub API

项目使用 GitHub REST API v3 获取团队数据。

### 基础配置

```typescript
const headers = {
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  Authorization: `token ${GITHUB_TOKEN}`
};
```

### 获取 Issues

```http
GET https://api.github.com/repos/{owner}/{repo}/issues?state=all&per_page=50
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| owner | string | 是 | 仓库所有者用户名 |
| repo | string | 是 | 仓库名称 |
| state | string | 否 | `open`, `closed`, `all` (默认 all) |
| per_page | number | 否 | 每页数量 (最大 100) |

**请求示例**:

```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/repos/songzuo/7zi/issues?state=all&per_page=50"
```

**响应示例**:

```json
[
  {
    "id": 123456789,
    "number": 1,
    "title": "修复登录页面样式问题",
    "state": "open",
    "user": {
      "login": "songzuo",
      "avatar_url": "https://avatars.githubusercontent.com/u/1234567?v=4"
    },
    "assignee": {
      "login": "ai-agent",
      "avatar_url": "https://avatars.githubusercontent.com/u/9876543?v=4"
    },
    "updated_at": "2026-03-06T08:00:00Z",
    "html_url": "https://github.com/songzuo/7zi/issues/1"
  }
]
```

---

### 获取 Commits

```http
GET https://api.github.com/repos/{owner}/{repo}/commits?per_page=30
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| owner | string | 是 | 仓库所有者用户名 |
| repo | string | 是 | 仓库名称 |
| per_page | number | 否 | 每页数量 (最大 100) |

**请求示例**:

```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/repos/songzuo/7zi/commits?per_page=30"
```

**响应示例**:

```json
[
  {
    "sha": "abc123def456",
    "commit": {
      "message": "添加用户认证功能\n\n- 实现 JWT 登录\n- 添加注册接口",
      "author": {
        "name": "AI Agent",
        "date": "2026-03-06T07:30:00Z",
        "email": "agent@7zi.com"
      }
    },
    "author": {
      "login": "ai-agent",
      "avatar_url": "https://avatars.githubusercontent.com/u/9876543?v=4"
    },
    "html_url": "https://github.com/songzuo/7zi/commit/abc123def456"
  }
]
```

---

## Web API

### Dashboard 数据接口

项目使用 Next.js API 路由提供看板数据。

**端点**: `GET /api/dashboard`

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| owner | string | 是 | GitHub 仓库所有者 |
| repo | string | 是 | GitHub 仓库名称 |

**响应格式**:

```typescript
interface DashboardData {
  issues: GitHubIssue[];
  commits: GitHubCommit[];
  activities: ActivityItem[];
  lastUpdated: string;
}
```

---

## 数据类型

### GitHubIssue

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
  updated_at: string;
  html_url: string;
  pull_request?: object; // 如果存在则是 PR
}
```

### GitHubCommit

```typescript
interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
      email: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  html_url: string;
}
```

### ActivityItem

```typescript
interface ActivityItem {
  id: string;
  type: 'commit' | 'issue';
  title: string;
  author: string;
  avatar?: string;
  timestamp: string;
  url: string;
}
```

---

## 使用示例

### React Hook 使用

```tsx
import { useDashboardData } from './hooks/useDashboardData';

function Dashboard() {
  const { issues, commits, activities, isLoading, error, refreshData } = 
    useDashboardData('songzuo', '7zi', process.env.GITHUB_TOKEN);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <button onClick={refreshData}>刷新数据</button>
      <div>Issues: {issues.length}</div>
      <div>Commits: {commits.length}</div>
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 原生 Fetch 使用

```javascript
async function fetchDashboardData(owner, repo, token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    ...(token && { Authorization: `token ${token}` })
  };

  const [issuesRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=50`, 
      { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`, 
      { headers })
  ]);

  const issues = await issuesRes.json();
  const commits = await commitsRes.json();

  return { issues, commits };
}
```

### 使用 GitHub CLI

```bash
# 获取 Issues
gh issue list --repo songzuo/7zi --state all --limit 50

# 获取 Commits
gh repo view songzuo/7zi --json defaultBranchRef
```

---

## 错误处理

### 常见错误码

| 状态码 | 说明 | 解决方案 |
|--------|------|----------|
| 401 | GitHub Token 无效 | 检查并更新 GITHUB_TOKEN |
| 403 | API 速率限制 | 等待后重试或使用 Token |
| 404 | 仓库不存在 | 检查 owner 和 repo 参数 |

### 错误响应示例

```json
{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest"
}
```

---

## 速率限制

GitHub API 速率限制：

- **未认证**: 60 次/小时
- **认证用户**: 5000 次/小时

查看剩余配额：

```bash
curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/rate_limit
```

---

## 相关链接

- [GitHub REST API 文档](https://docs.github.com/rest)
- [GitHub GraphQL API](https://docs.github.com/graphql)
- [Next.js 文档](https://nextjs.org/docs)
- [项目 GitHub](https://github.com/songzuo/7zi)

---

*文档由 7zi Studio AI 团队维护 🤖*
