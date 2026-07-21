<template>
  <div class="flex items-center gap-2">
    <span
      :class="[
        'w-2 h-2 rounded-full shrink-0',
        typeColor(item.type),
      ]"
    />
    <span class="text-xs font-mono-data px-1 py-0.5 rounded" :class="typeBadge(item.type)">
      {{ typeLabel(item.type) }}
    </span>
    <span class="text-sm font-bold truncate">{{ item.title }}</span>
    <span v-if="item.project" class="text-xs text-muted font-mono-data ml-auto hidden sm:inline">
      {{ item.project.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { ActivityItem } from '@/types/activity';

defineProps<{
  item: ActivityItem;
}>();

function typeColor(type: string): string {
  const map: Record<string, string> = {
    session: 'bg-accent',
    decision: 'bg-warning',
    achievement: 'bg-success',
    milestone: 'bg-info',
    progress: 'bg-gray-400',
    task: 'bg-warning',
  };
  return map[type] ?? 'bg-gray-500';
}

function typeBadge(type: string): string {
  const map: Record<string, string> = {
    session: 'bg-accent/20 text-accent',
    decision: 'bg-warning/20 text-warning',
    achievement: 'bg-success/20 text-success',
    milestone: 'bg-info/20 text-info',
    progress: 'bg-surface-elevated text-muted',
    task: 'bg-warning/20 text-warning',
  };
  return map[type] ?? '';
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    session: 'Sesión',
    decision: 'Decisión',
    achievement: 'Logro',
    milestone: 'Hito',
    progress: 'Avance',
    task: 'Tarea',
  };
  return map[type] ?? type;
}
</script>
