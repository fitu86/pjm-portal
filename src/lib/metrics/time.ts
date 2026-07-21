import type { Session } from '@/types/session';
import type { TimeBlock } from '@/types/time-block';
import { parseISO, getWeekRange, getMonthRange } from '@/lib/dates';

export function totalMinutesBySessions(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + (s.duracion_min ?? 0), 0);
}

export function averageSessionDuration(sessions: Session[]): number {
  const withDuration = sessions.filter((s) => s.duracion_min != null && s.duracion_min > 0);
  if (withDuration.length === 0) return 0;
  return Math.round(totalMinutesBySessions(withDuration) / withDuration.length);
}

export function minutesThisWeek(sessions: Session[]): number {
  const { start, end } = getWeekRange();
  return totalMinutesBySessions(
    sessions.filter((s) => {
      try {
        const d = parseISO(s.inicio);
        return d >= start && d <= end;
      } catch {
        return false;
      }
    })
  );
}

export function minutesThisMonth(sessions: Session[]): number {
  const { start, end } = getMonthRange();
  return totalMinutesBySessions(
    sessions.filter((s) => {
      try {
        const d = parseISO(s.inicio);
        return d >= start && d <= end;
      } catch {
        return false;
      }
    })
  );
}

export function minutesByProject(
  sessions: Session[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of sessions) {
    const current = map.get(s.proyecto_id) ?? 0;
    map.set(s.proyecto_id, current + (s.duracion_min ?? 0));
  }
  return map;
}

export function timeBlocksByStatus(blocks: TimeBlock[]) {
  return {
    planeado: blocks.filter((b) => b.estado === 'planeado').length,
    en_curso: blocks.filter((b) => b.estado === 'en_curso').length,
    realizado: blocks.filter((b) => b.estado === 'realizado').length,
    cancelado: blocks.filter((b) => b.estado === 'cancelado').length,
  };
}

export function openSessions(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.inicio && !s.fin);
}

export function sessionsWithoutOutcome(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.inicio && !s.outcome && s.fin);
}
