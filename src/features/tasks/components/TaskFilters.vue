<template>
  <div class="flex flex-wrap items-center gap-2">
    <select
      :value="filters.estado"
      class="px-2 py-1 text-sm bg-surface-elevated border border-strong rounded"
      @change="update('estado', ($event.target as HTMLSelectElement).value || undefined)"
    >
      <option value="">Todos los estados</option>
      <option value="pendiente">Pendiente</option>
      <option value="en_progreso">En progreso</option>
      <option value="completada">Completada</option>
      <option value="bloqueada">Bloqueada</option>
    </select>

    <select
      :value="filters.prioridad"
      class="px-2 py-1 text-sm bg-surface-elevated border border-strong rounded"
      @change="update('prioridad', ($event.target as HTMLSelectElement).value || undefined)"
    >
      <option value="">Todas las prioridades</option>
      <option value="alta">Alta</option>
      <option value="media">Media</option>
      <option value="baja">Baja</option>
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
  filters: { estado?: string; prioridad?: string; proyecto_id?: string; search?: string };
}>();

const emit = defineEmits<{
  'update:filters': [filters: typeof props.filters];
}>();

function update(key: string, value: string | undefined) {
  emit('update:filters', { ...props.filters, [key]: value });
}
</script>
