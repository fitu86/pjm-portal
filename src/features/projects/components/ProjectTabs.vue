<template>
  <div>
    <div class="flex border-b border-strong mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-2 text-sm font-mono-data transition-colors border-b-2 -mb-px',
          activeTab === tab.id
            ? 'text-accent border-accent'
            : 'text-muted border-transparent hover:text-gray-200',
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <ProjectSummary
      v-if="activeTab === 'summary'"
      :project-id="projectId"
      :tasks="tasks"
      :sessions="sessions"
      :risks="risks"
      :milestones="milestones"
    />
    <ProjectPlan
      v-else-if="activeTab === 'plan'"
      :tasks="tasks"
    />
    <div v-else-if="activeTab === 'tasks'" class="space-y-3">
      <div v-if="tasks.length === 0" class="text-sm text-muted">Sin tareas.</div>
      <div v-for="t in tasks" :key="t.id" class="flex items-center gap-3 text-sm py-2 border-b border-border">
        <StatusBadge :label="t.estado" :variant="statusVariant(t.estado)" dot />
        <StatusBadge :label="t.prioridad" :variant="priorityVariant(t.prioridad)" />
        <span class="flex-1 truncate">{{ t.titulo }}</span>
        <span v-if="t.progress != null" class="font-mono-data text-xs text-muted">{{ t.progress }}%</span>
      </div>
    </div>
    <div v-else-if="activeTab === 'activity'" class="space-y-3">
      <div v-if="sessions.length === 0" class="text-sm text-muted">Sin sesiones registradas.</div>
      <div v-for="s in sessions" :key="s.id" class="bg-surface border-strong rounded p-3 text-sm">
        <div class="font-mono-data text-xs text-muted mb-1">{{ formatDateTime(s.inicio) }}</div>
        <div v-if="s.que_se_hizo">{{ s.que_se_hizo }}</div>
        <div v-if="s.proximos_pasos" class="text-xs text-muted mt-1">Próximos pasos: {{ s.proximos_pasos }}</div>
      </div>
    </div>
    <ProjectBrief v-else-if="activeTab === 'brief'" :brief="brief" />
    <div v-else-if="activeTab === 'decisions'" class="space-y-3">
      <div v-if="decisions.length === 0" class="text-sm text-muted">Sin decisiones registradas.</div>
      <div v-for="d in decisions" :key="d.id" class="bg-surface border-strong rounded p-3 text-sm">
        <div class="flex items-center gap-2 mb-1">
          <span v-if="d.adr_number" class="font-mono-data text-xs text-accent">{{ d.adr_number }}</span>
          <span class="font-bold">{{ d.titulo }}</span>
        </div>
        <div v-if="d.decision" class="text-muted">{{ d.decision }}</div>
      </div>
    </div>
    <div v-else-if="activeTab === 'risks'" class="space-y-3">
      <div v-if="risks.length === 0" class="text-sm text-muted">Sin riesgos registrados.</div>
      <div v-for="r in risks" :key="r.id" class="bg-surface border-strong rounded p-3 text-sm">
        <div class="flex items-center gap-2 mb-1">
          <StatusBadge :label="r.estado ?? 'abierto'" variant="warning" dot />
          <span class="font-bold">{{ r.titulo }}</span>
        </div>
        <div class="text-xs text-muted">Impacto: {{ r.impacto ?? '--' }} | Probabilidad: {{ r.probabilidad ?? '--' }}</div>
      </div>
    </div>
    <div v-else-if="activeTab === 'achievements'" class="space-y-3">
      <div v-if="achievements.length === 0" class="text-sm text-muted">Sin logros registrados.</div>
      <div v-for="a in achievements" :key="a.id" class="bg-surface border-strong rounded p-3 text-sm">
        <div class="font-bold">{{ a.titulo }}</div>
        <div v-if="a.descripcion" class="text-muted text-xs mt-1">{{ a.descripcion }}</div>
        <div v-if="a.fecha" class="text-xs text-muted font-mono-data mt-1">{{ formatDate(a.fecha) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Risk } from '@/types/risk';
import type { Decision } from '@/types/decision';
import type { Achievement } from '@/types/achievement';
import type { Milestone } from '@/types/milestone';
import type { Brief } from '@/types/brief';
import ProjectSummary from './ProjectSummary.vue';
import ProjectPlan from './ProjectPlan.vue';
import ProjectBrief from './ProjectBrief.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { formatDate, formatDateTime } from '@/lib/dates';

defineProps<{
  projectId: string;
  tasks: Task[];
  sessions: Session[];
  risks: Risk[];
  decisions: Decision[];
  achievements: Achievement[];
  milestones: Milestone[];
  brief: Brief | null;
}>();

const tabs = [
  { id: 'summary', label: 'Resumen' },
  { id: 'plan', label: 'Plan' },
  { id: 'tasks', label: 'Tareas' },
  { id: 'activity', label: 'Actividad' },
  { id: 'brief', label: 'Brief' },
  { id: 'decisions', label: 'Decisiones' },
  { id: 'risks', label: 'Riesgos' },
  { id: 'achievements', label: 'Logros' },
];

const activeTab = ref('summary');

function statusVariant(s: string): 'danger' | 'warning' | 'info' | 'success' {
  if (s === 'bloqueada') return 'danger';
  if (s === 'en_progreso') return 'info';
  if (s === 'completada') return 'success';
  return 'warning';
}

function priorityVariant(p: string): 'danger' | 'warning' | 'info' {
  if (p === 'alta') return 'danger';
  if (p === 'media') return 'warning';
  return 'info';
}
</script>
