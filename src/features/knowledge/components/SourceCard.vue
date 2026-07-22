<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <div class="flex items-center gap-2 mb-2">
      <span class="font-mono-data text-xs text-accent border border-accent/30 rounded px-1.5 py-0.5">
        {{ source.tipo }}
      </span>
      <span class="font-bold">{{ source.titulo }}</span>
    </div>
    <p v-if="source.resumen" class="text-sm text-muted mb-2">{{ source.resumen }}</p>
    <div class="flex items-center gap-3 text-xs text-muted font-mono-data mt-2">
      <span v-if="source.autor">Autor: {{ source.autor }}</span>
      <span v-if="source.url" class="text-accent hover:underline cursor-pointer" @click="openUrl">
        Ver fuente
      </span>
      <span v-if="source.projects?.length">Proyectos: {{ source.projects.map((p) => p.nombre).join(', ') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SourceWithProject } from '@/types/source';

const props = defineProps<{
  source: SourceWithProject;
}>();

function openUrl() {
  if (props.source.url) {
    window.open(props.source.url, '_blank', 'noopener,noreferrer');
  }
}
</script>
