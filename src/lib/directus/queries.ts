import { directusGet, type DirectusQueryParams } from './client';
import {
  normalizeProject,
  normalizeTask,
  normalizeSession,
  normalizeRisk,
  normalizeDecision,
  normalizeAchievement,
  normalizeMilestone,
  normalizeProgress,
  normalizeTimeBlock,
  extractRelatedName,
} from './normalize';
import type { Project } from '@/types/project';
import type { TaskWithProject } from '@/types/task';
import type { SessionWithProject } from '@/types/session';
import type { RiskWithProject } from '@/types/risk';
import type { DecisionWithProject } from '@/types/decision';
import type { AchievementWithProject } from '@/types/achievement';
import type { MilestoneWithProject } from '@/types/milestone';
import type { ProgressWithTask } from '@/types/progress';
import type { TimeBlockWithProject } from '@/types/time-block';
import type { Brief } from '@/types/brief';

const PROJECT_FIELDS = [
  'id', 'nombre', 'descripcion', 'tipo', 'estado', 'orden',
  'proyecto_padre_id', 'date_created', 'date_updated', 'code',
  'vision', 'scope', 'priority', 'target_release',
];

const TASK_FIELDS = [
  'id', 'titulo', 'descripcion', 'estado', 'prioridad', 'orden',
  'proyecto_id.id', 'proyecto_id.nombre', 'proyecto_id.code',
  'date_created', 'date_updated', 'effort_estimated', 'effort_actual',
  'start_date', 'target_date', 'end_date', 'capacidad_id',
  'decision_id', 'blocked_by_task_id.id', 'blocked_by_task_id.titulo',
  'tarea_padre_id', 'progress', 'task_type', 'color', 'collapsed',
  'duration_days', 'sequence_num', 'critical_path', 'assigned_to',
];

const SESSION_FIELDS = [
  'id', 'inicio', 'fin', 'duracion_min', 'que_se_hizo',
  'decisiones', 'proximos_pasos', 'ideas', 'session_type', 'outcome',
  'capacidad_id', 'decision_id',
  'proyecto_id.id', 'proyecto_id.nombre',
  'tarea_id.id', 'tarea_id.titulo',
];

const RISK_FIELDS = [
  'id', 'titulo', 'descripcion', 'impacto', 'probabilidad',
  'mitigacion', 'estado', 'capacidad_id',
  'date_created', 'date_updated',
  'proyecto_id.id', 'proyecto_id.nombre',
];

const DECISION_FIELDS = [
  'id', 'titulo', 'contexto', 'decision', 'consecuencias',
  'estado', 'capacidad_id', 'adr_number',
  'date_created', 'date_updated',
  'proyecto_id.id', 'proyecto_id.nombre',
];

const ACHIEVEMENT_FIELDS = [
  'id', 'titulo', 'descripcion', 'fecha',
  'proyecto_id.id', 'proyecto_id.nombre',
  'milestone_id.id', 'milestone_id.titulo',
];

const MILESTONE_FIELDS = [
  'id', 'titulo', 'descripcion', 'estado', 'fecha',
  'date_created',
  'proyecto_id.id', 'proyecto_id.nombre',
];

const PROGRESS_FIELDS = [
  'id', 'descripcion', 'porcentaje', 'session_id',
  'date_created',
  'tarea_id.id', 'tarea_id.titulo',
];

const TIME_BLOCK_FIELDS = [
  'id', 'fecha', 'hora_inicio', 'hora_fin', 'estado', 'notas',
  'proyecto_id.id', 'proyecto_id.nombre',
  'tarea_id.id', 'tarea_id.titulo',
];

const BRIEF_FIELDS = [
  'id', 'proyecto_id', 'problema', 'objetivo',
  'alcance_incluye', 'alcance_excluye', 'criterios_exito',
  'restricciones', 'recursos', 'referencias', 'date_updated',
];

export async function fetchProjects(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<Project[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_projects', {
    fields: PROJECT_FIELDS,
    sort: ['orden', 'nombre'],
    ...params,
  }, signal);
  return raw.map(normalizeProject);
}

export async function fetchProjectById(
  id: string,
  signal?: AbortSignal
): Promise<Project | null> {
  try {
    const raw = await directusGet<Record<string, unknown>>('pjm_projects', {
      fields: PROJECT_FIELDS,
      filter: { id },
    }, signal);
    return raw.length > 0 ? normalizeProject(raw[0]) : null;
  } catch {
    return null;
  }
}

export async function fetchTasks(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<TaskWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_tasks', {
    fields: TASK_FIELDS,
    sort: ['-date_created'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const task = normalizeTask(r);
    return {
      ...task,
      proyecto_nombre: extractRelatedName(r.proyecto_id, 'nombre') ?? undefined,
      proyecto_code: extractRelatedName((r.proyecto_id as Record<string, unknown>)?.code as unknown) ?? null,
      blocked_by_titulo: extractRelatedName((r as Record<string, unknown>).blocked_by_task_id, 'titulo'),
    };
  });
}

export async function fetchTasksByProject(
  projectId: string,
  signal?: AbortSignal
): Promise<TaskWithProject[]> {
  return fetchTasks({ filter: { proyecto_id: projectId } }, signal);
}

export async function fetchSessions(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<SessionWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_sessions', {
    fields: SESSION_FIELDS,
    sort: ['-inicio'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const session = normalizeSession(r);
    return {
      ...session,
      proyecto_nombre: extractRelatedName(r.proyecto_id) ?? undefined,
      tarea_titulo: extractRelatedName((r as Record<string, unknown>).tarea_id, 'titulo'),
    };
  });
}

export async function fetchRisks(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<RiskWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_risks', {
    fields: RISK_FIELDS,
    sort: ['-date_created'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const risk = normalizeRisk(r);
    return {
      ...risk,
      proyecto_nombre: extractRelatedName(r.proyecto_id) ?? undefined,
    };
  });
}

export async function fetchDecisions(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<DecisionWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_decisions', {
    fields: DECISION_FIELDS,
    sort: ['-date_created'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const decision = normalizeDecision(r);
    return {
      ...decision,
      proyecto_nombre: extractRelatedName(r.proyecto_id) ?? undefined,
    };
  });
}

export async function fetchAchievements(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<AchievementWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_achievements', {
    fields: ACHIEVEMENT_FIELDS,
    sort: ['-fecha'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const achievement = normalizeAchievement(r);
    return {
      ...achievement,
      proyecto_nombre: extractRelatedName(r.proyecto_id) ?? undefined,
      milestone_titulo: extractRelatedName((r as Record<string, unknown>).milestone_id, 'titulo'),
    };
  });
}

export async function fetchMilestones(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<MilestoneWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_milestones', {
    fields: MILESTONE_FIELDS,
    sort: ['fecha'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const milestone = normalizeMilestone(r);
    return {
      ...milestone,
      proyecto_nombre: extractRelatedName(r.proyecto_id) ?? undefined,
    };
  });
}

export async function fetchProgress(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<ProgressWithTask[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_progress', {
    fields: PROGRESS_FIELDS,
    sort: ['-date_created'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const progress = normalizeProgress(r);
    return {
      ...progress,
      tarea_titulo: extractRelatedName((r as Record<string, unknown>).tarea_id, 'titulo') ?? undefined,
    };
  });
}

export async function fetchTimeBlocks(
  params?: DirectusQueryParams,
  signal?: AbortSignal
): Promise<TimeBlockWithProject[]> {
  const raw = await directusGet<Record<string, unknown>>('pjm_time_blocks', {
    fields: TIME_BLOCK_FIELDS,
    sort: ['fecha', 'hora_inicio'],
    ...params,
  }, signal);
  return raw.map((r) => {
    const block = normalizeTimeBlock(r);
    return {
      ...block,
      proyecto_nombre: extractRelatedName(r.proyecto_id) ?? undefined,
      tarea_titulo: extractRelatedName((r as Record<string, unknown>).tarea_id, 'titulo'),
    };
  });
}

export async function fetchBriefByProject(
  projectId: string,
  signal?: AbortSignal
): Promise<Brief | null> {
  try {
    const raw = await directusGet<Record<string, unknown>>('pjm_project_briefs', {
      fields: BRIEF_FIELDS,
      filter: { proyecto_id: projectId },
    }, signal);
    if (raw.length === 0) return null;
    const r = raw[0];
    return {
      id: String(r.id),
      proyecto_id: String(r.proyecto_id),
      problema: r.problema != null ? String(r.problema) : null,
      objetivo: r.objetivo != null ? String(r.objetivo) : null,
      alcance_incluye: r.alcance_incluye != null ? String(r.alcance_incluye) : null,
      alcance_excluye: r.alcance_excluye != null ? String(r.alcance_excluye) : null,
      criterios_exito: r.criterios_exito != null ? String(r.criterios_exito) : null,
      restricciones: r.restricciones != null ? String(r.restricciones) : null,
      recursos: r.recursos != null ? String(r.recursos) : null,
      referencias: r.referencias != null ? String(r.referencias) : null,
      date_updated: r.date_updated != null ? String(r.date_updated) : null,
    };
  } catch {
    return null;
  }
}
