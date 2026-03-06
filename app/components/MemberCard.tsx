'use client';

import React from 'react';
import { AIMember } from '../dashboard/page';

interface MemberCardProps {
  member: AIMember;
  compact?: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, compact = false }) => {
  const statusColors = {
    working: 'bg-green-500',
    busy: 'bg-yellow-500',
    idle: 'bg-gray-400',
    offline: 'bg-gray-300',
  };

  const statusBgColors = {
    working: 'bg-green-100 text-green-700',
    busy: 'bg-yellow-100 text-yellow-700',
    idle: 'bg-gray-100 text-gray-600',
    offline: 'bg-gray-100 text-gray-400',
  };

  const statusLabels = {
    working: '工作中',
    busy: '忙碌',
    idle: '空闲',
    offline: '离线',
  };

  if (compact) {
    return (
      <article 
        className="px-4 py-3 hover:bg-gray-50 transition-colors focus-within:bg-gray-50"
        aria-labelledby={`member-${member.id}-name`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={member.avatar}
              alt=""
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${member.id}`;
              }}
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
              aria-hidden="true"
            />
            <span className="sr-only">{member.name}，状态：{statusLabels[member.status]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span id={`member-${member.id}-name`} className="text-sm font-medium text-gray-900">
                {member.emoji} {member.name}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBgColors[member.status]}`}
                aria-label={`状态：${statusLabels[member.status]}`}
              >
                {statusLabels[member.status]}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{member.role}</span>
              <span className="text-xs text-gray-400" aria-hidden="true">·</span>
              <span className="text-xs text-gray-500">{member.provider}</span>
            </div>
            {member.currentTask && (
              <p className="text-xs text-blue-600 mt-1 truncate" aria-label={`当前任务：${member.currentTask}`}>📌 {member.currentTask}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0" aria-label={`已完成 ${member.completedTasks} 个任务`}>
            <p className="text-sm font-medium text-gray-700">{member.completedTasks}</p>
            <p className="text-xs text-gray-500">完成任务</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className="p-4 border rounded-lg hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      aria-labelledby={`member-${member.id}-title`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={member.avatar}
            alt=""
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://api.dicebear.com/7.x/bottts/svg?seed=${member.id}`;
            }}
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
            aria-hidden="true"
          />
          <span className="sr-only">{member.name}，状态：{statusLabels[member.status]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 id={`member-${member.id}-title`} className="text-base font-semibold text-gray-900">
              {member.emoji} {member.name}
            </h4>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBgColors[member.status]}`}
              aria-label={`状态：${statusLabels[member.status]}`}
            >
              {statusLabels[member.status]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2" aria-label={`角色：${member.role}`}>{member.role}</p>
          <p className="text-xs text-gray-500 mb-2">提供商：{member.provider}</p>
          {member.currentTask && (
            <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mb-2" aria-label={`当前任务：${member.currentTask}`}>
              📌 {member.currentTask}
            </div>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-700" aria-label={`已完成 ${member.completedTasks} 个任务`}>
              <strong className="text-gray-900">{member.completedTasks}</strong> 完成任务
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
