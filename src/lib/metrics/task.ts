import type { Task } from '@/types/task';
import { isOverdueDate } from '@/lib/dates/timezone';

export function effectiveTaskProgress(task: Task): number {
  if (task.estado === 'completada') return 100;
  if (task.progress != null) {
    return Math.max(0, Math.min(100, task.progress));
  }
  return 0;
}

export function isTaskOverdue(task: Task): boolean {
  if (task.estado === 'completada') return false;
  if (!task.target_date) return false;
  return isOverdueDate(task.target_date);
}

export function isTaskBlocked(task: Task): boolean {
  return task.estado === 'bloqueada';
}

export function taskEffortVariance(task: Task): number | null {
  if (task.effort_estimated == null || task.effort_actual == null) return null;
  return task.effort_actual - task.effort_estimated;
}
