<template>
  <div class="bg-surface border-strong rounded p-4 shadow-brutal">
    <h2 class="text-sm font-mono-data font-bold text-accent mb-3 uppercase tracking-wider">
      Actividad reciente
    </h2>
    <div v-if="sortedItems.length === 0" class="text-sm text-muted">Sin actividad reciente.</div>
    <ul v-else class="space-y-3">
      <li v-for="item in sortedItems" :key="`${item.type}-${item.id}`" class="flex items-start gap-3">
        <div
          :class="[
            'w-2 h-2 rounded-full mt-2 shrink-0',
            typeColor(item.type),
          ]"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono-data px-1 py-0.5 rounded" :class="typeBadge(item.type)">
              {{ typeLabel(item.type) }}
            </span>
            <span class="text-sm font-bold truncate">{{ item.title }}</span>
          </div>
          <div v-if="item.description" class="text-xs text-muted mt-0.5 line-clamp-2">
            {{ item.description }}
          </div>
          <div class="text-xs text-muted mt-0.5 font-mono-data">
            {{ formatRelative(item.occurredAt) }}
            <span v-if="item.projectName"> &middot; {{ item.projectName }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Session } from '@/types/session';
import type { Decision } from '@/types/decision';
import type { Achievement } from '@/types/achievement';
import type { Milestone } from '@/types/milestone';
import type { Progress } from '@/types/progress';
import { formatRelative } from '@/lib/dates';

interface ActivityEntry {
  id: string;
  type: 'session' | 'decision' | 'achievement' | 'milestone' | 'progress';
  title: string;
  description?: string;
  occurredAt: string;
  projectName?: string;
}

const props = defineProps<{
  sessions: Session[];
  decisions: Decision[];
  achievements: Achievement[];
  milestones: Milestone[];
  progress: Progress[];
}>();

const sortedItems = computed(() => {
  const all: ActivityEntry[] = [];

  for (const s of props.sessions) {
    all.push({
      id: s.id,
      type: 'session',
      title: s.que_se_hizo ?? 'Sesión',
      description: s.proximos_pasos ?? undefined,
      occurredAt: s.inicio,
    });
  }

  for (const d of props.decisions) {
    all.push({
      id: d.id,
      type: 'decision',
      title: d.titulo,
      description: d.decision ?? undefined,
      occurredAt: d.date_created,
    });
  }

  for (const a of props.achievements) {
    if (a.fecha) {
      all.push({
        id: a.id,
        type: 'achievement',
        title: a.titulo,
        description: a.descripcion ?? undefined,
        occurredAt: a.fecha,
      });
    }
  }

  for (const m of props.milestones) {
    if (m.fecha) {
      all.push({
        id: m.id,
        type: 'milestone',
        title: m.titulo,
        description: m.descripcion ?? undefined,
        occurredAt: m.fecha,
      });
    }
  }

  for (const p of props.progress) {
    all.push({
      id: p.id,
      type: 'progress',
      title: p.descripcion ?? 'Avance registrado',
      description: p.porcentaje != null ? `${p.porcentaje}%` : undefined,
      occurredAt: p.date_created,
    });
  }

  return all
    .filter((a) => a.occurredAt)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 15);
});

function typeColor(type: string): string {
  const map: Record<string, string> = {
    session: 'bg-accent',
    decision: 'bg-warning',
    achievement: 'bg-success',
    milestone: 'bg-info',
    progress: 'bg-gray-400',
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
  };
  return map[type] ?? type;
}
</script>
