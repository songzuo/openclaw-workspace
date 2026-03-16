/**
 * 批量操作 API 路由
 * POST: 批量更新任务状态
 */

import { NextRequest, NextResponse } from 'next/server';
import { batchUpdateStatus } from '@/lib/db/tasks.repository';
import { TaskStatus } from '@/lib/tasks/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { error: 'Task IDs are required' },
        { status: 400 }
      );
    }
    
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    const count = batchUpdateStatus(body.ids, body.status as TaskStatus);
    
    return NextResponse.json({ success: true, updated: count });
  } catch (error) {
    console.error('Failed to batch update tasks:', error);
    return NextResponse.json(
      { error: 'Failed to batch update tasks' },
      { status: 500 }
    );
  }
}