<template>
  <div class="max-w-7xl space-y-6">
    <section class="rounded-xl border border-border-strong bg-surface p-5 sm:p-6">
      <p class="text-sm font-medium text-accent">{{ dayOfWeek }}</p>
      <h1 class="mt-1 text-2xl font-bold">Tu plan para {{ todayFormatted }}</h1>
      <p class="mt-2 text-sm text-muted">Empieza por las prioridades; el resto queda visible para que no pierdas el contexto.</p>
    </section>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section class="lg:col-span-2 rounded-xl border border-border bg-surface p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="font-semibold">Prioridades de hoy</h2>
            <p class="mt-1 text-sm text-muted">Ordenadas por lo que requiere acción primero.</p>
          </div>
          <router-link to="/tasks" class="text-sm font-medium text-accent hover:underline">Todas las tareas</router-link>
        </div>

        <div v-if="priorityTasks.length === 0" class="rounded-lg bg-success/10 p-4 text-sm text-success">
          No hay tareas urgentes. Puedes elegir una tarea pendiente y avanzar con calma.
        </div>
        <ul v-else class="divide-y divide-border">
          <li v-for="task in priorityTasks" :key="task.id" class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="taskTone(task)" />
            <div class="min-w-0 flex-1">
              <p class="font-medium">{{ task.titulo }}</p>
              <p class="mt-0.5 text-sm text-muted">{{ taskReason(task) }}</p>
            </div>
            <span v-if="task.progress != null" class="shrink-0 text-sm text-muted">{{ task.progress }}%</span>
          </li>
        </ul>
      </section>

      <aside class="space-y-6">
        <section v-if="openSessionsNow.length > 0" class="rounded-xl border border-accent/50 bg-surface p-5">
          <h2 class="font-semibold">Sesión en marcha</h2>
          <div v-for="session in openSessionsNow" :key="session.id" class="mt-3 text-sm">
            <p class="font-medium">{{ session.que_se_hizo ?? 'Trabajo sin descripción' }}</p>
            <p class="mt-1 text-muted">Inició a las {{ formatTime(session.inicio) }}</p>
          </div>
        </section>

        <section v-if="timeBlocksToday.length > 0" class="rounded-xl border border-border bg-surface p-5">
          <h2 class="font-semibold">Agenda de hoy</h2>
          <ul class="mt-3 space-y-3">
            <li v-for="block in timeBlocksToday" :key="block.id" class="text-sm">
              <p class="font-medium">{{ block.tarea_titulo ?? block.notas ?? 'Bloque sin título' }}</p>
              <p class="mt-0.5 text-muted">{{ block.hora_inicio ?? '--:--' }} – {{ block.hora_fin ?? '--:--' }}</p>
            </li>
          </ul>
        </section>

        <section v-if="upcomingMilestonesList.length > 0" class="rounded-xl border border-border bg-surface p-5">
          <h2 class="font-semibold">Próximas fechas importantes</h2>
          <ul class="mt-3 space-y-3">
            <li v-for="milestone in upcomingMilestonesList" :key="milestone.id" class="text-sm">
              <p class="font-medium">{{ milestone.titulo }}</p>
              <p v-if="milestone.fecha" class="mt-0.5 text-muted">{{ milestoneDate(milestone.fecha) }}</p>
            </li>
          </ul>
        </section>
      </aside>
    </div>

    <section v-if="recentNextSteps.length > 0" class="rounded-xl border border-border bg-surface p-5">
      <h2 class="font-semibold">Notas para retomar</h2>
      <p class="mt-1 text-sm text-muted">Siguientes pasos escritos al cerrar sesiones anteriores.</p>
      <ul class="mt-3 space-y-2 text-sm">
        <li v-for="step in recentNextSteps" :key="step" class="rounded-lg bg-surface-elevated px-3 py-2">{{ step }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { fetchTasks, fetchSessions, fetchTimeBlocks, fetchMilestones } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import { upcomingMilestones, isTaskOverdue, openSessions } from '@/lib/metrics';
import { isDateToday, formatDateShort, formatTime } from '@/lib/dates';
import { daysUntilDate } from '@/lib/dates/timezone';
import type { Task } from '@/types/task';

const { data: tasks } = useQuery({
  queryKey: queryKeys.tasks,
  queryFn: ({ signal }) => fetchTasks(undefined, signal),
});

const { data: sessions } = useQuery({
  queryKey: queryKeys.sessions,
  queryFn: ({ signal }) => fetchSessions(undefined, signal),
});

const { data: timeBlocks } = useQuery({
  queryKey: queryKeys.timeBlocks,
  queryFn: ({ signal }) => fetchTimeBlocks(undefined, signal),
});

const { data: milestones } = useQuery({
  queryKey: queryKeys.milestones,
  queryFn: ({ signal }) => fetchMilestones(undefined, signal),
});

const today = new Date();

const todayFormatted = computed(() => format(today, "d 'de' MMMM, yyyy", { locale: es }));
const dayOfWeek = computed(() => format(today, 'EEEE', { locale: es }));

const timeBlocksToday = computed(() =>
  (timeBlocks.value ?? []).filter((b) => {
    try {
      return isDateToday(b.fecha);
    } catch {
      return false;
    }
  })
);

const priorityTasks = computed(() =>
  (tasks.value ?? [])
    .filter((task) => task.estado !== 'completada')
    .filter((task) => task.estado === 'bloqueada' || isTaskOverdue(task) || task.prioridad === 'alta' || task.estado === 'en_progreso' || (task.target_date && daysUntilDate(task.target_date) === 0))
    .sort((a, b) => taskPriority(a) - taskPriority(b))
    .slice(0, 8)
);
const upcomingMilestonesList = computed(() => upcomingMilestones(milestones.value ?? []).slice(0, 5));
const openSessionsNow = computed(() => openSessions(sessions.value ?? []));
const recentNextSteps = computed(() =>
  (sessions.value ?? [])
    .filter((s) => s.proximos_pasos)
    .sort((a, b) => b.inicio.localeCompare(a.inicio))
    .slice(0, 3)
    .map((s) => s.proximos_pasos!)
);

function taskPriority(task: Task): number {
  if (task.estado === 'bloqueada') return 0;
  if (task.target_date && isTaskOverdue(task)) return 1;
  if (task.target_date && daysUntilDate(task.target_date) === 0) return 2;
  if (task.prioridad === 'alta') return 3;
  if (task.estado === 'en_progreso') return 4;
  return 5;
}

function taskTone(task: Task): string {
  if (task.estado === 'bloqueada' || (task.target_date && isTaskOverdue(task))) return 'bg-danger';
  if (task.target_date && daysUntilDate(task.target_date) === 0) return 'bg-warning';
  if (task.estado === 'en_progreso') return 'bg-info';
  return task.prioridad === 'alta' ? 'bg-warning' : 'bg-accent';
}

function taskReason(task: Task): string {
  if (task.estado === 'bloqueada') return 'Está bloqueada; revisa qué la está deteniendo.';
  if (task.target_date && isTaskOverdue(task)) return `La fecha objetivo ya pasó (${formatDateShort(task.target_date)}).`;
  if (task.target_date && daysUntilDate(task.target_date) === 0) return 'Su fecha objetivo es hoy.';
  if (task.estado === 'en_progreso') return 'Ya está en marcha; conviene cerrarla o registrar el siguiente paso.';
  return 'Marcada como prioridad alta.';
}

function milestoneDate(date: string): string {
  const days = daysUntilDate(date);
  if (days === 0) return 'Es hoy';
  if (days === 1) return 'Es mañana';
  if (days != null && days > 1) return `Faltan ${days} días · ${formatDateShort(date)}`;
  return formatDateShort(date);
}
</script>
