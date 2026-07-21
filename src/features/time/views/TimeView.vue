<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold font-mono-data">Tiempo y Sesiones</h1>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard label="Min. hoy" :value="minutesToday" suffix="min" />
      <MetricCard label="Esta semana" :value="weekMin" suffix="min" />
      <MetricCard label="Este mes" :value="monthMin" suffix="min" />
      <MetricCard label="Prom. sesión" :value="avgDuration" suffix="min" />
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard label="Planeados" :value="blockStatus.planeado" />
      <MetricCard label="Realizados" :value="blockStatus.realizado" color="success" />
      <MetricCard label="Sesiones abiertas" :value="openCount" :color="openCount > 0 ? 'warning' : 'default'" />
      <MetricCard label="Sin resultado" :value="noOutcomeCount" :color="noOutcomeCount > 0 ? 'danger' : 'default'" />
    </div>

    <TimeCharts :sessions="sessions ?? []" :time-blocks="timeBlocks ?? []" />

    <div class="bg-surface border-strong rounded p-4 shadow-brutal">
      <h2 class="text-sm font-mono-data font-bold mb-3 uppercase tracking-wider">Bloques recientes</h2>
      <div v-if="!timeBlocks?.length" class="text-sm text-muted">Sin bloques de tiempo.</div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-strong text-xs text-muted font-mono-data">
            <th class="text-left p-2">Fecha</th>
            <th class="text-left p-2">Inicio</th>
            <th class="text-left p-2">Fin</th>
            <th class="text-left p-2">Estado</th>
            <th class="text-left p-2">Proyecto</th>
            <th class="text-left p-2">Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in timeBlocks?.slice(0, 20)" :key="b.id" class="border-b border-border">
            <td class="p-2 font-mono-data text-xs">{{ b.fecha }}</td>
            <td class="p-2 font-mono-data text-xs">{{ b.hora_inicio ?? '--' }}</td>
            <td class="p-2 font-mono-data text-xs">{{ b.hora_fin ?? '--' }}</td>
            <td class="p-2"><StatusBadge :label="b.estado" :variant="blockVariant(b.estado)" dot /></td>
            <td class="p-2 text-muted text-xs">{{ b.proyecto_nombre ?? '--' }}</td>
            <td class="p-2 text-muted text-xs truncate max-w-[200px]">{{ b.notas ?? '--' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchSessions, fetchTimeBlocks } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import {
  minutesThisWeek,
  minutesThisMonth,
  averageSessionDuration,
  timeBlocksByStatus,
  openSessions,
  sessionsWithoutOutcome,
} from '@/lib/metrics';
import { isDateToday } from '@/lib/dates';
import MetricCard from '@/components/common/MetricCard.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import TimeCharts from '../components/TimeCharts.vue';

const { data: sessions } = useQuery({
  queryKey: queryKeys.sessions,
  queryFn: ({ signal }) => fetchSessions(undefined, signal),
});

const { data: timeBlocks } = useQuery({
  queryKey: queryKeys.timeBlocks,
  queryFn: ({ signal }) => fetchTimeBlocks(undefined, signal),
});

const minutesToday = computed(() => {
  const s = (sessions.value ?? []).filter((s) => {
    try {
      return isDateToday(s.inicio);
    } catch {
      return false;
    }
  });
  return s.reduce((sum, s) => sum + (s.duracion_min ?? 0), 0);
});

const weekMin = computed(() => minutesThisWeek(sessions.value ?? []));
const monthMin = computed(() => minutesThisMonth(sessions.value ?? []));
const avgDuration = computed(() => averageSessionDuration(sessions.value ?? []));
const blockStatus = computed(() => timeBlocksByStatus(timeBlocks.value ?? []));
const openCount = computed(() => openSessions(sessions.value ?? []).length);
const noOutcomeCount = computed(() => sessionsWithoutOutcome(sessions.value ?? []).length);

function blockVariant(status: string): 'success' | 'warning' | 'info' | 'dark' {
  if (status === 'realizado') return 'success';
  if (status === 'en_curso') return 'info';
  if (status === 'cancelado') return 'dark';
  return 'warning';
}
</script>
