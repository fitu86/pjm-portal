import { describe, it, expect } from 'vitest';
import { projectProgress, projectTaskDistribution, projectStatus, upcomingMilestones, STALE_THRESHOLD_DAYS } from '@/lib/metrics/project';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';
import type { Milestone } from '@/types/milestone';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    titulo: 'Test',
    descripcion: null,
    estado: 'pendiente',
    prioridad: 'media',
    orden: null,
    proyecto_id: 'p1',
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

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    nombre: 'Test Project',
    descripcion: null,
    tipo: 'personal',
    estado: 'activo',
    orden: null,
    proyecto_padre_id: null,
    date_created: '2025-01-01T00:00:00Z',
    date_updated: null,
    code: null,
    vision: null,
    scope: null,
    priority: null,
    target_release: null,
    ...overrides,
  };
}

describe('projectProgress', () => {
  it('returns 0 for empty tasks', () => {
    expect(projectProgress([])).toBe(0);
  });

  it('calculates average progress of executable tasks', () => {
    const tasks = [
      makeTask({ task_type: 'task', progress: 50 }),
      makeTask({ id: '2', task_type: 'task', progress: 100 }),
    ];
    expect(projectProgress(tasks)).toBe(75);
  });

  it('excludes phases with subtareas', () => {
    const tasks = [
      makeTask({ task_type: 'task', progress: 100 }),
      makeTask({ id: '2', task_type: 'phase', tarea_padre_id: '3', progress: 50 }),
    ];
    expect(projectProgress(tasks)).toBe(100);
  });
});

describe('projectTaskDistribution', () => {
  it('counts tasks by status', () => {
    const tasks = [
      makeTask({ estado: 'pendiente' }),
      makeTask({ id: '2', estado: 'en_progreso' }),
      makeTask({ id: '3', estado: 'completada' }),
      makeTask({ id: '4', estado: 'bloqueada' }),
    ];
    const dist = projectTaskDistribution(tasks);
    expect(dist.pendiente).toBe(1);
    expect(dist.en_progreso).toBe(1);
    expect(dist.completada).toBe(1);
    expect(dist.bloqueada).toBe(1);
    expect(dist.total).toBe(4);
  });
});

describe('projectStatus', () => {
  it('returns completed when project is completed', () => {
    const p = makeProject({ estado: 'completado' });
    expect(projectStatus(p, [], [])).toBe('completed');
  });

  it('returns unplanned when no tasks', () => {
    expect(projectStatus(makeProject(), [], [])).toBe('unplanned');
  });

  it('returns blocked when blocked task exists', () => {
    const tasks = [makeTask({ estado: 'bloqueada' })];
    expect(projectStatus(makeProject(), tasks, [])).toBe('blocked');
  });

  it('returns healthy when all good', () => {
    const tasks = [makeTask({ estado: 'en_progreso' })];
    expect(projectStatus(makeProject(), tasks, [])).toBe('healthy');
  });
});

describe('upcomingMilestones', () => {
  it('returns pending milestones in the future sorted ascending', () => {
    const milestones: Milestone[] = [
      { id: '1', titulo: 'M1', descripcion: null, estado: 'pendiente', fecha: '2099-12-31', proyecto_id: 'p1', date_created: '' },
      { id: '2', titulo: 'M2', descripcion: null, estado: 'pendiente', fecha: '2099-01-01', proyecto_id: 'p1', date_created: '' },
    ];
    const result = upcomingMilestones(milestones);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('2');
  });

  it('excludes completed milestones', () => {
    const milestones: Milestone[] = [
      { id: '1', titulo: 'M1', descripcion: null, estado: 'completado', fecha: '2099-12-31', proyecto_id: 'p1', date_created: '' },
    ];
    expect(upcomingMilestones(milestones)).toHaveLength(0);
  });
});

describe('STALE_THRESHOLD_DAYS', () => {
  it('is 14', () => {
    expect(STALE_THRESHOLD_DAYS).toBe(14);
  });
});
