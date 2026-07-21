<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClasses,
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-100 text-blue-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'danger':
      return 'bg-red-100 text-red-800';
    case 'info':
      return 'bg-purple-100 text-purple-800';
    case 'dark':
      return 'bg-gray-700 text-white';
    default:
      return 'bg-blue-100 text-blue-800';
  }
});
</script>
