import { describe, it, expect } from 'vitest';
import {
  sourcesByType,
  experimentsByStatus,
  knowledgeAdoptionRate,
  knowledgeDiscardRate,
  flowCompletionRate,
  knowledgePerSource,
  experimentsPerKnowledge,
} from '@/lib/metrics/knowledge';
import type { Source } from '@/types/source';
import type { Knowledge } from '@/types/knowledge';
import type { Experiment } from '@/types/experiment';

function makeSource(overrides: Partial<Source> = {}): Source {
  return {
    id: '1',
    titulo: 'Test source',
    url: 'https://example.com',
    tipo: 'article',
    canonical_url: null,
    proveedor: null,
    autor: null,
    external_id: null,
    version_ref: null,
    fecha_publicacion: null,
    estado: 'inbox',
    prioridad: 'media',
    motivo_interes: null,
    resumen: null,
    fecha_ultima_revision: null,
    date_created: '2025-01-01T00:00:00Z',
    date_updated: null,
    ...overrides,
  };
}

function makeKnowledge(overrides: Partial<Knowledge> = {}): Knowledge {
  return {
    id: '1',
    titulo: 'Test knowledge',
    tipo: 'observation',
    contenido: null,
    capacidad_id: null,
    proyecto_id: null,
    summary: null,
    estado_revision: 'capturado',
    madurez: 'observacion',
    confianza: 'no_verificado',
    date_created: '2025-01-01T00:00:00Z',
    date_updated: null,
    ...overrides,
  };
}

function makeExperiment(overrides: Partial<Experiment> = {}): Experiment {
  return {
    id: '1',
    titulo: 'Test experiment',
    objetivo: null,
    hipotesis: null,
    metodo: null,
    criterios_exito: null,
    estado: 'idea',
    resultado: null,
    conclusion: null,
    start_date: null,
    end_date: null,
    proyecto_id: null,
    conocimiento_origen_id: null,
    tarea_id: null,
    date_created: '2025-01-01T00:00:00Z',
    date_updated: null,
    ...overrides,
  };
}

describe('sourcesByType', () => {
  it('groups sources by type', () => {
    const sources = [
      makeSource({ tipo: 'article' }),
      makeSource({ tipo: 'article' }),
      makeSource({ tipo: 'book' }),
    ];
    expect(sourcesByType(sources)).toEqual({ article: 2, book: 1 });
  });

  it('returns empty object for empty array', () => {
    expect(sourcesByType([])).toEqual({});
  });
});

describe('experimentsByStatus', () => {
  it('groups experiments by status', () => {
    const experiments = [
      makeExperiment({ estado: 'completado' }),
      makeExperiment({ estado: 'completado' }),
      makeExperiment({ estado: 'cancelado' }),
    ];
    expect(experimentsByStatus(experiments)).toEqual({ completado: 2, cancelado: 1 });
  });
});

describe('knowledgeAdoptionRate', () => {
  it('returns 100 when all experiments are completed', () => {
    const experiments = [
      makeExperiment({ estado: 'completado' }),
      makeExperiment({ estado: 'completado' }),
    ];
    expect(knowledgeAdoptionRate(experiments)).toBe(100);
  });

  it('returns 0 when no experiments', () => {
    expect(knowledgeAdoptionRate([])).toBe(0);
  });

  it('calculates correct percentage', () => {
    const experiments = [
      makeExperiment({ estado: 'completado' }),
      makeExperiment({ estado: 'planeado' }),
      makeExperiment({ estado: 'cancelado' }),
    ];
    expect(knowledgeAdoptionRate(experiments)).toBe(33);
  });
});

describe('knowledgeDiscardRate', () => {
  it('returns correct percentage', () => {
    const experiments = [
      makeExperiment({ estado: 'cancelado' }),
      makeExperiment({ estado: 'cancelado' }),
      makeExperiment({ estado: 'completado' }),
    ];
    expect(knowledgeDiscardRate(experiments)).toBe(67);
  });

  it('returns 0 when no experiments', () => {
    expect(knowledgeDiscardRate([])).toBe(0);
  });
});

describe('flowCompletionRate', () => {
  it('returns 0 when no sources', () => {
    expect(flowCompletionRate([], [], [])).toBe(0);
  });

  it('calculates flow completion', () => {
    const sources = [makeSource(), makeSource()];
    const knowledge = [makeKnowledge(), makeKnowledge()];
    const experiments = [makeExperiment()];
    expect(flowCompletionRate(sources, knowledge, experiments)).toBe(50);
  });
});

describe('knowledgePerSource', () => {
  it('returns 0 when no sources', () => {
    expect(knowledgePerSource([], [])).toBe(0);
  });

  it('calculates knowledge per source', () => {
    const sources = [makeSource(), makeSource(), makeSource()];
    const knowledge = [makeKnowledge(), makeKnowledge()];
    expect(knowledgePerSource(sources, knowledge)).toBe(1);
  });
});

describe('experimentsPerKnowledge', () => {
  it('returns 0 when no knowledge', () => {
    expect(experimentsPerKnowledge([], [])).toBe(0);
  });

  it('calculates experiments per knowledge', () => {
    const knowledge = [makeKnowledge(), makeKnowledge()];
    const experiments = [makeExperiment(), makeExperiment(), makeExperiment()];
    expect(experimentsPerKnowledge(knowledge, experiments)).toBe(2);
  });
});
