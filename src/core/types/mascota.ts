// Tipado estricto para las zonas de Bahía Blanca y estados de reportes

export type BarrioBahia = 
  | 'Grumbein' 
  | 'Centro' 
  | 'Villa Mitre' 
  | 'Universitario' 
  | 'Patagonia' 
  | 'Palihue' 
  | 'Harding Green' 
  | 'Noroeste' 
  | 'Punta Alta'; // Punta Alta se suma por cercanía y relevancia en la zona

export type EstadoMascota = 'perdido' | 'encontrado';

export type TipoAnimal = 'perro' | 'gato' | 'otro';

export interface MascotaReportada {
  id: string;
  tipo: TipoAnimal;
  estado: EstadoMascota;
  barrio: BarrioBahia;
  zonaEspecifica: string; // Ej: "Avenida Alem al 1200"
  fecha: string; // ISO string
  fotoUrl: string;
  descripcion: string;
  señasParticulares?: string;
  telefonoContacto: string; // Formato internacional completo sin símbolos, ej: "5492915551234"
  nombreContacto: string;
}
