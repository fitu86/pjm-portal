export interface Progress {
  id: string;
  descripcion: string | null;
  porcentaje: number | null;
  tarea_id: string;
  session_id: string | null;
  date_created: string;
}

export interface ProgressWithTask extends Progress {
  tarea_titulo?: string;
}
