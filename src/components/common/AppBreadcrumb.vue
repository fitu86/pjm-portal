<template>
  <nav class="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
    <router-link to="/" class="text-muted hover:text-gray-200 transition-colors">PJM</router-link>
    <template v-for="(crumb, i) in crumbs" :key="i">
      <svg class="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <router-link
        v-if="crumb.to && i < crumbs.length - 1"
        :to="crumb.to"
        class="text-muted hover:text-gray-200 transition-colors"
      >
        {{ crumb.label }}
      </router-link>
      <span v-else class="text-gray-200">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface Crumb {
  label: string;
  to?: string;
}

const routeLabels: Record<string, string> = {
  today: 'Hoy',
  projects: 'Proyectos',
  tasks: 'Tareas',
  activity: 'Actividad',
  time: 'Tiempo',
  risks: 'Riesgos',
  decisions: 'Decisiones',
  achievements: 'Logros',
};

const crumbs = computed<Crumb[]>(() => {
  const segments = route.path.split('/').filter(Boolean);
  const result: Crumb[] = [];
  let path = '';

  for (const seg of segments) {
    path += `/${seg}`;
    const label = routeLabels[seg] ?? seg;
    if (label === seg && seg.startsWith(':')) continue;
    result.push({
      label,
      to: path === route.path ? undefined : path,
    });
  }

  if (result.length === 0 || (result.length === 1 && result[0].label === 'Inicio')) {
    return [{ label: 'Command Center' }];
  }

  if (result.length === 1) {
    return [{ label: 'Command Center' }, ...result];
  }

  return result;
});
</script>
