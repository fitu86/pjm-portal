<template>
  <span
    :class="[
      'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono-data rounded border',
      variantClasses,
    ]"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotColor" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
    dot?: boolean;
  }>(),
  {
    variant: 'dark',
    dot: false,
  }
);

const variantClasses = computed(() => {
  const map: Record<string, string> = {
    primary: 'bg-accent/20 text-accent border-accent/30',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
    info: 'bg-info/20 text-info border-info/30',
    dark: 'bg-surface-elevated text-gray-400 border-border-strong',
  };
  return map[props.variant] ?? map.dark;
});

const dotColor = computed(() => {
  const map: Record<string, string> = {
    primary: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    dark: 'bg-gray-500',
  };
  return map[props.variant] ?? map.dark;
});
</script>
