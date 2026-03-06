'use client';

import React from 'react';
import { AIMember } from '../dashboard/page';

interface ContributionChartProps {
  members: AIMember[];
  title?: string;
}

interface ContributionData {
  memberId: string;
  name: string;
  emoji: string;
  commits: number;
  tasks: number;
  total: number;
  percentage: number;
}

export const ContributionChart: React.FC<ContributionChartProps> = ({ 
  members,
  title = '贡献统计'
}) => {
  // 计算贡献数据
  const contributionData: ContributionData[] = members.map(member => ({
    memberId: member.id,
    name: member.name,
    emoji: member.emoji,
    commits: Math.floor(Math.random() * 20) + 1, // 模拟提交数据
    tasks: member.completedTasks,
    total: member.completedTasks + Math.floor(Math.random() * 20) + 1,
    percentage: 0, // 待计算
  }));

  // 计算总数和百分比
  const totalContributions = contributionData.reduce((sum, d) => sum + d.total, 0);
  contributionData.forEach(d => {
    d.percentage = totalContributions > 0 ? Math.round((d.total / totalContributions) * 100) : 0;
  });

  // 按贡献排序
  contributionData.sort((a, b) => b.total - a.total);

  const maxContribution = Math.max(...contributionData.map(d => d.total));

  // 颜色映射
  const getBarColor = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
      'bg-rose-500',
      'bg-violet-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <section 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      aria-labelledby="contribution-chart-title"
    >
      <h2 
        id="contribution-chart-title"
        className="text-lg font-semibold text-gray-900 mb-6"
      >
        {title}
      </h2>

      {/* 总贡献数 */}
      <div className="mb-6 text-center">
        <p className="text-3xl font-bold text-gray-900">{totalContributions}</p>
        <p className="text-sm text-gray-500">总贡献</p>
      </div>

      {/* 条形图 */}
      <div className="space-y-4" role="list" aria-label="成员贡献列表">
        {contributionData.map((data, index) => (
          <div 
            key={data.memberId} 
            className="flex items-center gap-3"
            role="listitem"
          >
            <div className="w-8 flex-shrink-0 text-center" aria-hidden="true">
              <span className="text-lg">{data.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {data.name}
                </span>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {data.total} ({data.percentage}%)
                </span>
              </div>
              <div 
                className="h-3 bg-gray-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={data.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${data.name} 贡献进度`}
              >
                <div
                  className={`h-full ${getBarColor(index)} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${(data.total / maxContribution) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span>提交: {data.commits}</span>
                <span>任务: {data.tasks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-300" aria-hidden="true" />
            <span>提交 (Commits)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-500" aria-hidden="true" />
            <span>任务 (Tasks)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// 导出类型供外部使用
export type { ContributionChartProps, ContributionData };
