<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    <MetricCard
      label="Proyectos activos"
      :value="activeProjects"
      color="success"
    />
    <MetricCard
      label="Pendientes"
      :value="pendingCount"
      color="warning"
    />
    <MetricCard
      label="En progreso"
      :value="inProgressCount"
      color="info"
    />
    <MetricCard
      label="Bloqueadas"
      :value="blockedCount"
      color="danger"
    />
    <MetricCard
      label="Completadas"
      :value="completedCount"
      color="success"
    />
    <MetricCard
      label="Vencidas"
      :value="overdueCount"
      :color="overdueCount > 0 ? 'danger' : 'default'"
    />
    <MetricCard
      label="Hitos próximos (7d)"
      :value="upcomingMilestonesCount"
      color="info"
    />
    <MetricCard
      label="Riesgos abiertos"
      :value="openRisksCount"
      :color="openRisksCount > 0 ? 'warning' : 'default'"
    />
    <MetricCard
      label="Min. esta semana"
      :value="weekMinutes"
      suffix="min"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { Session } from '@/types/session';
import type { Risk } from '@/types/risk';
import type { Milestone } from '@/types/milestone';
import MetricCard from '@/components/common/MetricCard.vue';
import { isTaskOverdue, minutesThisWeek, upcomingMilestones } from '@/lib/metrics';

const props = defineProps<{
  projects: Project[] | undefined;
  tasks: Task[] | undefined;
  sessions: Session[] | undefined;
  risks: Risk[] | undefined;
  milestones: Milestone[] | undefined;
}>();

const activeProjects = computed(() => props.projects?.filter((p) => p.estado === 'activo').length ?? 0);
const pendingCount = computed(() => props.tasks?.filter((t) => t.estado === 'pendiente').length ?? 0);
const inProgressCount = computed(() => props.tasks?.filter((t) => t.estado === 'en_progreso').length ?? 0);
const blockedCount = computed(() => props.tasks?.filter((t) => t.estado === 'bloqueada').length ?? 0);
const completedCount = computed(() => props.tasks?.filter((t) => t.estado === 'completada').length ?? 0);
const overdueCount = computed(() => props.tasks?.filter(isTaskOverdue).length ?? 0);
const upcomingMilestonesCount = computed(() => upcomingMilestones(props.milestones ?? []).length);
const openRisksCount = computed(() => props.risks?.filter((r) => r.estado && r.estado !== 'cerrado' && r.estado !== 'mitigado').length ?? 0);
const weekMinutes = computed(() => minutesThisWeek(props.sessions ?? []));
</script>
