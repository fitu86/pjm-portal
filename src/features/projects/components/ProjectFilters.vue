<template>
  <div class="flex flex-wrap items-center gap-2">
    <select
      :value="filters.estado"
      class="px-2 py-1 text-sm bg-surface-elevated border border-strong rounded"
      @change="update('estado', ($event.target as HTMLSelectElement).value || undefined)"
    >
      <option value="">Todos los estados</option>
      <option value="activo">Activo</option>
      <option value="pausado">Pausado</option>
      <option value="completado">Completado</option>
      <option value="archivado">Archivado</option>
    </select>

    <select
      :value="filters.tipo"
      class="px-2 py-1 text-sm bg-surface-elevated border border-strong rounded"
      @change="update('tipo', ($event.target as HTMLSelectElement).value || undefined)"
    >
      <option value="">Todos los tipos</option>
      <option value="tecnico">Técnico</option>
      <option value="personal">Personal</option>
      <option value="profesional">Profesional</option>
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
  filters: { estado?: string; tipo?: string; priority?: string; search?: string };
}>();

const emit = defineEmits<{
  'update:filters': [filters: typeof props.filters];
}>();

function update(key: string, value: string | undefined) {
  emit('update:filters', { ...props.filters, [key]: value });
}
</script>
