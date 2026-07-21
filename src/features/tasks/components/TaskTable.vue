<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-strong text-xs text-muted font-mono-data">
          <th class="text-left p-2">Título</th>
          <th class="text-left p-2">Proyecto</th>
          <th class="text-left p-2">Estado</th>
          <th class="text-left p-2">Prioridad</th>
          <th class="text-left p-2">Tipo</th>
          <th class="text-left p-2">Progreso</th>
          <th class="text-left p-2">Inicio</th>
          <th class="text-left p-2">Objetivo</th>
          <th class="text-left p-2">Fin</th>
          <th class="text-left p-2">Crítico</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="task in tasks"
          :key="task.id"
          class="border-b border-border hover:bg-surface-elevated transition-colors"
        >
          <td class="p-2 font-bold">{{ task.titulo }}</td>
          <td class="p-2 text-muted font-mono-data text-xs">{{ task.proyecto_nombre ?? '--' }}</td>
          <td class="p-2"><StatusBadge :label="task.estado" :variant="statusVariant(task.estado)" dot /></td>
          <td class="p-2"><StatusBadge :label="task.prioridad" :variant="priorityVariant(task.prioridad)" /></td>
          <td class="p-2 text-muted text-xs">{{ task.task_type }}</td>
          <td class="p-2 font-mono-data">{{ task.progress != null ? `${task.progress}%` : '--' }}</td>
          <td class="p-2 font-mono-data text-xs">{{ task.start_date ?? '--' }}</td>
          <td class="p-2 font-mono-data text-xs">{{ task.target_date ?? '--' }}</td>
          <td class="p-2 font-mono-data text-xs">{{ task.end_date ?? '--' }}</td>
          <td class="p-2">
            <span v-if="task.critical_path" class="text-danger font-mono-data text-xs">SI</span>
            <span v-else class="text-muted">--</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithProject } from '@/types/task';
import StatusBadge from '@/components/common/StatusBadge.vue';

defineProps<{
  tasks: TaskWithProject[];
}>();

function statusVariant(s: string): 'danger' | 'warning' | 'info' | 'success' {
  if (s === 'bloqueada') return 'danger';
  if (s === 'en_progreso') return 'info';
  if (s === 'completada') return 'success';
  return 'warning';
}

function priorityVariant(p: string): 'danger' | 'warning' | 'info' {
  if (p === 'alta') return 'danger';
  if (p === 'media') return 'warning';
  return 'info';
}
</script>
