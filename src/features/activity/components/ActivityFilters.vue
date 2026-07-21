<template>
  <div class="flex flex-wrap items-center gap-2">
    <select
      :value="filters.type"
      class="px-2 py-1 text-sm bg-surface-elevated border border-strong rounded"
      @change="update('type', ($event.target as HTMLSelectElement).value || undefined)"
    >
      <option value="">Todos los tipos</option>
      <option value="session">Sesión</option>
      <option value="progress">Avance</option>
      <option value="decision">Decisión</option>
      <option value="achievement">Logro</option>
      <option value="milestone">Hito</option>
    </select>

    <input
      :value="filters.search"
      type="text"
      placeholder="Buscar..."
      class="px-2 py-1 text-sm bg-surface-elevated border border-strong rounded font-mono-data"
      @input="update('search', ($event.target as HTMLInputElement).value || undefined)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  filters: { proyecto_id?: string; type?: string; search?: string };
}>();

const emit = defineEmits<{
  'update:filters': [filters: typeof props.filters];
}>();

function update(key: string, value: string | undefined) {
  emit('update:filters', { ...props.filters, [key]: value });
}
</script>
