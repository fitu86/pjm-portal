export interface Decision {
  id: string;
  titulo: string;
  contexto: string | null;
  decision: string | null;
  consecuencias: string | null;
  estado: string | null;
  proyecto_id: string;
  capacidad_id: string | null;
  adr_number: string | null;
  date_created: string;
  date_updated: string | null;
}

export interface DecisionWithProject extends Decision {
  proyecto_nombre?: string;
}
