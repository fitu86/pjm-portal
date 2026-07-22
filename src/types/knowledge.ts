export interface Knowledge {
  id: string;
  titulo: string;
  tipo: 'concept' | 'pattern' | 'observation' | 'insight' | 'idea' | 'hypothesis' | 'question' | 'guide' | 'reference' | 'warning';
  contenido: string | null;
  capacidad_id: string | null;
  proyecto_id: string | null;
  summary: string | null;
  estado_revision: 'capturado' | 'revisando' | 'analizado' | 'archivado';
  madurez: 'observacion' | 'idea' | 'hipotesis' | 'validado' | 'adoptado';
  confianza: 'no_verificado' | 'probable' | 'verificado' | 'refutado';
  date_created: string;
  date_updated: string | null;
}

export type KnowledgeTipo = Knowledge['tipo'];
export type KnowledgeMadurez = Knowledge['madurez'];
export type KnowledgeConfianza = Knowledge['confianza'];

export interface KnowledgeWithProject extends Knowledge {
  proyecto_nombre?: string;
  proyecto_code?: string | null;
  sources?: Array<{ id: string; titulo: string }>;
  topics?: Array<{ id: string; nombre: string }>;
}
