<template>
  <div class="space-y-3">
    <div v-if="tasks.length === 0" class="text-sm text-muted">Sin tareas en el plan.</div>
    <table v-else class="w-full text-sm">
      <thead>
        <tr class="border-b border-strong text-xs text-muted font-mono-data">
          <th class="text-left p-2">Título</th>
          <th class="text-left p-2">Tipo</th>
          <th class="text-left p-2">Estado</th>
          <th class="text-left p-2">Inicio</th>
          <th class="text-left p-2">Objetivo</th>
          <th class="text-left p-2">Fin</th>
          <th class="text-left p-2">Progreso</th>
          <th class="text-left p-2">Crítico</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in sortedTasks"
          :key="t.id"
          class="border-b border-border"
        >
          <td class="p-2">
            <span :style="{ paddingLeft: `${(depth(t) * 16)}px` }" class="font-bold">{{ t.titulo }}</span>
          </td>
          <td class="p-2 text-muted">{{ t.task_type }}</td>
          <td class="p-2"><StatusBadge :label="t.estado" :variant="statusVariant(t.estado)" dot /></td>
          <td class="p-2 font-mono-data text-xs">{{ t.start_date ?? '--' }}</td>
          <td class="p-2 font-mono-data text-xs">{{ t.target_date ?? '--' }}</td>
          <td class="p-2 font-mono-data text-xs">{{ t.end_date ?? '--' }}</td>
          <td class="p-2 font-mono-data">{{ t.progress != null ? `${t.progress}%` : '--' }}</td>
          <td class="p-2">
            <span v-if="t.critical_path" class="text-danger font-mono-data text-xs">CRITICO</span>
            <span v-else class="text-muted">--</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/task';
import StatusBadge from '@/components/common/StatusBadge.vue';

const props = defineProps<{
  tasks: Task[];
}>();

const sortedTasks = computed(() =>
  [...props.tasks].sort((a, b) => {
    if (a.tarea_padre_id === b.id) return 1;
    if (b.tarea_padre_id === a.id) return -1;
    return (a.sequence_num ?? 0) - (b.sequence_num ?? 0);
  })
);

function depth(task: Task): number {
  let d = 0;
  let current = task;
  while (current.tarea_padre_id) {
    d++;
    const parent = props.tasks.find((t) => t.id === current.tarea_padre_id);
    if (!parent) break;
    current = parent;
  }
  return d;
}

function statusVariant(s: string): 'danger' | 'warning' | 'info' | 'success' {
  if (s === 'bloqueada') return 'danger';
  if (s === 'en_progreso') return 'info';
  if (s === 'completada') return 'success';
  return 'warning';
}
</script>
