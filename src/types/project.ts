export interface Project {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: 'tecnico' | 'personal' | 'profesional';
  estado: 'activo' | 'pausado' | 'completado' | 'archivado';
  orden: number | null;
  proyecto_padre_id: string | null;
  date_created: string;
  date_updated: string | null;
  code: string | null;
  vision: string | null;
  scope: string | null;
  priority: string | null;
  target_release: string | null;
}

export type ProjectStatus = Project['estado'];
export type ProjectType = Project['tipo'];
