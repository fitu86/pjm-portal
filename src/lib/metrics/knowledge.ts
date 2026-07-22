import type { Source } from '@/types/source';
import type { Knowledge } from '@/types/knowledge';
import type { Experiment } from '@/types/experiment';

export function sourcesByType(sources: Source[]): Record<string, number> {
  return sources.reduce(
    (acc, s) => {
      acc[s.tipo] = (acc[s.tipo] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function experimentsByStatus(experiments: Experiment[]): Record<string, number> {
  return experiments.reduce(
    (acc, e) => {
      acc[e.estado] = (acc[e.estado] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function knowledgeAdoptionRate(experiments: Experiment[]): number {
  if (experiments.length === 0) return 0;
  const adopted = experiments.filter((e) => e.estado === 'completado').length;
  return Math.round((adopted / experiments.length) * 100);
}

export function knowledgeDiscardRate(experiments: Experiment[]): number {
  if (experiments.length === 0) return 0;
  const discarded = experiments.filter((e) => e.estado === 'cancelado').length;
  return Math.round((discarded / experiments.length) * 100);
}

export function flowCompletionRate(
  sources: Source[],
  knowledge: Knowledge[],
  experiments: Experiment[],
): number {
  if (sources.length === 0) return 0;
  const knowledgeRate = knowledge.length / sources.length;
  const experimentRate = experiments.length / Math.max(knowledge.length, 1);
  return Math.round((knowledgeRate * experimentRate) * 100);
}

export function knowledgePerSource(sources: Source[], knowledge: Knowledge[]): number {
  if (sources.length === 0) return 0;
  return Math.round(knowledge.length / sources.length);
}

export function experimentsPerKnowledge(knowledge: Knowledge[], experiments: Experiment[]): number {
  if (knowledge.length === 0) return 0;
  return Math.round(experiments.length / knowledge.length);
}
