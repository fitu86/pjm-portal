import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Progress } from '@/types/progress';
import type { Decision } from '@/types/decision';
import type { Risk } from '@/types/risk';
import type { Achievement } from '@/types/achievement';
import type { Milestone } from '@/types/milestone';
import { effectiveTaskProgress, isTaskOverdue, isTaskBlocked } from './task';
import { parseISO } from '@/lib/dates';

export const STALE_THRESHOLD_DAYS = 14;

export function projectProgress(tasks: Task[]): number {
  const executable = tasks.filter(
    (t) => t.task_type === 'task' && t.tarea_padre_id == null
  );
  if (executable.length === 0) return 0;
  const sum = executable.reduce((acc, t) => acc + effectiveTaskProgress(t), 0);
  return Math.round(sum / executable.length);
}

export function projectTaskDistribution(tasks: Task[]) {
  return {
    total: tasks.length,
    pendiente: tasks.filter((t) => t.estado === 'pendiente').length,
    en_progreso: tasks.filter((t) => t.estado === 'en_progreso').length,
    completada: tasks.filter((t) => t.estado === 'completada').length,
    bloqueada: tasks.filter((t) => t.estado === 'bloqueada').length,
  };
}

export function projectStatus(
  project: Project,
  tasks: Task[],
  risks: Risk[]
): 'completed' | 'blocked' | 'at_risk' | 'stale' | 'unplanned' | 'healthy' {
  if (project.estado === 'completado') return 'completed';
  if (tasks.length === 0) return 'unplanned';
  if (tasks.some(isTaskBlocked)) return 'blocked';
  if (tasks.some(isTaskOverdue)) return 'at_risk';
  if (risks.some((r) => r.estado !== 'cerrado' && r.estado !== 'mitigado')) return 'at_risk';
  return 'healthy';
}

export function projectStaleness(project: Project, relatedDates: (string | null)[]): string | null {
  const allDates = [project.date_updated, project.date_created, ...relatedDates]
    .filter(Boolean)
    .map((d) => {
      try { return parseISO(d!); } catch { return null; }
    })
    .filter(Boolean) as Date[];

  if (allDates.length === 0) return null;

  const latest = allDates.reduce((a, b) => (a > b ? a : b));
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince >= STALE_THRESHOLD_DAYS) return `${daysSince} días sin actividad`;
  return null;
}

export function upcomingMilestones(milestones: Milestone[]): Milestone[] {
  const now = new Date();
  return milestones
    .filter((m) => m.estado === 'pendiente' && m.fecha)
    .filter((m) => {
      try {
        return parseISO(m.fecha!) >= now;
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return parseISO(a.fecha!).getTime() - parseISO(b.fecha!).getTime();
      } catch {
        return 0;
      }
    });
}

export function lastProjectActivity(
  project: Project,
  related: {
    tasks: Task[];
    sessions: Session[];
    progress: Progress[];
    decisions: Decision[];
    risks: Risk[];
    achievements: Achievement[];
    milestones: Milestone[];
  }
): string | null {
  const dates: string[] = [
    project.date_updated,
    project.date_created,
    ...related.tasks.map((t) => t.date_updated ?? t.date_created),
    ...related.sessions.map((s) => s.inicio),
    ...related.progress.map((p) => p.date_created),
    ...related.decisions.map((d) => d.date_updated ?? d.date_created),
    ...related.risks.map((r) => r.date_updated ?? r.date_created),
    ...related.achievements.map((a) => a.fecha),
    ...related.milestones.map((m) => m.fecha ?? m.date_created),
  ].filter(Boolean) as string[];

  if (dates.length === 0) return null;

  return dates.reduce((latest, d) => (d > latest ? d : latest));
}
