import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  differenceInDays,
  differenceInMinutes,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isBefore,
  isAfter,
  subDays,
} from 'date-fns';
import { es } from 'date-fns/locale';

const OPTIONS = { locale: es };

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt, OPTIONS);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy HH:mm', OPTIONS);
  } catch {
    return dateStr;
  }
}

export function formatTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'HH:mm');
  } catch {
    return dateStr;
  }
}

export function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, ...OPTIONS });
  } catch {
    return dateStr;
  }
}

export function formatDurationMinutes(minutes: number | null): string {
  if (minutes == null) return '--';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getTodayMexico(): Date {
  return startOfDay(new Date());
}

export function isDateToday(dateStr: string): boolean {
  try {
    return isToday(parseISO(dateStr));
  } catch {
    return false;
  }
}

export function isDateYesterday(dateStr: string): boolean {
  try {
    return isYesterday(parseISO(dateStr));
  } catch {
    return false;
  }
}

export function isDateThisWeek(dateStr: string): boolean {
  try {
    return isThisWeek(parseISO(dateStr), { weekStartsOn: 1 });
  } catch {
    return false;
  }
}

export function isDateThisMonth(dateStr: string): boolean {
  try {
    return isThisMonth(parseISO(dateStr));
  } catch {
    return false;
  }
}

export function daysBetween(dateA: string, dateB: string): number {
  try {
    return differenceInDays(parseISO(dateA), parseISO(dateB));
  } catch {
    return 0;
  }
}

export function minutesBetween(start: string, end: string): number {
  try {
    return Math.abs(differenceInMinutes(parseISO(end), parseISO(start)));
  } catch {
    return 0;
  }
}

export function isDateBefore(dateStr: string, reference: Date = new Date()): boolean {
  try {
    return isBefore(parseISO(dateStr), startOfDay(reference));
  } catch {
    return false;
  }
}

export function isDateAfter(dateStr: string, reference: Date = new Date()): boolean {
  try {
    return isAfter(parseISO(dateStr), reference);
  } catch {
    return false;
  }
}

export function daysUntil(dateStr: string): number | null {
  try {
    return differenceInDays(parseISO(dateStr), getTodayMexico());
  } catch {
    return null;
  }
}

export function getWeekRange(date: Date = new Date()) {
  return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
}

export function getMonthRange(date: Date = new Date()) {
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Hoy';
    if (isYesterday(d)) return 'Ayer';
    return format(d, 'dd MMM', OPTIONS);
  } catch {
    return dateStr;
  }
}

export { parseISO, addDays, subDays, startOfDay, endOfDay, isBefore, isAfter, format };
