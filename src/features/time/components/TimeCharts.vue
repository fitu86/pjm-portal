<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <h2 class="text-sm font-mono-data font-bold mb-3 uppercase tracking-wider">Gráficas de tiempo</h2>
    <div class="text-sm text-muted">
      <p>Gráficas de tiempo (barras por proyecto, actividad diaria, planeado vs. realizado).</p>
      <p class="text-xs mt-2">Disponibles con datos suficientes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Session } from '@/types/session';
import type { TimeBlock } from '@/types/time-block';

defineProps<{
  sessions: Session[];
  timeBlocks: TimeBlock[];
}>();
</script>
