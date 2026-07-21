<template>
  <div
    :class="[
      'bg-surface border-strong rounded p-4 shadow-brutal transition-colors',
      clickable ? 'hover:bg-surface-elevated cursor-pointer' : '',
    ]"
    @click="clickable ? $emit('click') : undefined"
  >
    <div class="flex items-start justify-between mb-1">
      <span class="text-xs text-muted font-mono-data uppercase tracking-wider">{{ label }}</span>
      <slot name="icon" />
    </div>
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-bold font-mono-data" :class="valueColor">{{ displayValue }}</span>
      <span v-if="suffix" class="text-sm text-muted">{{ suffix }}</span>
    </div>
    <div v-if="subtitle" class="mt-1 text-xs text-muted">{{ subtitle }}</div>
    <div v-if="trend != null" class="mt-2 flex items-center gap-1 text-xs">
      <svg
        v-if="trend > 0"
        class="w-3 h-3 text-success"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      <svg
        v-else-if="trend < 0"
        class="w-3 h-3 text-danger"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span :class="trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-muted'">
        {{ Math.abs(trend) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: number | string | null;
    suffix?: string;
    subtitle?: string;
    trend?: number | null;
    color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    clickable?: boolean;
  }>(),
  {
    suffix: undefined,
    subtitle: undefined,
    trend: null,
    color: 'default',
    clickable: false,
  }
);

defineEmits<{ click: [] }>();

const displayValue = computed(() => {
  if (props.value == null) return '--';
  return props.value;
});

const valueColor = computed(() => {
  const map: Record<string, string> = {
    default: 'text-gray-100',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info',
  };
  return map[props.color] ?? map.default;
});
</script>
