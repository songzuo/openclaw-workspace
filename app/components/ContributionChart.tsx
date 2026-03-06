'use client';

import { useMemo } from 'react';
import type { TeamMember } from './Dashboard';

interface ContributionChartProps {
  members: TeamMember[];
}

export default function ContributionChart({ members }: ContributionChartProps) {
  const chartData = useMemo(() => {
    const maxScore = Math.max(...members.map((m) => m.contributionScore));
    return members.map((member) => ({
      ...member,
      percentage: (member.contributionScore / maxScore) * 100,
    }));
  }, [members]);

  const sortedData = useMemo(
    () => [...chartData].sort((a, b) => b.contributionScore - a.contributionScore),
    [chartData]
  );

  const totalContributions = useMemo(
    () => members.reduce((sum, m) => sum + m.contributionScore, 0),
    [members]
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalContributions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">总贡献点</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {members.filter((m) => m.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">活跃成员</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(totalContributions / members.length)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">平均贡献</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {members.reduce((sum, m) => sum + m.completedTasks, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">完成任务</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          贡献度排行
        </h3>
        <div className="space-y-3">
          {sortedData.map((member, index) => (
            <div key={member.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({member.role})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    {member.completedTasks} 任务
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {member.contributionScore} 分
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${member.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={member.contributionScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${member.name} 贡献度`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart (CSS-based) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            状态分布
          </h3>
          <StatusPieChart members={members} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            任务完成率
          </h3>
          <TaskCompletionChart members={members} />
        </div>
      </div>
    </div>
  );
}

function StatusPieChart({ members }: { members: TeamMember[] }) {
  const statusCounts = useMemo(() => {
    const counts = { active: 0, idle: 0, offline: 0 };
    members.forEach((m) => counts[m.status]++);
    return counts;
  }, [members]);

  const total = members.length;
  const activePercent = (statusCounts.active / total) * 100;
  const idlePercent = (statusCounts.idle / total) * 100;

  // Create conic gradient for pie chart
  const gradient = `conic-gradient(
    #10b981 0% ${activePercent}%,
    #f59e0b ${activePercent}% ${activePercent + idlePercent}%,
    #6b7280 ${activePercent + idlePercent}% 100%
  )`;

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-32 h-32 rounded-full shadow-lg"
        style={{ background: gradient }}
        role="img"
        aria-label="成员状态分布图"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            活跃: {statusCounts.active} ({activePercent.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            空闲: {statusCounts.idle} ({idlePercent.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            离线: {statusCounts.offline} ({(100 - activePercent - idlePercent).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

function TaskCompletionChart({ members }: { members: TeamMember[] }) {
  const topPerformers = useMemo(() => {
    return [...members]
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5);
  }, [members]);

  const maxTasks = topPerformers[0]?.completedTasks || 1;

  return (
    <div className="space-y-3">
      {topPerformers.map((member, index) => {
        const percentage = (member.completedTasks / maxTasks) * 100;
        const colors = [
          'from-yellow-400 to-orange-500',
          'from-gray-300 to-gray-400',
          'from-orange-400 to-red-500',
          'from-blue-400 to-blue-600',
          'from-purple-400 to-purple-600',
        ];

        return (
          <div key={member.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900 dark:text-white truncate">
                {member.name}
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {member.completedTasks}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
