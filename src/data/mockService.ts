import type { MascotaReportada } from '../core/types/mascota';
import { MOCK_MASCOTAS } from './mockMascotas';

// Clave para guardar y cargar los datos de prueba en localStorage,
// permitiendo persistencia local durante las pruebas en el navegador.
const STORAGE_KEY = 'alerta_mascota_bb_data';

const getStoredData = (): MascotaReportada[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MASCOTAS));
    return MOCK_MASCOTAS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_MASCOTAS;
  }
};

const saveStoredData = (data: MascotaReportada[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Simula el tiempo de respuesta de red (ej: Supabase o Firebase)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // Obtener todos los reportes (Ordenados por fecha descendente, los más nuevos primero)
  async getMascotas(): Promise<MascotaReportada[]> {
    await delay(1000); // 1 segundo de lag simulado
    const data = getStoredData();
    return [...data].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  },

  // Crear un nuevo reporte
  async addMascota(nueva: Omit<MascotaReportada, 'id' | 'fecha'>): Promise<MascotaReportada> {
    await delay(1200); // 1.2 segundos de delay de inserción simulado
    const data = getStoredData();
    
    const mascotaCreada: MascotaReportada = {
      ...nueva,
      id: Math.random().toString(36).substr(2, 9), // ID único aleatorio
      fecha: new Date().toISOString()
    };

    const updatedData = [mascotaCreada, ...data];
    saveStoredData(updatedData);
    return mascotaCreada;
  }
};
