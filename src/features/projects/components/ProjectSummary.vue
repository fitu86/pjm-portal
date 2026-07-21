<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard label="Avance estimado" :value="progress" suffix="%" subtitle="Según las tareas registradas" />
      <MetricCard label="Tareas terminadas" :value="`${completed} de ${total}`" />
      <MetricCard label="Tareas bloqueadas" :value="blocked" :subtitle="blocked > 0 ? 'Necesitan desbloquearse' : 'Sin bloqueos'" :color="blocked > 0 ? 'danger' : 'default'" />
      <MetricCard label="Riesgos por revisar" :value="risksCount" :color="risksCount > 0 ? 'warning' : 'default'" />
    </div>

    <div class="rounded-xl border border-border bg-surface p-5">
      <h3 class="font-semibold">Cómo va el trabajo</h3>
      <p class="mt-1 text-sm text-muted">Este reparto te ayuda a ubicar qué falta y qué ya cerraste.</p>
      <div class="flex items-center gap-1 h-6 rounded overflow-hidden">
        <div v-if="dist.pendiente" class="bg-warning h-full" :style="{ width: `${(dist.pendiente / dist.total) * 100}%` }" />
        <div v-if="dist.en_progreso" class="bg-info h-full" :style="{ width: `${(dist.en_progreso / dist.total) * 100}%` }" />
        <div v-if="dist.completada" class="bg-success h-full" :style="{ width: `${(dist.completada / dist.total) * 100}%` }" />
        <div v-if="dist.bloqueada" class="bg-danger h-full" :style="{ width: `${(dist.bloqueada / dist.total) * 100}%` }" />
      </div>
      <div class="flex items-center gap-3 mt-2 text-xs text-muted">
        <span v-if="dist.pendiente">Por empezar: {{ dist.pendiente }}</span>
        <span v-if="dist.en_progreso">En marcha: {{ dist.en_progreso }}</span>
        <span v-if="dist.completada">Terminadas: {{ dist.completada }}</span>
        <span v-if="dist.bloqueada">Detenidas: {{ dist.bloqueada }}</span>
      </div>
    </div>

    <div v-if="upcomingMs.length > 0" class="rounded-xl border border-border bg-surface p-5">
      <h3 class="font-semibold mb-1">Próximas fechas importantes</h3>
      <p class="mb-3 text-sm text-muted">Hitos que se acercan para este proyecto.</p>
      <ul class="space-y-2">
        <li v-for="m in upcomingMs" :key="m.id" class="flex items-center gap-2 text-sm">
          <StatusBadge label="pendiente" variant="info" dot />
          <span>{{ m.titulo }}</span>
          <span v-if="m.fecha" class="text-xs text-muted font-mono-data ml-auto">{{ formatDateShort(m.fecha) }}</span>
        </li>
      </ul>
    </div>

    <div v-if="risks.length > 0" class="rounded-xl border border-border bg-surface p-5">
      <h3 class="font-semibold mb-1">Posibles obstáculos</h3>
      <p class="mb-3 text-sm text-muted">Aspectos que podrían afectar el avance si no se atienden.</p>
      <ul class="space-y-2">
        <li v-for="r in risks" :key="r.id" class="text-sm">
          <div class="font-bold">{{ r.titulo }}</div>
          <div class="text-xs text-muted">Impacto: {{ r.impacto ?? '--' }} | Prob: {{ r.probabilidad ?? '--' }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Risk } from '@/types/risk';
import type { Milestone } from '@/types/milestone';
import MetricCard from '@/components/common/MetricCard.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { projectProgress, projectTaskDistribution, upcomingMilestones } from '@/lib/metrics';
import { formatDateShort } from '@/lib/dates';

const props = defineProps<{
  projectId: string;
  tasks: Task[];
  sessions: Session[];
  risks: Risk[];
  milestones: Milestone[];
}>();

const progress = computed(() => projectProgress(props.tasks));
const dist = computed(() => projectTaskDistribution(props.tasks));
const total = computed(() => dist.value.total);
const completed = computed(() => dist.value.completada);
const blocked = computed(() => dist.value.bloqueada);
const risksCount = computed(() => props.risks.filter((r) => r.estado !== 'cerrado').length);
const upcomingMs = computed(() => upcomingMilestones(props.milestones).slice(0, 5));
</script>
