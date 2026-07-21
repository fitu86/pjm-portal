<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold font-mono-data">Actividad</h1>

    <ActivityFilters v-model:filters="filters" />

    <LoadingState v-if="isLoading" message="Cargando actividad..." />
    <ErrorState v-else-if="error" @retry="refetch" />
    <EmptyState v-else-if="sortedItems.length === 0" message="Sin actividad registrada." />
    <div v-else class="space-y-1">
      <div v-for="(group, date) in groupedItems" :key="date" class="mb-4">
        <h2 class="text-sm font-mono-data font-bold text-muted mb-2 sticky top-0 bg-background py-1">
          {{ date }}
        </h2>
        <div class="space-y-2 pl-4 border-l-2 border-strong">
          <ActivityItem v-for="item in group" :key="`${item.type}-${item.id}`" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchSessions, fetchProgress, fetchDecisions, fetchAchievements, fetchMilestones } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import type { ActivityItem as ActivityItemType } from '@/types/activity';
import ActivityFilters from '../components/ActivityFilters.vue';
import ActivityItemView from '../components/ActivityItem.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { formatDate } from '@/lib/dates';

interface Filters {
  proyecto_id?: string;
  type?: string;
  search?: string;
}

const filters = ref<Filters>({});

const { data: sessions, isLoading: sLoading, error: sError, refetch: sRefetch } = useQuery({
  queryKey: queryKeys.sessions,
  queryFn: ({ signal }) => fetchSessions(undefined, signal),
});

const { data: progressItems } = useQuery({
  queryKey: queryKeys.progress,
  queryFn: ({ signal }) => fetchProgress(undefined, signal),
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

const isLoading = computed(() => sLoading.value);
const error = computed(() => sError.value);

function refetch() {
  sRefetch();
}

const allItems = computed<ActivityItemType[]>(() => {
  const result: ActivityItemType[] = [];

  for (const s of sessions.value ?? []) {
    result.push({
      id: s.id,
      type: 'session',
      title: s.que_se_hizo ?? 'Sesión',
      description: s.proximos_pasos ?? undefined,
      occurredAt: s.inicio,
      project: s.proyecto_id ? { id: s.proyecto_id, name: s.proyecto_nombre ?? '' } : undefined,
    });
  }

  for (const p of progressItems.value ?? []) {
    result.push({
      id: p.id,
      type: 'progress',
      title: p.descripcion ?? 'Avance',
      description: p.porcentaje != null ? `${p.porcentaje}%` : undefined,
      occurredAt: p.date_created,
    });
  }

  for (const d of decisions.value ?? []) {
    result.push({
      id: d.id,
      type: 'decision',
      title: d.titulo,
      description: d.decision ?? undefined,
      occurredAt: d.date_created,
      project: d.proyecto_id ? { id: d.proyecto_id, name: d.proyecto_nombre ?? '' } : undefined,
    });
  }

  for (const a of achievements.value ?? []) {
    if (a.fecha) {
      result.push({
        id: a.id,
        type: 'achievement',
        title: a.titulo,
        description: a.descripcion ?? undefined,
        occurredAt: a.fecha,
        project: a.proyecto_id ? { id: a.proyecto_id, name: a.proyecto_nombre ?? '' } : undefined,
      });
    }
  }

  for (const m of milestones.value ?? []) {
    if (m.fecha) {
      result.push({
        id: m.id,
        type: 'milestone',
        title: m.titulo,
        description: m.descripcion ?? undefined,
        occurredAt: m.fecha,
        project: m.proyecto_id ? { id: m.proyecto_id, name: m.proyecto_nombre ?? '' } : undefined,
      });
    }
  }

  return result;
});

const sortedItems = computed(() => {
  let result = allItems.value.filter((i) => i.occurredAt);

  if (filters.value.type) {
    result = result.filter((i) => i.type === filters.value.type);
  }
  if (filters.value.proyecto_id) {
    result = result.filter((i) => i.project?.id === filters.value.proyecto_id);
  }
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    result = result.filter(
      (i) => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
    );
  }

  return result.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
});

const groupedItems = computed(() => {
  const groups: Record<string, ActivityItemType[]> = {};
  for (const item of sortedItems.value) {
    const date = formatDate(item.occurredAt, 'dd MMMM yyyy');
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  }
  return groups;
});

const ActivityItem = ActivityItemView;
</script>
