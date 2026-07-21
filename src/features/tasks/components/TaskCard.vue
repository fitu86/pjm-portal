<template>
  <div
    :class="[
      'bg-surface border-strong rounded p-3 shadow-brutal text-sm',
      isOverdue ? 'border-danger/50' : '',
    ]"
  >
    <div class="font-bold mb-1 truncate">{{ task.titulo }}</div>
    <div v-if="task.proyecto_nombre" class="text-xs text-muted mb-2 truncate">
      {{ task.proyecto_nombre }}
      <span v-if="task.proyecto_code" class="font-mono-data">({{ task.proyecto_code }})</span>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <StatusBadge :label="task.prioridad" :variant="priorityVariant(task.prioridad)" dot />
      <span v-if="task.progress != null" class="font-mono-data text-xs text-muted">{{ task.progress }}%</span>
      <span v-if="task.target_date" class="font-mono-data text-xs" :class="isOverdue ? 'text-danger' : 'text-muted'">
        {{ formatDateShort(task.target_date) }}
      </span>
    </div>
    <div v-if="task.critical_path" class="mt-1">
      <span class="text-danger font-mono-data text-xs">CRITICO</span>
    </div>
    <div v-if="task.blocked_by_titulo" class="mt-1 text-xs text-muted">
      Bloqueado por: {{ task.blocked_by_titulo }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TaskWithProject } from '@/types/task';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { formatDateShort } from '@/lib/dates';
import { isTaskOverdue } from '@/lib/metrics';

const props = defineProps<{
  task: TaskWithProject;
}>();

const isOverdue = computed(() => isTaskOverdue(props.task));

function priorityVariant(p: string): 'danger' | 'warning' | 'info' {
  if (p === 'alta') return 'danger';
  if (p === 'media') return 'warning';
  return 'info';
}
</script>
