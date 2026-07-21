<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <h2 class="text-sm font-mono-data font-bold mb-3 uppercase tracking-wider">Matriz de riesgos</h2>
    <div v-if="risks.length === 0" class="text-sm text-muted">Sin datos para matriz.</div>
    <div v-else class="text-sm text-muted">
      <p>Matriz Probabilidad × Impacto</p>
      <p class="text-xs mt-1">Se muestra cuando los datos permiten clasificar.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Risk } from '@/types/risk';

defineProps<{
  risks: Risk[];
}>();
</script>
