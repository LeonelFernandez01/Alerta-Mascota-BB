import type { BarrioBahia } from './mascota';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string; // Ej: "5492915551234"
  barrio: BarrioBahia;
  avatarUrl?: string;
  fechaRegistro: string; // ISO string
}

export interface CredencialesLogin {
  email: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  telefono: string;
  barrio: BarrioBahia;
  password: string;
}
