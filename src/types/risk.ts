export interface Risk {
  id: string;
  titulo: string;
  descripcion: string | null;
  impacto: string | null;
  probabilidad: string | null;
  mitigacion: string | null;
  estado: string | null;
  proyecto_id: string;
  capacidad_id: string | null;
  date_created: string;
  date_updated: string | null;
}

export interface RiskWithProject extends Risk {
  proyecto_nombre?: string;
}
