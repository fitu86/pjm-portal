import { computed } from 'vue';
import type { Ref } from 'vue';
import type { Source } from '@/types/source';
import type { Knowledge } from '@/types/knowledge';
import type { Experiment } from '@/types/experiment';

export function useKnowledgeFlow(
  sources: Ref<Source[] | undefined>,
  knowledge: Ref<Knowledge[] | undefined>,
  experiments: Ref<Experiment[] | undefined>,
) {
  const totalSources = computed(() => sources.value?.length ?? 0);
  const totalKnowledge = computed(() => knowledge.value?.length ?? 0);
  const totalExperiments = computed(() => experiments.value?.length ?? 0);

  const sourcesByType = computed(() => {
    if (!sources.value) return {};
    return sources.value.reduce(
      (acc, s) => {
        acc[s.tipo] = (acc[s.tipo] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  });

  const experimentsByStatus = computed(() => {
    if (!experiments.value) return {};
    return experiments.value.reduce(
      (acc, e) => {
        acc[e.estado] = (acc[e.estado] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  });

  const adoptionRate = computed(() => {
    if (!experiments.value || experiments.value.length === 0) return 0;
    const adopted = experiments.value.filter((e) => e.estado === 'completado').length;
    return Math.round((adopted / experiments.value.length) * 100);
  });

  const discardRate = computed(() => {
    if (!experiments.value || experiments.value.length === 0) return 0;
    const discarded = experiments.value.filter((e) => e.estado === 'cancelado').length;
    return Math.round((discarded / experiments.value.length) * 100);
  });

  const knowledgePerSource = computed(() => {
    if (!sources.value || sources.value.length === 0) return 0;
    return Math.round(totalKnowledge.value / sources.value.length);
  });

  const experimentsPerKnowledge = computed(() => {
    if (!knowledge.value || knowledge.value.length === 0) return 0;
    return Math.round(totalExperiments.value / knowledge.value.length);
  });

  return {
    totalSources,
    totalKnowledge,
    totalExperiments,
    sourcesByType,
    experimentsByStatus,
    adoptionRate,
    discardRate,
    knowledgePerSource,
    experimentsPerKnowledge,
  };
}
