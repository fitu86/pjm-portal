<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold font-mono-data">Decisiones</h1>

    <LoadingState v-if="isLoading" message="Cargando decisiones..." />
    <ErrorState v-else-if="error" @retry="refetch" />
    <EmptyState v-else-if="!decisions?.length" message="Sin decisiones registradas." />
    <div v-else class="space-y-3">
      <div v-for="d in decisions" :key="d.id" class="bg-surface border-strong rounded p-4 shadow-brutal">
        <div class="flex items-center gap-2 mb-2">
          <span v-if="d.adr_number" class="font-mono-data text-xs text-accent border border-accent/30 rounded px-1.5 py-0.5">
            {{ d.adr_number }}
          </span>
          <span class="font-bold">{{ d.titulo }}</span>
          <StatusBadge v-if="d.estado" :label="d.estado" variant="info" dot />
        </div>
        <div v-if="d.contexto" class="text-sm mb-2">
          <span class="text-xs text-muted font-mono-data">Contexto:</span>
          <p class="text-muted">{{ d.contexto }}</p>
        </div>
        <div v-if="d.decision" class="text-sm mb-2">
          <span class="text-xs text-muted font-mono-data">Decisión:</span>
          <p>{{ d.decision }}</p>
        </div>
        <div v-if="d.consecuencias" class="text-sm mb-2">
          <span class="text-xs text-muted font-mono-data">Consecuencias:</span>
          <p class="text-muted">{{ d.consecuencias }}</p>
        </div>
        <div class="flex items-center gap-3 text-xs text-muted font-mono-data mt-2">
          <span v-if="d.proyecto_nombre">Proyecto: {{ d.proyecto_nombre }}</span>
          <span>Creado: {{ formatDate(d.date_created) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { fetchDecisions } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import { formatDate } from '@/lib/dates';
import StatusBadge from '@/components/common/StatusBadge.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const { data: decisions, isLoading, error, refetch } = useQuery({
  queryKey: queryKeys.decisions,
  queryFn: ({ signal }) => fetchDecisions(undefined, signal),
});
</script>
