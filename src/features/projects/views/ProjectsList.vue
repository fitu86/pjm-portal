<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold font-mono-data">Portafolio</h1>
      <div class="flex items-center gap-2">
        <button
          v-for="view in ['grid', 'table']"
          :key="view"
          :class="[
            'px-3 py-1 text-sm border-strong rounded transition-colors',
            currentView === view ? 'bg-accent/20 text-accent' : 'bg-surface hover:bg-surface-elevated',
          ]"
          @click="currentView = view as 'grid' | 'table'"
        >
          {{ view === 'grid' ? 'Cuadrícula' : 'Tabla' }}
        </button>
      </div>
    </div>

    <ProjectFilters v-model:filters="filters" />

    <LoadingState v-if="isLoading" message="Cargando proyectos..." />
    <ErrorState v-else-if="error" @retry="refetch" />
    <EmptyState v-else-if="filteredProjects.length === 0" message="No hay proyectos que coincidan con los filtros." />
    <ProjectGrid
      v-else-if="currentView === 'grid'"
      :projects="filteredProjects"
      :tasks="(tasks ?? [])"
      :risks="(risks ?? [])"
      :sessions="(sessions ?? [])"
    />
    <ProjectTable
      v-else
      :projects="filteredProjects"
      :tasks="(tasks ?? [])"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchProjects, fetchTasks, fetchRisks, fetchSessions } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import ProjectGrid from '../components/ProjectGrid.vue';
import ProjectTable from '../components/ProjectTable.vue';
import ProjectFilters from '../components/ProjectFilters.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

interface Filters {
  estado?: string;
  tipo?: string;
  priority?: string;
  search?: string;
}

const filters = ref<Filters>({});

const currentView = ref<'grid' | 'table'>('grid');

const { data: projects, isLoading, error, refetch } = useQuery({
  queryKey: queryKeys.projects,
  queryFn: ({ signal }) => fetchProjects(undefined, signal),
});

const { data: tasks } = useQuery({
  queryKey: queryKeys.tasks,
  queryFn: ({ signal }) => fetchTasks(undefined, signal),
});

const { data: risks } = useQuery({
  queryKey: queryKeys.risks,
  queryFn: ({ signal }) => fetchRisks(undefined, signal),
});

const { data: sessions } = useQuery({
  queryKey: queryKeys.sessions,
  queryFn: ({ signal }) => fetchSessions(undefined, signal),
});

const filteredProjects = computed(() => {
  let result = projects.value ?? [];
  if (filters.value.estado) {
    result = result.filter((p) => p.estado === filters.value.estado);
  }
  if (filters.value.tipo) {
    result = result.filter((p) => p.tipo === filters.value.tipo);
  }
  if (filters.value.priority) {
    result = result.filter((p) => p.priority === filters.value.priority);
  }
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    result = result.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.code?.toLowerCase().includes(q)
    );
  }
  return result;
});
</script>
