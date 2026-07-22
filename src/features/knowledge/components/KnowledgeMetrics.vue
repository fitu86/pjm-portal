<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="bg-surface border-strong rounded p-3 shadow-brutal">
      <div class="text-2xl font-bold font-mono-data text-accent">{{ totalSources }}</div>
      <div class="text-xs text-muted font-mono-data">Fuentes</div>
    </div>
    <div class="bg-surface border-strong rounded p-3 shadow-brutal">
      <div class="text-2xl font-bold font-mono-data text-accent">{{ totalKnowledge }}</div>
      <div class="text-xs text-muted font-mono-data">Conocimiento</div>
    </div>
    <div class="bg-surface border-strong rounded p-3 shadow-brutal">
      <div class="text-2xl font-bold font-mono-data text-accent">{{ totalExperiments }}</div>
      <div class="text-xs text-muted font-mono-data">Experimentos</div>
    </div>
    <div class="bg-surface border-strong rounded p-3 shadow-brutal">
      <div class="text-2xl font-bold font-mono-data text-accent">{{ adoptionRate }}%</div>
      <div class="text-xs text-muted font-mono-data">Adopción</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalSources: number;
  totalKnowledge: number;
  totalExperiments: number;
  adoptionRate: number;
}>();
</script>
