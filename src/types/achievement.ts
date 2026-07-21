export interface Achievement {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string | null;
  proyecto_id: string;
  milestone_id: string | null;
}

export interface AchievementWithProject extends Achievement {
  proyecto_nombre?: string;
  milestone_titulo?: string | null;
}
