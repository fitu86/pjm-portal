<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold font-mono-data">Logros</h1>

    <LoadingState v-if="isLoading" message="Cargando logros..." />
    <ErrorState v-else-if="error" @retry="refetch" />
    <EmptyState v-else-if="!achievements?.length" message="Sin logros registrados." />
    <div v-else class="space-y-3">
      <div v-for="a in achievements" :key="a.id" class="bg-surface border-strong rounded p-4 shadow-brutal">
        <div class="flex items-center gap-2 mb-1">
          <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span class="font-bold">{{ a.titulo }}</span>
        </div>
        <div v-if="a.descripcion" class="text-sm text-muted ml-6">{{ a.descripcion }}</div>
        <div class="flex items-center gap-3 text-xs text-muted font-mono-data mt-2 ml-6">
          <span v-if="a.fecha">{{ formatDate(a.fecha) }}</span>
          <span v-if="a.proyecto_nombre">Proyecto: {{ a.proyecto_nombre }}</span>
          <span v-if="a.milestone_titulo">Hito: {{ a.milestone_titulo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { fetchAchievements } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import { formatDate } from '@/lib/dates';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const { data: achievements, isLoading, error, refetch } = useQuery({
  queryKey: queryKeys.achievements,
  queryFn: ({ signal }) => fetchAchievements(undefined, signal),
});
</script>
