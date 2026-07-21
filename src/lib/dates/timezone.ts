import { parseISO } from 'date-fns';

const DEFAULT_TIMEZONE = 'America/Mexico_City';

let cachedTimezone: string | null = null;

function getTimezone(): string {
  if (cachedTimezone) return cachedTimezone;
  try {
    // Vite replaces import.meta.env at build time
    cachedTimezone = import.meta.env.VITE_TIMEZONE || DEFAULT_TIMEZONE;
  } catch {
    cachedTimezone = DEFAULT_TIMEZONE;
  }
  return cachedTimezone;
}

export function getNowInTimezone(): Date {
  const tz = getTimezone();
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
    return new Date(
      `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`
    );
  } catch {
    return now;
  }
}

export function isOverdueDate(dateStr: string): boolean {
  try {
    const target = parseISO(dateStr);
    const now = getNowInTimezone();
    return target < now;
  } catch {
    return false;
  }
}

export function daysUntilDate(dateStr: string): number | null {
  try {
    const target = parseISO(dateStr);
    const now = getNowInTimezone();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}
