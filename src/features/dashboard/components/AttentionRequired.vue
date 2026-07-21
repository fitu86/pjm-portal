<template>
  <div class="rounded-xl border border-border bg-surface p-5">
    <div class="mb-4">
      <h2 class="font-semibold">Lo que necesita atención</h2>
      <p class="mt-1 text-sm text-muted">Bloqueos, fechas vencidas y riesgos que podrían frenar tu avance.</p>
    </div>
    <div v-if="items.length === 0" class="rounded-lg bg-success/10 px-3 py-3 text-sm text-success">Todo está bajo control por ahora.</div>
    <ul v-else class="space-y-2">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-start gap-2 text-sm"
      >
        <StatusBadge :label="item.type" :variant="item.badgeVariant" dot />
        <div class="min-w-0">
          <div class="truncate">{{ item.title }}</div>
          <div class="text-xs text-muted">{{ item.detail }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/task';
import type { Milestone } from '@/types/milestone';
import type { Risk } from '@/types/risk';
import type { Project } from '@/types/project';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { isTaskOverdue } from '@/lib/metrics';
import { daysUntilDate } from '@/lib/dates/timezone';

interface AttentionItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  badgeVariant: 'danger' | 'warning' | 'info';
  priority: number;
}

const props = defineProps<{
  tasks: Task[];
  milestones: Milestone[];
  risks: Risk[];
  projects: Project[];
}>();

const items = computed(() => {
  const result: AttentionItem[] = [];

  for (const t of props.tasks.filter((t) => t.estado === 'bloqueada')) {
    result.push({
      id: `blocked-${t.id}`,
      type: 'Bloqueada',
      title: t.titulo,
      detail: t.proyecto_id,
      badgeVariant: 'danger',
      priority: 1,
    });
  }

  for (const t of props.tasks.filter((t) => isTaskOverdue(t))) {
    result.push({
      id: `overdue-${t.id}`,
      type: 'Vencida',
      title: t.titulo,
      detail: `Objetivo: ${t.target_date}`,
      badgeVariant: 'danger',
      priority: 2,
    });
  }

  for (const t of props.tasks.filter((t) => t.estado !== 'completada' && t.prioridad === 'alta')) {
    result.push({
      id: `high-${t.id}`,
      type: 'Alta prioridad',
      title: t.titulo,
      detail: t.estado,
      badgeVariant: 'warning',
      priority: 3,
    });
  }

  for (const m of props.milestones.filter((m) => m.estado === 'pendiente' && m.fecha && daysUntilDate(m.fecha) !== null && daysUntilDate(m.fecha)! < 0)) {
    result.push({
      id: `milestone-${m.id}`,
      type: 'Hito vencido',
      title: m.titulo,
      detail: `Fecha: ${m.fecha}`,
      badgeVariant: 'danger',
      priority: 4,
    });
  }

  for (const r of props.risks.filter((r) => r.estado !== 'cerrado' && r.estado !== 'mitigado' && r.impacto?.toLowerCase() === 'alto')) {
    result.push({
      id: `risk-${r.id}`,
      type: 'Riesgo alto',
      title: r.titulo,
      detail: r.descripcion?.slice(0, 80) ?? '',
      badgeVariant: 'warning',
      priority: 5,
    });
  }

  return result.sort((a, b) => a.priority - b.priority).slice(0, 10);
});
</script>
