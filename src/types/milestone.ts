export interface Milestone {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: 'pendiente' | 'completado';
  fecha: string | null;
  proyecto_id: string;
  date_created: string;
}

export interface MilestoneWithProject extends Milestone {
  proyecto_nombre?: string;
}
