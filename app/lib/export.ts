/**
 * 导出工具 - 支持 PDF 和 CSV 格式导出数据
 */

import { jsPDF } from 'jspdf';
import type { AIMember, GitHubIssue, GitHubCommit, ActivityItem } from '../dashboard/page';

// ============================================================================
// CSV 导出函数
// ============================================================================

/**
 * 将数据转换为 CSV 字符串
 */
function arrayToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // 处理包含逗号或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

/**
 * 下载 CSV 文件
 */
export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  const csv = arrayToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 导出成员数据为 CSV
 */
export function exportMembersCSV(members: AIMember[]): void {
  const data = members.map(member => ({
    ID: member.id,
    名称: member.name,
    角色: member.role,
    Emoji: member.emoji,
    状态: member.status,
    提供商: member.provider,
    当前任务: member.currentTask || '',
    已完成任务: member.completedTasks,
  }));
  
  downloadCSV(data, 'ai-team-members');
}

/**
 * 导出 Issues 数据为 CSV
 */
export function exportIssuesCSV(issues: GitHubIssue[]): void {
  const data = issues.map(issue => ({
    编号: issue.number,
    标题: issue.title,
    状态: issue.state,
    标签: issue.labels.map(l => l.name).join(';'),
    负责人: issue.assignee?.login || '',
    创建时间: issue.created_at,
    更新时间: issue.updated_at,
    URL: issue.html_url,
  }));
  
  downloadCSV(data, 'github-issues');
}

/**
 * 导出 Commits 数据为 CSV
 */
export function exportCommitsCSV(commits: GitHubCommit[]): void {
  const data = commits.map(commit => ({
    SHA: commit.sha,
    提交信息: commit.commit.message,
    作者: commit.commit.author.name,
    日期: commit.commit.author.date,
    URL: commit.html_url,
  }));
  
  downloadCSV(data, 'github-commits');
}

/**
 * 导出活动日志为 CSV
 */
export function exportActivitiesCSV(activities: ActivityItem[]): void {
  const data = activities.map(activity => ({
    ID: activity.id,
    类型: activity.type,
    标题: activity.title,
    作者: activity.author,
    时间: activity.timestamp,
    URL: activity.url,
  }));
  
  downloadCSV(data, 'activity-log');
}

// ============================================================================
// PDF 导出函数
// ============================================================================

/**
 * 导出数据为 PDF
 */
export function exportToPDF(
  members: AIMember[],
  issues: GitHubIssue[],
  commits: GitHubCommit[],
  stats: {
    totalMembers: number;
    working: number;
    busy: number;
    idle: number;
    offline: number;
    openIssues: number;
    closedIssues: number;
  }
): void {
  const doc = new jsPDF();
  let yPos = 20;
  
  // 标题
  doc.setFontSize(20);
  doc.text('AI 团队看板报告', 105, yPos, { align: 'center' });
  yPos += 15;
  
  // 生成日期
  doc.setFontSize(10);
  doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, 105, yPos, { align: 'center' });
  yPos += 15;
  
  // 统计信息
  doc.setFontSize(14);
  doc.text('📊 团队统计', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  const statsText = [
    `总成员: ${stats.totalMembers}`,
    `工作中: ${stats.working}`,
    `忙碌: ${stats.busy}`,
    `空闲: ${stats.idle}`,
    `离线: ${stats.offline}`,
    `进行中任务: ${stats.openIssues}`,
    `已完成任务: ${stats.closedIssues}`,
  ];
  
  statsText.forEach(text => {
    doc.text(text, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // 成员列表
  doc.setFontSize(14);
  doc.text('👥 团队成员', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(9);
  members.forEach(member => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    const statusEmoji = member.status === 'working' ? '🔥' : 
                       member.status === 'busy' ? '⚡' : 
                       member.status === 'idle' ? '😊' : '⚫';
    
    const line = `${statusEmoji} ${member.name} (${member.role}) - ${member.provider} - 已完成 ${member.completedTasks} 任务`;
    doc.text(line, 25, yPos);
    yPos += 5;
    
    if (member.currentTask) {
      doc.text(`   当前: ${member.currentTask}`, 25, yPos);
      yPos += 5;
    }
  });
  
  yPos += 10;
  
  // Issues 列表
  if (issues.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text('📋 GitHub Issues', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(8);
    issues.slice(0, 20).forEach(issue => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const status = issue.state === 'open' ? '🔵' : '✅';
      const assignee = issue.assignee ? `@${issue.assignee.login}` : '待分配';
      const line = `${status} #${issue.number} ${issue.title.substring(0, 50)} - ${assignee}`;
      doc.text(line, 25, yPos);
      yPos += 5;
    });
  }
  
  // 保存 PDF
  doc.save('ai-team-report.pdf');
}

/**
 * 导出完整报告（包含所有数据）
 */
export function exportFullReport(
  members: AIMember[],
  issues: GitHubIssue[],
  commits: GitHubCommit[],
  activities: ActivityItem[],
  stats: {
    totalMembers: number;
    working: number;
    busy: number;
    idle: number;
    offline: number;
    openIssues: number;
    closedIssues: number;
  }
): void {
  // 同时导出 CSV 文件（打包为 ZIP 或者逐个下载）
  // 这里我们导出主要数据的 CSV
  
  // 导出 PDF 报告
  exportToPDF(members, issues, commits, stats);
  
  // 导出 CSV 文件（用户可以分别下载）
  exportMembersCSV(members);
  exportIssuesCSV(issues);
}
