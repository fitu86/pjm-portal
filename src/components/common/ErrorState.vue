<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <svg class="w-12 h-12 mb-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
    <p class="text-sm mb-1 text-gray-200">{{ title }}</p>
    <p class="text-xs text-muted mb-4 max-w-sm">{{ message }}</p>
    <RetryButton v-if="showRetry" @retry="$emit('retry')" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import RetryButton from './RetryButton.vue';

withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    showRetry?: boolean;
  }>(),
  {
    title: 'Error al cargar',
    message: 'No se pudo obtener la información. Intenta de nuevo.',
    showRetry: true,
  }
);

defineEmits<{ retry: [] }>();
</script>
