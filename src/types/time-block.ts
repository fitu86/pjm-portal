export interface TimeBlock {
  id: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado: 'planeado' | 'en_curso' | 'realizado' | 'cancelado';
  notas: string | null;
  proyecto_id: string;
  tarea_id: string | null;
}

export type TimeBlockStatus = TimeBlock['estado'];

export interface TimeBlockWithProject extends TimeBlock {
  proyecto_nombre?: string;
  tarea_titulo?: string | null;
}
