<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-full z-40 transition-all duration-200 bg-surface border-r border-strong',
      collapsed ? 'w-16' : 'w-60',
    ]"
  >
    <div class="flex items-center justify-between p-3 border-b border-strong">
      <div v-if="!collapsed" class="font-mono-data text-sm font-bold text-accent truncate">
        Mi panel de proyectos
      </div>
      <button
        class="p-1 rounded hover:bg-surface-elevated transition-colors"
        :aria-label="collapsed ? 'Expandir menú' : 'Colapsar menú'"
        @click="$emit('toggle')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="collapsed"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <nav class="mt-2" aria-label="Navegación principal">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-3 py-2 mx-1 rounded text-sm transition-colors',
          isActive(item.to)
            ? 'bg-accent/20 text-accent'
            : 'text-gray-400 hover:bg-surface-elevated hover:text-gray-200',
        ]"
        :title="collapsed ? item.label : undefined"
      >
        <span class="w-5 h-5 shrink-0" v-html="item.icon" />
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
        <span
          v-if="!collapsed && item.badge != null && item.badge > 0"
          class="ml-auto text-xs px-1.5 py-0.5 rounded bg-danger/20 text-danger font-mono-data"
        >
          {{ item.badge }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  collapsed: boolean;
  pendingTasks?: number;
  openRisks?: number;
}>();

defineEmits<{
  toggle: [];
}>();

const route = useRoute();

const IconHome = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>';
const IconCalendar = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
const IconFolder = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>';
const IconCheck = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>';
const IconActivity = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
const IconClock = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
const IconAlert = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>';
const IconDecide = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
const IconTrophy = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>';
const IconKnowledge = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>';

const navItems = computed(() => [
  { to: '/', label: 'Resumen', icon: IconHome },
  { to: '/today', label: 'Mi día', icon: IconCalendar },
  { to: '/projects', label: 'Proyectos', icon: IconFolder },
  { to: '/tasks', label: 'Lista de tareas', icon: IconCheck, badge: props.pendingTasks },
  { to: '/activity', label: 'Actividad reciente', icon: IconActivity },
  { to: '/time', label: 'Tiempo registrado', icon: IconClock },
  { to: '/risks', label: 'Riesgos', icon: IconAlert, badge: props.openRisks },
  { to: '/decisions', label: 'Decisiones', icon: IconDecide },
  { to: '/achievements', label: 'Logros', icon: IconTrophy },
  { to: '/knowledge', label: 'Conocimiento', icon: IconKnowledge },
]);

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
}
</script>
