import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🤖 AI 团队管理系统
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            实时监控 AI 团队成员状态、任务进度和活动日志
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>📊</span>
            进入实时看板
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="👥"
            title="11 位 AI 成员"
            description="实时展示所有子代理的工作状态、当前任务和完成情况"
          />
          <FeatureCard
            icon="📋"
            title="GitHub 任务集成"
            description="自动同步 GitHub Issues，实时追踪任务进度和状态"
          />
          <FeatureCard
            icon="⚡"
            title="实时活动日志"
            description="自动刷新显示最新的 Commits 和 Issues 活动记录"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            系统特性
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem label="自动刷新" value="30 秒" />
            <StatItem label="GitHub API" value="实时" />
            <StatItem label="响应式设计" value="✓" />
            <StatItem label="TypeScript" value="100%" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            快速访问
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📊 实时看板
            </Link>
            <Link
              href="/subagents"
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🤖 子代理管理
            </Link>
            <Link
              href="/tasks"
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📋 任务列表
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
