/**
 * 导出 API - 支持多种格式的数据导出
 */

import { NextRequest, NextResponse } from 'next/server';
import { exportTasksCSV, exportTasksJSON, downloadJSON, downloadCSV } from '../../../lib/export';
import { Task, TaskStats } from '../../../lib/tasks/types';

// 获取任务统计数据
async function getTaskStats(): Promise<TaskStats> {
  // 从数据库获取任务并计算统计
  const { getTasks } = await import('../../../lib/tasks/api');
  const tasks = await getTasks();
  
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const review = tasks.filter(t => t.status === 'review').length;
  
  const now = new Date();
  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < now;
  }).length;
  
  const dueSoon = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    const dueDate = new Date(t.dueDate);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDue > 0 && hoursUntilDue <= 24;
  }).length;
  
  return {
    total,
    done,
    inProgress,
    todo,
    review,
    overdue,
    dueSoon,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
    byPriority: {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    },
  };
}

// 格式化任务为 CSV 数据
function formatTasksForCSV(tasks: Task[]): Record<string, unknown>[] {
  return tasks.map(task => ({
    ID: task.id,
    标题: task.title,
    描述: task.description || '',
    优先级: task.priority,
    状态: task.status,
    标签: task.tags.map(t => t.name).join(';'),
    负责人: task.assignee || '',
    截止日期: task.dueDate ? new Date(task.dueDate).toISOString() : '',
    创建时间: new Date(task.createdAt).toISOString(),
    更新时间: new Date(task.updatedAt).toISOString(),
    完成时间: task.completedAt ? new Date(task.completedAt).toISOString() : '',
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format') || 'json';
  const type = searchParams.get('type') || 'tasks';
  
  try {
    // 获取数据
    const { getTasks } = await import('../../../lib/tasks/api');
    const tasks = await getTasks();
    const stats = await getTaskStats();
    
    const exportData = {
      tasks,
      stats,
      exportedAt: new Date().toISOString(),
    };
    
    if (format === 'json') {
      return NextResponse.json(exportData);
    }
    
    if (format === 'csv') {
      const csvData = formatTasksForCSV(tasks);
      // 返回 CSV 格式的文本
      const headers = Object.keys(csvData[0] || {});
      const csvRows = [
        headers.join(','),
        ...csvData.map(row =>
          headers.map(h => {
            const value = row[h];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
          }).join(',')
        )
      ];
      
      return new NextResponse('\ufeff' + csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }
    
    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, type, data, options } = body;
    
    switch (type) {
      case 'tasks': {
        const { getTasks } = await import('../../../lib/tasks/api');
        const tasks = await getTasks();
        
        if (format === 'json') {
          return NextResponse.json({
            success: true,
            data: tasks,
            format: 'json',
            exportedAt: new Date().toISOString(),
          });
        }
        
        if (format === 'csv') {
          const csvData = formatTasksForCSV(tasks);
          const headers = Object.keys(csvData[0] || {});
          const csvRows = [
            headers.join(','),
            ...csvData.map(row =>
              headers.map(h => {
                const value = row[h];
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
              }).join(',')
            )
          ];
          
          return new NextResponse('\ufeff' + csvRows.join('\n'), {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="tasks-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
          });
        }
        break;
      }
      
      case 'stats': {
        const stats = await getTaskStats();
        return NextResponse.json({
          success: true,
          data: stats,
          format: 'json',
          exportedAt: new Date().toISOString(),
        });
      }
      
      case 'custom': {
        if (!data) {
          return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }
        
        if (format === 'json') {
          return NextResponse.json({
            success: true,
            data,
            format: 'json',
            exportedAt: new Date().toISOString(),
          });
        }
        
        if (format === 'csv') {
          const headers = Object.keys(data[0] || {});
          const csvRows = [
            headers.join(','),
            ...data.map((row: Record<string, unknown>) =>
              headers.map(h => {
                const value = row[h];
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
              }).join(',')
            )
          ];
          
          return new NextResponse('\ufeff' + csvRows.join('\n'), {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
          });
        }
        break;
      }
      
      default:
        return NextResponse.json({ error: 'Unsupported export type' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to process export' },
      { status: 500 }
    );
  }
}