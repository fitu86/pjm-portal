<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <h2 class="text-sm font-mono-data font-bold mb-3 uppercase tracking-wider">Riesgos críticos</h2>
    <div v-if="criticalRisks.length === 0" class="text-sm text-muted">Sin riesgos críticos.</div>
    <ul v-else class="space-y-2">
      <li v-for="r in criticalRisks" :key="r.id" class="flex items-start gap-2">
        <StatusBadge label="crítico" variant="danger" dot />
        <div>
          <div class="text-sm font-bold">{{ r.titulo }}</div>
          <div class="text-xs text-muted">{{ r.impacto ?? '--' }} / {{ r.probabilidad ?? '--' }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Risk } from '@/types/risk';
import StatusBadge from '@/components/common/StatusBadge.vue';

const props = defineProps<{
  risks: Risk[];
}>();

const criticalRisks = computed(() =>
  props.risks.filter(
    (r) =>
      r.estado !== 'cerrado' &&
      r.estado !== 'mitigado' &&
      (r.impacto?.toLowerCase() === 'alto' || r.impacto?.toLowerCase() === 'crítico' || r.probabilidad?.toLowerCase() === 'alta')
  )
);
</script>
