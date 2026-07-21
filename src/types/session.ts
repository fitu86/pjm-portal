export interface Session {
  id: string;
  inicio: string;
  fin: string | null;
  duracion_min: number | null;
  que_se_hizo: string | null;
  decisiones: string | null;
  proximos_pasos: string | null;
  ideas: string | null;
  proyecto_id: string;
  tarea_id: string | null;
  session_type: string | null;
  outcome: string | null;
  capacidad_id: string | null;
  decision_id: string | null;
}

export interface SessionWithProject extends Session {
  proyecto_nombre?: string;
  tarea_titulo?: string | null;
}
