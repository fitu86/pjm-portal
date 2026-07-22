export interface Source {
  id: string;
  titulo: string;
  url: string;
  tipo: 'repository' | 'article' | 'news' | 'documentation' | 'paper' | 'video' | 'application' | 'book' | 'dataset' | 'tool' | 'website' | 'other';
  canonical_url: string | null;
  proveedor: string | null;
  autor: string | null;
  external_id: string | null;
  version_ref: string | null;
  fecha_publicacion: string | null;
  estado: 'inbox' | 'pendiente' | 'revisando' | 'analizado' | 'archivado' | 'descartado';
  prioridad: 'alta' | 'media' | 'baja';
  motivo_interes: string | null;
  resumen: string | null;
  fecha_ultima_revision: string | null;
  date_created: string;
  date_updated: string | null;
}

export type SourceType = Source['tipo'];
export type SourceEstado = Source['estado'];

export interface SourceWithProject extends Source {
  projects?: Array<{ id: string; nombre: string; code?: string | null }>;
}
