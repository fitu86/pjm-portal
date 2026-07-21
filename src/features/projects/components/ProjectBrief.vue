<template>
  <div v-if="!brief" class="text-sm text-muted py-4">Sin brief registrado.</div>
  <div v-else class="space-y-4">
    <div v-for="field in fields" :key="field.key" class="bg-surface border-strong rounded p-4 shadow-brutal">
      <h3 class="text-sm font-mono-data font-bold mb-2 uppercase tracking-wider text-accent">{{ field.label }}</h3>
      <div v-if="field.value" class="text-sm prose prose-invert max-w-none" v-html="renderMarkdown(field.value)" />
      <div v-else class="text-sm text-muted">--</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import type { Brief } from '@/types/brief';

const props = defineProps<{
  brief: Brief | null;
}>();

const fields = computed(() => {
  if (!props.brief) return [];
  return [
    { key: 'problema', label: 'Problema', value: props.brief.problema },
    { key: 'objetivo', label: 'Objetivo', value: props.brief.objetivo },
    { key: 'alcance_incluye', label: 'Alcance (incluye)', value: props.brief.alcance_incluye },
    { key: 'alcance_excluye', label: 'Alcance (excluye)', value: props.brief.alcance_excluye },
    { key: 'criterios_exito', label: 'Criterios de éxito', value: props.brief.criterios_exito },
    { key: 'restricciones', label: 'Restricciones', value: props.brief.restricciones },
    { key: 'recursos', label: 'Recursos', value: props.brief.recursos },
    { key: 'referencias', label: 'Referencias', value: props.brief.referencias },
  ].filter((f) => f.value);
});

function renderMarkdown(text: string): string {
  const html = marked.parse(text) as string;
  return DOMPurify.sanitize(html);
}
</script>
