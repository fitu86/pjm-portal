import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Risk } from '@/types/risk';
import type { Decision } from '@/types/decision';
import type { Achievement } from '@/types/achievement';
import type { Milestone } from '@/types/milestone';
import type { Progress } from '@/types/progress';
import type { TimeBlock } from '@/types/time-block';

type StringOrObject = string | Record<string, unknown>;

function extractId(value: StringOrObject | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return (value.id as string) ?? null;
}

function extractString(value: StringOrObject | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'nombre' in value) return value.nombre as string;
  if (typeof value === 'object' && 'titulo' in value) return value.titulo as string;
  return null;
}

function extractNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return isNaN(n) ? null : n;
  }
  return null;
}

export function normalizeProject(raw: Record<string, unknown>): Project {
  return {
    id: String(raw.id),
    nombre: String(raw.nombre ?? ''),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : null,
    tipo: (raw.tipo as Project['tipo']) ?? 'personal',
    estado: (raw.estado as Project['estado']) ?? 'activo',
    orden: extractNumber(raw.orden),
    proyecto_padre_id: extractId(raw.proyecto_padre_id as StringOrObject),
    date_created: String(raw.date_created ?? ''),
    date_updated: raw.date_updated != null ? String(raw.date_updated) : null,
    code: raw.code != null ? String(raw.code) : null,
    vision: raw.vision != null ? String(raw.vision) : null,
    scope: raw.scope != null ? String(raw.scope) : null,
    priority: raw.priority != null ? String(raw.priority) : null,
    target_release: raw.target_release != null ? String(raw.target_release) : null,
  };
}

export function normalizeTask(raw: Record<string, unknown>): Task {
  const proyectoId = extractId(raw.proyecto_id as StringOrObject);
  return {
    id: String(raw.id),
    titulo: String(raw.titulo ?? ''),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : null,
    estado: (raw.estado as Task['estado']) ?? 'pendiente',
    prioridad: (raw.prioridad as Task['prioridad']) ?? 'media',
    orden: extractNumber(raw.orden),
    proyecto_id: proyectoId ?? '',
    date_created: String(raw.date_created ?? ''),
    date_updated: raw.date_updated != null ? String(raw.date_updated) : null,
    effort_estimated: extractNumber(raw.effort_estimated),
    effort_actual: extractNumber(raw.effort_actual),
    start_date: raw.start_date != null ? String(raw.start_date) : null,
    target_date: raw.target_date != null ? String(raw.target_date) : null,
    end_date: raw.end_date != null ? String(raw.end_date) : null,
    capacidad_id: extractId(raw.capacidad_id as StringOrObject),
    decision_id: extractId(raw.decision_id as StringOrObject),
    blocked_by_task_id: extractId(raw.blocked_by_task_id as StringOrObject),
    tarea_padre_id: extractId(raw.tarea_padre_id as StringOrObject),
    progress: extractNumber(raw.progress),
    task_type: (raw.task_type as Task['task_type']) ?? 'task',
    color: raw.color != null ? String(raw.color) : null,
    collapsed: raw.collapsed != null ? Boolean(raw.collapsed) : null,
    duration_days: extractNumber(raw.duration_days),
    sequence_num: extractNumber(raw.sequence_num),
    critical_path: raw.critical_path != null ? Boolean(raw.critical_path) : null,
    assigned_to: raw.assigned_to != null ? String(raw.assigned_to) : null,
  };
}

export function normalizeSession(raw: Record<string, unknown>): Session {
  return {
    id: String(raw.id),
    inicio: String(raw.inicio ?? ''),
    fin: raw.fin != null ? String(raw.fin) : null,
    duracion_min: extractNumber(raw.duracion_min),
    que_se_hizo: raw.que_se_hizo != null ? String(raw.que_se_hizo) : null,
    decisiones: raw.decisiones != null ? String(raw.decisiones) : null,
    proximos_pasos: raw.proximos_pasos != null ? String(raw.proximos_pasos) : null,
    ideas: raw.ideas != null ? String(raw.ideas) : null,
    proyecto_id: extractId(raw.proyecto_id as StringOrObject) ?? '',
    tarea_id: extractId(raw.tarea_id as StringOrObject),
    session_type: raw.session_type != null ? String(raw.session_type) : null,
    outcome: raw.outcome != null ? String(raw.outcome) : null,
    capacidad_id: extractId(raw.capacidad_id as StringOrObject),
    decision_id: extractId(raw.decision_id as StringOrObject),
  };
}

export function normalizeRisk(raw: Record<string, unknown>): Risk {
  return {
    id: String(raw.id),
    titulo: String(raw.titulo ?? ''),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : null,
    impacto: raw.impacto != null ? String(raw.impacto) : null,
    probabilidad: raw.probabilidad != null ? String(raw.probabilidad) : null,
    mitigacion: raw.mitigacion != null ? String(raw.mitigacion) : null,
    estado: raw.estado != null ? String(raw.estado) : null,
    proyecto_id: extractId(raw.proyecto_id as StringOrObject) ?? '',
    capacidad_id: extractId(raw.capacidad_id as StringOrObject),
    date_created: String(raw.date_created ?? ''),
    date_updated: raw.date_updated != null ? String(raw.date_updated) : null,
  };
}

export function normalizeDecision(raw: Record<string, unknown>): Decision {
  return {
    id: String(raw.id),
    titulo: String(raw.titulo ?? ''),
    contexto: raw.contexto != null ? String(raw.contexto) : null,
    decision: raw.decision != null ? String(raw.decision) : null,
    consecuencias: raw.consecuencias != null ? String(raw.consecuencias) : null,
    estado: raw.estado != null ? String(raw.estado) : null,
    proyecto_id: extractId(raw.proyecto_id as StringOrObject) ?? '',
    capacidad_id: extractId(raw.capacidad_id as StringOrObject),
    adr_number: raw.adr_number != null ? String(raw.adr_number) : null,
    date_created: String(raw.date_created ?? ''),
    date_updated: raw.date_updated != null ? String(raw.date_updated) : null,
  };
}

export function normalizeAchievement(raw: Record<string, unknown>): Achievement {
  return {
    id: String(raw.id),
    titulo: String(raw.titulo ?? ''),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : null,
    fecha: raw.fecha != null ? String(raw.fecha) : null,
    proyecto_id: extractId(raw.proyecto_id as StringOrObject) ?? '',
    milestone_id: extractId(raw.milestone_id as StringOrObject),
  };
}

export function normalizeMilestone(raw: Record<string, unknown>): Milestone {
  return {
    id: String(raw.id),
    titulo: String(raw.titulo ?? ''),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : null,
    estado: (raw.estado as Milestone['estado']) ?? 'pendiente',
    fecha: raw.fecha != null ? String(raw.fecha) : null,
    proyecto_id: extractId(raw.proyecto_id as StringOrObject) ?? '',
    date_created: String(raw.date_created ?? ''),
  };
}

export function normalizeProgress(raw: Record<string, unknown>): Progress {
  return {
    id: String(raw.id),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : null,
    porcentaje: extractNumber(raw.porcentaje),
    tarea_id: extractId(raw.tarea_id as StringOrObject) ?? '',
    session_id: extractId(raw.session_id as StringOrObject),
    date_created: String(raw.date_created ?? ''),
  };
}

export function normalizeTimeBlock(raw: Record<string, unknown>): TimeBlock {
  return {
    id: String(raw.id),
    fecha: String(raw.fecha ?? ''),
    hora_inicio: raw.hora_inicio != null ? String(raw.hora_inicio) : null,
    hora_fin: raw.hora_fin != null ? String(raw.hora_fin) : null,
    estado: (raw.estado as TimeBlock['estado']) ?? 'planeado',
    notas: raw.notas != null ? String(raw.notas) : null,
    proyecto_id: extractId(raw.proyecto_id as StringOrObject) ?? '',
    tarea_id: extractId(raw.tarea_id as StringOrObject),
  };
}

export function withProjectName<T extends { proyecto_id: string }>(
  item: T,
  projectName?: string | null,
  projectCode?: string | null
): T & { proyecto_nombre?: string; proyecto_code?: string | null } {
  return {
    ...item,
    proyecto_nombre: projectName ?? undefined,
    proyecto_code: projectCode ?? null,
  };
}

export function extractRelatedName(
  relation: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _field?: 'nombre' | 'titulo'
): string | null {
  return extractString(relation as StringOrObject);
}
