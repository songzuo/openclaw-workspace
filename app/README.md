# AI 团队实时看板

[![TypeDoc](https://img.shields.io/badge/TypeDoc-API%20Docs-blue)](./docs/api/)
[![Storybook](https://img.shields.io/badge/Storybook-Components-ff4785)](./docs/storybook/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

## 📚 文档资源

- **[📖 API 文档](./docs/api/)** - TypeScript API 参考文档
- **[🎨 组件库](./docs/storybook/)** - Storybook 组件展示
- **[📝 完整文档](./DOCUMENTATION.md)** - 详细使用指南
- **[🤝 贡献指南](./CONTRIBUTING.md)** - 如何参与开发

## 📁 目录结构

```
app/
├── dashboard/
│   └── page.tsx          # 主看板页面
├── components/
│   ├── MemberCard.tsx    # 成员卡片组件
│   ├── TaskBoard.tsx     # 任务看板组件
│   ├── ActivityLog.tsx   # 活动日志组件
│   └── LoadingSpinner.tsx # 加载动画组件
├── hooks/
│   └── useDashboardData.ts # GitHub API 数据 Hook
└── .env.example          # 环境变量示例
```

## 🚀 快速开始

### 0. 生成文档（可选）

```bash
# 生成所有文档（API 文档 + Storybook）
npm run docs:build

# 或分别生成
npm run docs:api        # 生成 TypeDoc API 文档
npm run storybook       # 启动 Storybook 开发服务器

# 本地预览文档
open docs/index.html
```

### 1. 配置环境变量

```bash
cp app/.env.example app/.env.local
```

编辑 `.env.local`，填入你的 GitHub 仓库信息：

```bash
NEXT_PUBLIC_GITHUB_OWNER=你的 GitHub 用户名
NEXT_PUBLIC_GITHUB_REPO=你的仓库名
NEXT_PUBLIC_GITHUB_TOKEN=你的 GitHub Token (可选)
```

### 2. 获取 GitHub Token (可选但推荐)

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择权限：`repo`, `read:user`
4. 生成并复制 Token
5. 填入 `.env.local`

### 3. 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问看板
http://localhost:3000/dashboard
```

## 📋 功能特性

### ✅ 11 位 AI 成员状态展示
- 🌟 智能体世界专家
- 📚 咨询师
- 🏗️ 架构师
- ⚡ Executor
- 🛡️ 系统管理员
- 🧪 测试员
- 🎨 设计师
- 📣 推广专员
- 💼 销售客服
- 💰 财务
- 📺 媒体

### ✅ GitHub Issues 集成
- 实时显示团队任务
- 任务状态筛选 (进行中/已完成/全部)
- 任务进度条展示
- 标签分类

### ✅ 实时活动日志
- GitHub Commits 提交记录
- Issues 创建/更新活动
- 时间排序，最新优先
- 自动刷新 (30 秒)

### ✅ 统计面板
- 成员状态统计
- 任务进度统计
- 实时更新时间

## 🔌 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据**: GitHub REST API v3
- **状态**: React Hooks

## 📊 API 使用

### GitHub API 端点

- `GET /repos/{owner}/{repo}/issues` - 获取 Issues
- `GET /repos/{owner}/{repo}/commits` - 获取 Commits

### 速率限制

- 未认证：60 次/小时
- 已认证 (Token)：5000 次/小时

## 🎨 自定义

### 修改成员配置

编辑 `app/dashboard/page.tsx` 中的 `AI_MEMBERS` 数组：

```typescript
const AI_MEMBERS: AIMember[] = [
  {
    id: 'custom-id',
    name: '自定义名称',
    role: '角色描述',
    emoji: '🎯',
    avatar: '头像 URL',
    status: 'working', // 'idle' | 'working' | 'busy' | 'offline'
    provider: '提供商',
    currentTask: '#123 任务描述',
    completedTasks: 100
  }
];
```

### 修改刷新间隔

在 `app/dashboard/page.tsx` 中修改：

```typescript
const REFRESH_INTERVAL = 30000; // 毫秒
```

### 修改样式

所有组件使用 Tailwind CSS，可直接修改 class 名称自定义样式。

## 🐛 故障排除

### 无法加载数据

1. 检查 GitHub 仓库名称是否正确
2. 检查网络连接
3. 查看浏览器控制台错误信息

### API 速率限制

如果遇到 403 错误：
1. 配置 `NEXT_PUBLIC_GITHUB_TOKEN`
2. 等待速率限制重置

### 图片加载失败

头像使用 DiceBear API 作为后备，如果加载失败会自动切换到默认头像。

## 📝 待办事项

- [ ] 添加 WebSocket 实时更新
- [ ] 添加成员任务分配功能
- [ ] 添加贡献统计图表
- [ ] 添加深色模式
- [ ] 添加移动端优化
- [ ] 添加导出功能

---

**版本**: 1.0.0  
**创建时间**: 2026-03-06  
**维护者**: AI 团队
