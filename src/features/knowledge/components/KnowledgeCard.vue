<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <div class="flex items-center gap-2 mb-2">
      <span class="font-mono-data text-xs text-accent border border-accent/30 rounded px-1.5 py-0.5">
        {{ knowledge.tipo }}
      </span>
      <span class="font-bold">{{ knowledge.titulo }}</span>
    </div>
    <p v-if="knowledge.summary" class="text-sm text-muted mb-2">{{ knowledge.summary }}</p>
    <div class="flex items-center gap-2 text-xs font-mono-data mt-2">
      <span
        :class="[
          'px-1.5 py-0.5 rounded',
          knowledge.madurez === 'adoptado' ? 'bg-green-500/20 text-green-400' : 'bg-surface-elevated text-gray-400',
        ]"
      >
        {{ knowledge.madurez }}
      </span>
      <span
        :class="[
          'px-1.5 py-0.5 rounded',
          knowledge.confianza === 'verificado' ? 'bg-blue-500/20 text-blue-400' : 'bg-surface-elevated text-gray-400',
        ]"
      >
        {{ knowledge.confianza }}
      </span>
    </div>
    <div class="flex items-center gap-3 text-xs text-muted font-mono-data mt-2">
      <span v-if="knowledge.sources?.length">Fuentes: {{ knowledge.sources.map((s) => s.titulo).join(', ') }}</span>
      <span v-if="knowledge.proyecto_nombre">Proyecto: {{ knowledge.proyecto_nombre }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KnowledgeWithProject } from '@/types/knowledge';

defineProps<{
  knowledge: KnowledgeWithProject;
}>();
</script>
