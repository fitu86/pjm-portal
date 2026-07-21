import { describe, it, expect } from 'vitest';
import { normalizeTask, normalizeProject, normalizeSession, extractRelatedName } from '@/lib/directus/normalize';

describe('normalizeProject', () => {
  it('handles raw Directus response', () => {
    const raw = {
      id: 'abc-123',
      nombre: 'Mi Proyecto',
      descripcion: null,
      tipo: 'tecnico',
      estado: 'activo',
      orden: 1,
      proyecto_padre_id: null,
      date_created: '2025-01-01T00:00:00Z',
      date_updated: null,
      code: 'MP',
      vision: null,
      scope: null,
      priority: 'alta',
      target_release: null,
    };
    const project = normalizeProject(raw);
    expect(project.id).toBe('abc-123');
    expect(project.nombre).toBe('Mi Proyecto');
    expect(project.tipo).toBe('tecnico');
    expect(project.estado).toBe('activo');
    expect(project.orden).toBe(1);
  });

  it('handles expanded relations', () => {
    const raw = {
      id: '1',
      nombre: 'P',
      tipo: 'personal',
      estado: 'activo',
      proyecto_padre_id: { id: 'parent-1', nombre: 'Parent' },
      date_created: '2025-01-01',
    };
    const project = normalizeProject(raw);
    expect(project.proyecto_padre_id).toBe('parent-1');
  });
});

describe('normalizeTask', () => {
  it('normalizes task with expanded proyecto_id', () => {
    const raw = {
      id: 't-1',
      titulo: 'Task 1',
      estado: 'en_progreso',
      prioridad: 'alta',
      proyecto_id: { id: 'p-1', nombre: 'Project', code: 'PR' },
      task_type: 'task',
      progress: 50,
      blocked_by_task_id: { id: 't-0', titulo: 'Blocker' },
      date_created: '2025-01-01',
    };
    const task = normalizeTask(raw);
    expect(task.proyecto_id).toBe('p-1');
    expect(task.blocked_by_task_id).toBe('t-0');
    expect(task.progress).toBe(50);
  });
});

describe('normalizeSession', () => {
  it('handles null fields', () => {
    const raw = {
      id: 's-1',
      inicio: '2025-01-01T10:00:00Z',
      fin: null,
      duracion_min: 45,
      proyecto_id: 'p-1',
      tarea_id: null,
    };
    const session = normalizeSession(raw);
    expect(session.inicio).toBe('2025-01-01T10:00:00Z');
    expect(session.fin).toBeNull();
    expect(session.duracion_min).toBe(45);
  });
});

describe('extractRelatedName', () => {
  it('extracts name from object', () => {
    expect(extractRelatedName({ nombre: 'Test' })).toBe('Test');
  });

  it('extracts titulo from object', () => {
    expect(extractRelatedName({ titulo: 'Task' }, 'titulo')).toBe('Task');
  });

  it('returns null for null input', () => {
    expect(extractRelatedName(null)).toBeNull();
  });

  it('returns string as-is', () => {
    expect(extractRelatedName('plain string')).toBe('plain string');
  });
});
