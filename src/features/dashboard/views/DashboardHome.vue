<template>
  <LoadingState v-if="isLoading" message="Cargando dashboard..." />
  <ErrorState v-else-if="error" message="No se pudieron cargar los datos del dashboard." @retry="refetch" />
  <div v-else class="space-y-6 max-w-7xl">
    <section class="rounded-xl border border-border-strong bg-surface p-5 sm:p-6">
      <p class="text-sm font-medium text-accent">Tu espacio de trabajo</p>
      <div class="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-100">{{ greeting }}</h1>
          <p class="mt-1 text-sm text-muted">Aquí tienes lo importante para decidir en qué avanzar.</p>
        </div>
        <router-link to="/today" class="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
          Ver mi día
        </router-link>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <router-link to="/projects" class="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent hover:bg-surface-elevated">
        <p class="text-sm text-muted">Proyectos activos</p>
        <p class="mt-1 text-3xl font-bold">{{ activeProjects }}</p>
        <p class="mt-1 text-xs text-muted">Los frentes que tienes en marcha</p>
      </router-link>
      <router-link to="/tasks" class="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent hover:bg-surface-elevated">
        <p class="text-sm text-muted">Pendiente por atender</p>
        <p class="mt-1 text-3xl font-bold" :class="needsAttention > 0 ? 'text-warning' : 'text-success'">{{ needsAttention }}</p>
        <p class="mt-1 text-xs text-muted">{{ attentionMessage }}</p>
      </router-link>
      <router-link to="/tasks" class="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent hover:bg-surface-elevated">
        <p class="text-sm text-muted">Trabajo en curso</p>
        <p class="mt-1 text-3xl font-bold text-info">{{ inProgress }}</p>
        <p class="mt-1 text-xs text-muted">Tareas que ya empezaste</p>
      </router-link>
    </section>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <WorkingNow :tasks="(tasks ?? []) as Task[]" :sessions="(sessions ?? []) as Session[]" />
      <AttentionRequired
        :tasks="(tasks ?? []) as Task[]"
        :milestones="(milestones ?? []) as Milestone[]"
        :risks="(risks ?? []) as Risk[]"
        :projects="projects ?? []"
      />
    </div>

    <section class="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 class="font-semibold">Actividad reciente</h2>
          <p class="text-sm text-muted">Lo último que registraste en tus proyectos.</p>
        </div>
        <router-link to="/activity" class="shrink-0 text-sm font-medium text-accent hover:underline">Ver todo</router-link>
      </div>
      <RecentActivity :sessions="(sessions ?? []) as Session[]" :decisions="(decisions ?? []) as Decision[]" :achievements="(achievements ?? []) as Achievement[]" :milestones="(milestones ?? []) as Milestone[]" :progress="(progressItems ?? []) as Progress[]" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchProjects, fetchTasks, fetchSessions, fetchRisks, fetchDecisions, fetchAchievements, fetchMilestones, fetchProgress } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Risk } from '@/types/risk';
import type { Decision } from '@/types/decision';
import type { Achievement } from '@/types/achievement';
import type { Milestone } from '@/types/milestone';
import type { Progress } from '@/types/progress';
import WorkingNow from '../components/WorkingNow.vue';
import AttentionRequired from '../components/AttentionRequired.vue';
import RecentActivity from '../components/RecentActivity.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';

const { data: projects, isLoading: pLoading, error: pError, refetch: pRefetch } = useQuery({
  queryKey: queryKeys.projects,
  queryFn: ({ signal }) => fetchProjects(undefined, signal),
});

const { data: tasks, isLoading: tLoading, error: tError, refetch: tRefetch } = useQuery({
  queryKey: queryKeys.tasks,
  queryFn: ({ signal }) => fetchTasks(undefined, signal),
});

const { data: sessions } = useQuery({
  queryKey: queryKeys.sessions,
  queryFn: ({ signal }) => fetchSessions(undefined, signal),
});

const { data: risks } = useQuery({
  queryKey: queryKeys.risks,
  queryFn: ({ signal }) => fetchRisks(undefined, signal),
});

const { data: decisions } = useQuery({
  queryKey: queryKeys.decisions,
  queryFn: ({ signal }) => fetchDecisions(undefined, signal),
});

const { data: achievements } = useQuery({
  queryKey: queryKeys.achievements,
  queryFn: ({ signal }) => fetchAchievements(undefined, signal),
});

const { data: milestones } = useQuery({
  queryKey: queryKeys.milestones,
  queryFn: ({ signal }) => fetchMilestones(undefined, signal),
});

const { data: progressItems } = useQuery({
  queryKey: queryKeys.progress,
  queryFn: ({ signal }) => fetchProgress(undefined, signal),
});

const isLoading = computed(() => pLoading.value || tLoading.value);
const error = computed(() => pError.value || tError.value);
const activeProjects = computed(() => projects.value?.filter((project) => project.estado === 'activo').length ?? 0);
const inProgress = computed(() => tasks.value?.filter((task) => task.estado === 'en_progreso').length ?? 0);
const needsAttention = computed(() =>
  tasks.value?.filter((task) => task.estado === 'bloqueada' || task.prioridad === 'alta').length ?? 0
);
const attentionMessage = computed(() => {
  if (needsAttention.value === 0) return 'No hay tareas urgentes ahora mismo';
  return needsAttention.value === 1 ? 'Hay una tarea que conviene revisar' : 'Hay tareas que conviene revisar primero';
});
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
});

function refetch() {
  pRefetch();
  tRefetch();
}
</script>
