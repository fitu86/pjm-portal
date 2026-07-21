<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="col in columns" :key="col.id" class="space-y-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm font-mono-data font-bold uppercase tracking-wider" :class="col.color">
          {{ col.label }}
        </span>
        <span class="text-xs text-muted font-mono-data">{{ columnTasks(col.id).length }}</span>
      </div>
      <TaskCard
        v-for="task in columnTasks(col.id)"
        :key="task.id"
        :task="task"
      />
      <div v-if="columnTasks(col.id).length === 0" class="text-xs text-muted text-center py-4">
        Vacío
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithProject } from '@/types/task';
import TaskCard from './TaskCard.vue';

const props = defineProps<{
  tasks: TaskWithProject[];
}>();

const columns = [
  { id: 'pendiente', label: 'Pendiente', color: 'text-warning' },
  { id: 'en_progreso', label: 'En progreso', color: 'text-info' },
  { id: 'bloqueada', label: 'Bloqueada', color: 'text-danger' },
  { id: 'completada', label: 'Completada', color: 'text-success' },
];

function columnTasks(colId: string) {
  return props.tasks.filter((t) => t.estado === colId);
}
</script>
