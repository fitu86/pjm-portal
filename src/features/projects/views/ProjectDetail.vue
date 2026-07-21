<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <router-link to="/projects" class="text-muted hover:text-gray-200 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <div v-if="project">
        <h1 class="text-xl font-bold font-mono-data">
          <span v-if="project.code" class="text-accent">{{ project.code }}</span>
          {{ project.nombre }}
        </h1>
        <div class="flex items-center gap-2 mt-1">
          <StatusBadge :label="project.estado" :variant="estadoVariant(project.estado)" dot />
          <StatusBadge :label="project.tipo" />
          <span v-if="project.priority" class="text-xs text-muted font-mono-data">{{ project.priority }}</span>
        </div>
      </div>
    </div>

    <LoadingState v-if="!project" message="Cargando proyecto..." />
    <template v-else>
      <ProjectTabs :project-id="projectId!" :tasks="(tasks ?? [])" :sessions="(sessions ?? [])" :risks="(risks ?? [])" :decisions="(decisions ?? [])" :achievements="(achievements ?? [])" :milestones="(milestones ?? [])" :brief="(brief ?? null)" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { fetchProjectById, fetchTasksByProject, fetchSessions, fetchRisks, fetchDecisions, fetchAchievements, fetchMilestones, fetchBriefByProject } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import ProjectTabs from '../components/ProjectTabs.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import LoadingState from '@/components/common/LoadingState.vue';

const route = useRoute();
const projectId = computed(() => route.params.projectId as string);

const { data: project } = useQuery({
  queryKey: computed(() => queryKeys.projectDetail(projectId.value)),
  queryFn: ({ signal }) => fetchProjectById(projectId.value, signal),
});

const { data: tasks } = useQuery({
  queryKey: computed(() => queryKeys.tasksByProject(projectId.value)),
  queryFn: ({ signal }) => fetchTasksByProject(projectId.value, signal),
});

const { data: sessions } = useQuery({
  queryKey: queryKeys.sessions,
  queryFn: ({ signal }) => fetchSessions({ filter: { proyecto_id: projectId.value } }, signal),
});

const { data: risks } = useQuery({
  queryKey: computed(() => queryKeys.risksByProject(projectId.value)),
  queryFn: ({ signal }) => fetchRisks({ filter: { proyecto_id: projectId.value } }, signal),
});

const { data: decisions } = useQuery({
  queryKey: computed(() => queryKeys.decisionsByProject(projectId.value)),
  queryFn: ({ signal }) => fetchDecisions({ filter: { proyecto_id: projectId.value } }, signal),
});

const { data: achievements } = useQuery({
  queryKey: computed(() => queryKeys.achievementsByProject(projectId.value)),
  queryFn: ({ signal }) => fetchAchievements({ filter: { proyecto_id: projectId.value } }, signal),
});

const { data: milestones } = useQuery({
  queryKey: computed(() => queryKeys.milestonesByProject(projectId.value)),
  queryFn: ({ signal }) => fetchMilestones({ filter: { proyecto_id: projectId.value } }, signal),
});

const { data: brief } = useQuery({
  queryKey: computed(() => queryKeys.projectBrief(projectId.value)),
  queryFn: ({ signal }) => fetchBriefByProject(projectId.value, signal),
});

function estadoVariant(e: string): 'success' | 'warning' | 'info' | 'dark' {
  if (e === 'activo') return 'success';
  if (e === 'pausado') return 'warning';
  if (e === 'completado') return 'info';
  return 'dark';
}
</script>
