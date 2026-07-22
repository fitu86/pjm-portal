<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <div class="flex items-center gap-2 mb-2">
      <StatusBadge :label="experiment.estado" :variant="statusVariant" dot />
      <span class="font-bold">{{ experiment.titulo }}</span>
    </div>
    <div v-if="experiment.hipotesis" class="text-sm mb-2">
      <span class="text-xs text-muted font-mono-data">Hipótesis:</span>
      <p>{{ experiment.hipotesis }}</p>
    </div>
    <div v-if="experiment.resultado" class="text-sm mb-2">
      <span class="text-xs text-muted font-mono-data">Resultado:</span>
      <p class="text-muted">{{ experiment.resultado }}</p>
    </div>
    <div class="flex items-center gap-3 text-xs text-muted font-mono-data mt-2">
      <span v-if="experiment.knowledge_titulo">Conocimiento: {{ experiment.knowledge_titulo }}</span>
      <span v-if="experiment.proyecto_nombre">Proyecto: {{ experiment.proyecto_nombre }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ExperimentWithProject } from '@/types/experiment';
import StatusBadge from '@/components/common/StatusBadge.vue';

const props = defineProps<{
  experiment: ExperimentWithProject;
}>();

const statusVariant = computed(() => {
  const map: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
    idea: 'info',
    planeado: 'info',
    en_progreso: 'warning',
    completado: 'success',
    cancelado: 'danger',
  };
  return map[props.experiment.estado] ?? 'info';
});
</script>
