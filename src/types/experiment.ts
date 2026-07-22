export interface Experiment {
  id: string;
  titulo: string;
  objetivo: string | null;
  hipotesis: string | null;
  metodo: string | null;
  criterios_exito: string | null;
  estado: 'idea' | 'planeado' | 'en_progreso' | 'completado' | 'cancelado';
  resultado: string | null;
  conclusion: string | null;
  start_date: string | null;
  end_date: string | null;
  proyecto_id: string | null;
  conocimiento_origen_id: string | null;
  tarea_id: string | null;
  date_created: string;
  date_updated: string | null;
}

export type ExperimentStatus = Experiment['estado'];

export interface ExperimentWithProject extends Experiment {
  proyecto_nombre?: string;
  proyecto_code?: string | null;
  knowledge_titulo?: string | null;
}
