<template>
  <div class="relative">
    <input
      v-model="query"
      type="text"
      placeholder="Buscar..."
      class="w-48 lg:w-64 px-3 py-1.5 text-sm bg-surface-elevated border border-strong rounded font-mono-data focus:outline-none focus:border-accent transition-colors"
      @keydown.escape="query = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');
</script>
