export interface Brief {
  id: string;
  proyecto_id: string;
  problema: string | null;
  objetivo: string | null;
  alcance_incluye: string | null;
  alcance_excluye: string | null;
  criterios_exito: string | null;
  restricciones: string | null;
  recursos: string | null;
  referencias: string | null;
  date_updated: string | null;
}
