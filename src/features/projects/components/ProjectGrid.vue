<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <div
      v-for="project in projects"
      :key="project.id"
      class="group cursor-pointer rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent hover:bg-surface-elevated"
      @click="router.push(`/projects/${project.id}`)"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p v-if="project.code" class="text-xs font-medium text-accent">{{ project.code }}</p>
          <h2 class="mt-1 truncate text-lg font-semibold">{{ project.nombre }}</h2>
          <p class="mt-1 line-clamp-2 text-sm text-muted">{{ project.vision || project.descripcion || 'Sin descripción todavía.' }}</p>
        </div>
        <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" :class="healthClass(project.id)">{{ healthLabel(project.id) }}</span>
      </div>

      <div class="mt-5">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">Avance estimado</span>
          <span class="font-semibold">{{ projectProgressVal(project.id) }}%</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-surface-elevated">
          <div class="h-full rounded-full bg-accent" :style="{ width: `${projectProgressVal(project.id)}%` }" />
        </div>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
        <div><p class="text-muted">Tareas</p><p class="mt-1 font-semibold">{{ projectTasks(project.id).length }}</p></div>
        <div><p class="text-muted">Completadas</p><p class="mt-1 font-semibold text-success">{{ completedCount(project.id) }}</p></div>
        <div><p class="text-muted">Pendiente</p><p class="mt-1 font-semibold" :class="blockedCount(project.id) ? 'text-danger' : 'text-gray-100'">{{ pendingCount(project.id) }}</p></div>
      </div>

      <div v-if="nextTask(project.id)" class="mt-4 rounded-lg bg-surface-elevated px-3 py-2 text-sm">
        <span class="text-muted">Siguiente tarea:</span>
        <span class="ml-1 font-medium">{{ nextTask(project.id)?.titulo }}</span>
      </div>
      <p v-else class="mt-4 text-sm text-muted">Aún no hay una siguiente tarea definida.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Risk } from '@/types/risk';
import { projectProgress, projectStatus } from '@/lib/metrics';

const props = defineProps<{
  projects: Project[];
  tasks: Task[];
  sessions: Session[];
  risks: Risk[];
}>();

const router = useRouter();

function projectTasks(id: string) {
  return props.tasks.filter((t) => t.proyecto_id === id);
}

function completedCount(id: string) {
  return projectTasks(id).filter((t) => t.estado === 'completada').length;
}

function blockedCount(id: string) {
  return projectTasks(id).filter((t) => t.estado === 'bloqueada').length;
}

function pendingCount(id: string) {
  return projectTasks(id).filter((t) => t.estado !== 'completada').length;
}

function projectProgressVal(id: string) {
  return projectProgress(projectTasks(id));
}

function nextTask(id: string) {
  return projectTasks(id)
    .filter((task) => task.estado !== 'completada')
    .sort((a, b) => {
      const weight = (task: Task) => task.estado === 'bloqueada' ? 0 : task.prioridad === 'alta' ? 1 : task.estado === 'en_progreso' ? 2 : 3;
      return weight(a) - weight(b);
    })[0];
}

function healthLabel(id: string): string {
  const status = projectStatus(
    props.projects.find((project) => project.id === id)!,
    projectTasks(id),
    props.risks.filter((risk) => risk.proyecto_id === id)
  );
  const labels: Record<string, string> = {
    healthy: 'Va bien', blocked: 'Tiene bloqueos', at_risk: 'Requiere atención', stale: 'Sin movimiento', unplanned: 'Sin plan', completed: 'Terminado',
  };
  return labels[status];
}

function healthClass(id: string): string {
  const label = healthLabel(id);
  if (label === 'Va bien' || label === 'Terminado') return 'bg-success/15 text-success';
  if (label === 'Tiene bloqueos' || label === 'Requiere atención') return 'bg-danger/15 text-danger';
  return 'bg-warning/15 text-warning';
}
</script>
