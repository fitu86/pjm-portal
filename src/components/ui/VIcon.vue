<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="sizeClasses"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path stroke-linecap="round" stroke-linejoin="round" :d="path" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string; // This would typically map to an icon name, e.g., "M10 19l-7-7m0 0l7-7m-7 7h18" for arrow-left
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

// This is a placeholder for actual icon path data. In a real app, you'd likely
// have an object mapping icon names to SVG path data, or use an icon library.
const iconPaths: Record<string, string> = {
  'arrow-left': 'M10 19l-7-7m0 0l7-7m-7 7h18',
  'arrow-right': 'M14 5l7 7m0 0l-7 7m7-7H3',
  check: 'M5 13l4 4L19 7',
  x: 'M6 18L18 6M6 6l12 12',
  edit: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  UserIcon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16-10a8 8 0 11-16 0 8 8 0 0116 0z',
  // Add more icons as needed
};

const path = computed(() => iconPaths[props.name] || '');

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };
  return sizes[props.size];
});
</script>
