<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold font-mono-data">Conocimiento</h1>

    <KnowledgeMetrics
      :total-sources="flow.totalSources.value"
      :total-knowledge="flow.totalKnowledge.value"
      :total-experiments="flow.totalExperiments.value"
      :adoption-rate="flow.adoptionRate.value"
    />

    <div class="flex gap-2 border-b border-strong">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-2 text-sm font-mono-data transition-colors',
          activeTab === tab.id
            ? 'text-accent border-b-2 border-accent'
            : 'text-muted hover:text-gray-200',
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'sources'">
      <LoadingState v-if="sourcesLoading" message="Cargando fuentes..." />
      <ErrorState v-else-if="sourcesError" @retry="refetchSources" />
      <EmptyState v-else-if="!sources?.length" message="Sin fuentes registradas." />
      <div v-else class="space-y-3">
        <SourceCard v-for="s in sources" :key="s.id" :source="s" />
      </div>
    </div>

    <div v-if="activeTab === 'knowledge'">
      <LoadingState v-if="knowledgeLoading" message="Cargando conocimiento..." />
      <ErrorState v-else-if="knowledgeError" @retry="refetchKnowledge" />
      <EmptyState v-else-if="!knowledgeItems?.length" message="Sin conocimiento registrado." />
      <div v-else class="space-y-3">
        <KnowledgeCard v-for="k in knowledgeItems" :key="k.id" :knowledge="k" />
      </div>
    </div>

    <div v-if="activeTab === 'experiments'">
      <LoadingState v-if="experimentsLoading" message="Cargando experimentos..." />
      <ErrorState v-else-if="experimentsError" @retry="refetchExperiments" />
      <EmptyState v-else-if="!experiments?.length" message="Sin experimentos registrados." />
      <div v-else class="space-y-3">
        <ExperimentCard v-for="e in experiments" :key="e.id" :experiment="e" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchSources, fetchKnowledge, fetchExperiments } from '@/lib/directus/queries';
import { queryKeys } from '@/lib/directus/keys';
import { useKnowledgeFlow } from '../composables/useKnowledgeFlow';
import KnowledgeMetrics from '../components/KnowledgeMetrics.vue';
import SourceCard from '../components/SourceCard.vue';
import KnowledgeCard from '../components/KnowledgeCard.vue';
import ExperimentCard from '../components/ExperimentCard.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ErrorState from '@/components/common/ErrorState.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const activeTab = ref<'sources' | 'knowledge' | 'experiments'>('sources');

const tabs = [
  { id: 'sources' as const, label: 'Fuentes' },
  { id: 'knowledge' as const, label: 'Conocimiento' },
  { id: 'experiments' as const, label: 'Experimentos' },
];

const {
  data: sources,
  isLoading: sourcesLoading,
  error: sourcesError,
  refetch: refetchSources,
} = useQuery({
  queryKey: queryKeys.sources,
  queryFn: ({ signal }) => fetchSources(undefined, signal),
});

const {
  data: knowledgeItems,
  isLoading: knowledgeLoading,
  error: knowledgeError,
  refetch: refetchKnowledge,
} = useQuery({
  queryKey: queryKeys.knowledge,
  queryFn: ({ signal }) => fetchKnowledge(undefined, signal),
});

const {
  data: experiments,
  isLoading: experimentsLoading,
  error: experimentsError,
  refetch: refetchExperiments,
} = useQuery({
  queryKey: queryKeys.experiments,
  queryFn: ({ signal }) => fetchExperiments(undefined, signal),
});

const flow = useKnowledgeFlow(sources, knowledgeItems, experiments);
</script>
