<template>
  <div class="rounded-xl border border-border bg-surface p-5">
    <div class="mb-4">
      <h2 class="font-semibold">En qué estás trabajando</h2>
      <p class="mt-1 text-sm text-muted">Tu tarea activa y el último contexto registrado.</p>
    </div>
    <div v-if="currentTask" class="space-y-3">
      <div>
        <div class="text-lg font-bold">{{ currentTask.titulo }}</div>
        <div class="text-sm text-muted">
          {{ currentTask.proyecto_nombre ?? 'Proyecto' }}
          <span v-if="currentTask.proyecto_code" class="font-mono-data"> ({{ currentTask.proyecto_code }})</span>
        </div>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <StatusBadge :label="currentTask.prioridad" :variant="priorityVariant(currentTask.prioridad)" dot />
        <StatusBadge :label="currentTask.estado" variant="info" dot />
        <span v-if="currentTask.target_date" class="text-muted font-mono-data">
          Objetivo: {{ formatDateShort(currentTask.target_date) }}
        </span>
      </div>
      <div v-if="currentTask.progress != null" class="w-full bg-surface-elevated rounded h-2">
        <div
          class="h-2 rounded bg-accent transition-all"
          :style="{ width: `${Math.min(100, Math.max(0, currentTask.progress))}%` }"
        />
      </div>
      <div v-if="lastSession" class="border-t border-strong pt-3 mt-3">
        <div class="text-xs font-medium text-muted mb-1">Última nota de trabajo</div>
        <div v-if="lastSession.que_se_hizo" class="text-sm">{{ lastSession.que_se_hizo }}</div>
        <div v-if="lastSession.proximos_pasos" class="text-xs text-muted mt-1">
          <span class="font-bold">Siguiente paso:</span> {{ lastSession.proximos_pasos }}
        </div>
      </div>
    </div>
    <div v-else class="space-y-3">
      <p class="text-sm text-muted">No hay una tarea marcada como “en progreso”.</p>
      <div v-if="pendingSuggestions.length > 0">
        <div class="text-xs font-medium text-muted mb-2">Podrías empezar por:</div>
        <div v-for="task in pendingSuggestions" :key="task.id" class="flex items-center gap-2 text-sm py-1">
          <StatusBadge :label="task.prioridad" :variant="priorityVariant(task.prioridad)" dot />
          <span>{{ task.titulo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TaskWithProject } from '@/types/task';
import type { Session } from '@/types/session';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { formatDateShort } from '@/lib/dates';

const props = defineProps<{
  tasks: TaskWithProject[];
  sessions: Session[];
}>();

const currentTask = computed(() => props.tasks.find((t) => t.estado === 'en_progreso'));

const lastSession = computed(() => {
  if (!currentTask.value) return null;
  return props.sessions
    .filter((s) => s.proyecto_id === currentTask.value!.proyecto_id)
    .sort((a, b) => b.inicio.localeCompare(a.inicio))[0] ?? null;
});

const pendingSuggestions = computed(() =>
  props.tasks
    .filter((t) => t.estado === 'pendiente' && t.prioridad === 'alta')
    .slice(0, 5)
);

function priorityVariant(p: string): 'danger' | 'warning' | 'info' {
  if (p === 'alta') return 'danger';
  if (p === 'media') return 'warning';
  return 'info';
}
</script>
