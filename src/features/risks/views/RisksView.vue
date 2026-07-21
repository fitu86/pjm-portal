<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold font-mono-data">Riesgos</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 class="text-sm font-mono-data font-bold mb-3 uppercase tracking-wider">Tabla de riesgos</h2>
        <LoadingState v-if="isLoading" message="Cargando riesgos..." />
        <ErrorState v-else-if="error" @retry="refetch" />
        <EmptyState v-else-if="!risks?.length" message="Sin riesgos registrados." />
        <div v-else class="space-y-2">
          <div v-for="r in risks" :key="r.id" class="bg-surface border-strong rounded p-3 shadow-brutal">
            <div class="flex items-center gap-2 mb-1">
              <StatusBadge :label="r.estado ?? 'abierto'" :variant="estadoVariant(r.estado)" dot />
              <span class="font-bold text-sm">{{ r.titulo }}</span>
            </div>
            <div v-if="r.descripcion" class="text-xs text-muted mb-1">{{ r.descripcion }}</div>
            <div class="flex items-center gap-3 text-xs font-mono-data text-muted">
              <span>Impacto: {{ r.impacto ?? '--' }}</span>
              <span>Probabilidad: {{ r.probabilidad ?? '--' }}</span>
              <span v-if="r.proyecto_nombre">Proyecto: {{ r.proyecto_nombre }}</span>
            </div>
            <div v-if="r.mitigacion" class="text-xs text-muted mt-1">Mitigación: {{ r.mitigacion }}</div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <RiskMatrix :risks="risks ?? []" />
        <RiskPriorityList :risks="risks ?? []" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { fetchRisks } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import RiskMatrix from '../components/RiskMatrix.vue';
import RiskPriorityList from '../components/RiskPriorityList.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const { data: risks, isLoading, error, refetch } = useQuery({
  queryKey: queryKeys.risks,
  queryFn: ({ signal }) => fetchRisks(undefined, signal),
});

function estadoVariant(e: string | null): 'danger' | 'warning' | 'success' | 'info' | 'dark' {
  if (e === 'critico' || e === 'alto') return 'danger';
  if (e === 'medio' || e === 'en_progreso') return 'warning';
  if (e === 'cerrado' || e === 'mitigado') return 'success';
  return 'dark';
}
</script>
