<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-strong text-xs text-muted font-mono-data">
          <th class="text-left p-2">Código</th>
          <th class="text-left p-2">Nombre</th>
          <th class="text-left p-2">Estado</th>
          <th class="text-left p-2">Tipo</th>
          <th class="text-left p-2">Prioridad</th>
          <th class="text-left p-2">Progreso</th>
          <th class="text-left p-2">Tareas</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
          class="border-b border-border hover:bg-surface-elevated cursor-pointer transition-colors"
          @click="router.push(`/projects/${project.id}`)"
        >
          <td class="p-2 font-mono-data text-accent">{{ project.code ?? '--' }}</td>
          <td class="p-2 font-bold">{{ project.nombre }}</td>
          <td class="p-2"><StatusBadge :label="project.estado" :variant="estadoVariant(project.estado)" dot /></td>
          <td class="p-2"><StatusBadge :label="project.tipo" /></td>
          <td class="p-2 text-muted">{{ project.priority ?? '--' }}</td>
          <td class="p-2 font-mono-data">{{ projectProgressVal(project.id) }}%</td>
          <td class="p-2 font-mono-data text-muted">{{ projectTasks(project.id).length }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { projectProgress } from '@/lib/metrics';

const props = defineProps<{
  projects: Project[];
  tasks: Task[];
}>();

const router = useRouter();

function projectTasks(id: string) {
  return props.tasks.filter((t) => t.proyecto_id === id);
}

function projectProgressVal(id: string) {
  return projectProgress(projectTasks(id));
}

function estadoVariant(e: string): 'success' | 'warning' | 'info' | 'dark' {
  if (e === 'activo') return 'success';
  if (e === 'pausado') return 'warning';
  if (e === 'completado') return 'info';
  return 'dark';
}
</script>
