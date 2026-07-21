export interface Task {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada';
  prioridad: 'alta' | 'media' | 'baja';
  orden: number | null;
  proyecto_id: string;
  date_created: string;
  date_updated: string | null;
  effort_estimated: number | null;
  effort_actual: number | null;
  start_date: string | null;
  target_date: string | null;
  end_date: string | null;
  capacidad_id: string | null;
  decision_id: string | null;
  blocked_by_task_id: string | null;
  tarea_padre_id: string | null;
  progress: number | null;
  task_type: 'task' | 'phase' | 'milestone';
  color: string | null;
  collapsed: boolean | null;
  duration_days: number | null;
  sequence_num: number | null;
  critical_path: boolean | null;
  assigned_to: string | null;
}

export type TaskStatus = Task['estado'];
export type TaskPriority = Task['prioridad'];
export type TaskType = Task['task_type'];

export interface TaskWithProject extends Task {
  proyecto_nombre?: string;
  proyecto_code?: string | null;
  blocked_by_titulo?: string | null;
}
