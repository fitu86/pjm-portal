<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold font-mono-data">Tareas</h1>
      <div class="flex items-center gap-2">
        <button
          v-for="v in ['kanban', 'table']"
          :key="v"
          :class="[
            'px-3 py-1 text-sm border-strong rounded transition-colors',
            viewMode === v ? 'bg-accent/20 text-accent' : 'bg-surface hover:bg-surface-elevated',
          ]"
          @click="viewMode = v as 'kanban' | 'table'"
        >
          {{ v === 'kanban' ? 'Kanban' : 'Tabla' }}
        </button>
      </div>
    </div>

    <TaskFilters v-model:filters="filters" />

    <LoadingState v-if="isLoading" message="Cargando tareas..." />
    <ErrorState v-else-if="error" @retry="refetch" />
    <EmptyState v-else-if="filteredTasks.length === 0" message="No hay tareas que coincidan." />
    <TaskKanban v-else-if="viewMode === 'kanban'" :tasks="filteredTasks" />
    <TaskTable v-else :tasks="filteredTasks" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchTasks } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import TaskKanban from '../components/TaskKanban.vue';
import TaskTable from '../components/TaskTable.vue';
import TaskFilters from '../components/TaskFilters.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

interface Filters {
  estado?: string;
  prioridad?: string;
  proyecto_id?: string;
  search?: string;
}

const filters = ref<Filters>({});
const viewMode = ref<'kanban' | 'table'>('kanban');

const { data: tasks, isLoading, error, refetch } = useQuery({
  queryKey: queryKeys.tasks,
  queryFn: ({ signal }) => fetchTasks(undefined, signal),
});

const filteredTasks = computed(() => {
  let result = tasks.value ?? [];
  if (filters.value.estado) {
    result = result.filter((t) => t.estado === filters.value.estado);
  }
  if (filters.value.prioridad) {
    result = result.filter((t) => t.prioridad === filters.value.prioridad);
  }
  if (filters.value.proyecto_id) {
    result = result.filter((t) => t.proyecto_id === filters.value.proyecto_id);
  }
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    result = result.filter((t) => t.titulo.toLowerCase().includes(q));
  }
  return result;
});
</script>
