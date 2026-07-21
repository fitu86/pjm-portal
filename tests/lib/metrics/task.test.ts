import { describe, it, expect } from 'vitest';
import { effectiveTaskProgress, isTaskOverdue } from '@/lib/metrics/task';
import type { Task } from '@/types/task';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    titulo: 'Test task',
    descripcion: null,
    estado: 'pendiente',
    prioridad: 'media',
    orden: null,
    proyecto_id: 'proj-1',
    date_created: '2025-01-01T00:00:00Z',
    date_updated: null,
    effort_estimated: null,
    effort_actual: null,
    start_date: null,
    target_date: null,
    end_date: null,
    capacidad_id: null,
    decision_id: null,
    blocked_by_task_id: null,
    tarea_padre_id: null,
    progress: null,
    task_type: 'task',
    color: null,
    collapsed: null,
    duration_days: null,
    sequence_num: null,
    critical_path: null,
    assigned_to: null,
    ...overrides,
  };
}

describe('effectiveTaskProgress', () => {
  it('returns 100 when task is completed', () => {
    const task = makeTask({ estado: 'completada' });
    expect(effectiveTaskProgress(task)).toBe(100);
  });

  it('returns progress value when set', () => {
    const task = makeTask({ progress: 65 });
    expect(effectiveTaskProgress(task)).toBe(65);
  });

  it('clamps progress to 0-100', () => {
    expect(effectiveTaskProgress(makeTask({ progress: 150 }))).toBe(100);
    expect(effectiveTaskProgress(makeTask({ progress: -10 }))).toBe(0);
  });

  it('returns 0 when no progress and not completed', () => {
    expect(effectiveTaskProgress(makeTask({ progress: null }))).toBe(0);
  });
});

describe('isTaskOverdue', () => {
  it('returns false for completed tasks', () => {
    const task = makeTask({ estado: 'completada', target_date: '2020-01-01' });
    expect(isTaskOverdue(task)).toBe(false);
  });

  it('returns false when no target_date', () => {
    const task = makeTask({ target_date: null });
    expect(isTaskOverdue(task)).toBe(false);
  });

  it('returns true when target_date is in the past', () => {
    const task = makeTask({ estado: 'pendiente', target_date: '2020-01-01' });
    expect(isTaskOverdue(task)).toBe(true);
  });

  it('returns false when target_date is in the future', () => {
    const task = makeTask({ estado: 'pendiente', target_date: '2099-12-31' });
    expect(isTaskOverdue(task)).toBe(false);
  });
});
