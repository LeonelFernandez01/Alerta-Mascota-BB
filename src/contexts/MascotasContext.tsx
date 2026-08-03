import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { MascotaReportada, BarrioBahia, EstadoMascota, TipoAnimal } from '../types/mascota';
import { backendService } from '../services/backendService';

export interface FiltrosMascotas {
  barrio: BarrioBahia | 'todos';
  estado: EstadoMascota | 'todos';
  tipo: TipoAnimal | 'todos';
  busqueda: string;
}

export interface MascotasContextType {
  mascotas: MascotaReportada[];
  rawMascotas: MascotaReportada[];
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  isRealtime: boolean;
  filtros: FiltrosMascotas;
  setFiltro: <K extends keyof FiltrosMascotas>(key: K, value: FiltrosMascotas[K]) => void;
  resetearFiltros: () => void;
  agregarReporte: (nuevoReporte: Omit<MascotaReportada, 'id' | 'fecha'>) => Promise<MascotaReportada | null>;
  recargarMascotas: () => Promise<void>;
  vista: 'grid' | 'list';
  toggleVista: () => void;
}

export const MascotasContext = createContext<MascotasContextType | undefined>(undefined);

const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const MascotasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mascotas, setMascotas] = useState<MascotaReportada[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRealtime, setIsRealtime] = useState<boolean>(backendService.isRealtimeActive());

  const [vista, setVista] = useState<'grid' | 'list'>(() => {
    const stored = localStorage.getItem('alerta_mascota_bb_vista');
    return (stored === 'grid' || stored === 'list') ? stored : 'grid';
  });

  const toggleVista = useCallback(() => {
    setVista(prev => {
      const next = prev === 'grid' ? 'list' : 'grid';
      localStorage.setItem('alerta_mascota_bb_vista', next);
      return next;
    });
  }, []);

  const [filtros, setFiltros] = useState<FiltrosMascotas>({
    barrio: 'todos',
    estado: 'todos',
    tipo: 'todos',
    busqueda: ''
  });

  // Suscripción en tiempo real a las publicaciones de la comunidad
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = backendService.subscribeMascotas(
      (data) => {
        setMascotas(data);
        setLoading(false);
        setIsRealtime(backendService.isRealtimeActive());
      },
      (err) => {
        setError(err.message || 'Error al conectar con la base de datos.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const cargarMascotas = useCallback(async () => {
    // Si no hay realtime activo, recargar manualmente
    if (!backendService.isRealtimeActive()) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (e) {
        // Handled
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const mascotasFiltradas = useMemo(() => {
    return mascotas.filter(mascota => {
      const coincideBarrio = filtros.barrio === 'todos' || mascota.barrio === filtros.barrio;
      const coincideEstado = filtros.estado === 'todos' || mascota.estado === filtros.estado;
      const coincideTipo = filtros.tipo === 'todos' || mascota.tipo === filtros.tipo;
      
      const busquedaClean = cleanText(filtros.busqueda.trim());
      const coincideBusqueda = 
        busquedaClean === '' ||
        cleanText(mascota.descripcion).includes(busquedaClean) ||
        cleanText(mascota.zonaEspecifica).includes(busquedaClean) ||
        (mascota.señasParticulares && cleanText(mascota.señasParticulares).includes(busquedaClean)) ||
        cleanText(mascota.nombreContacto).includes(busquedaClean);

      return coincideBarrio && coincideEstado && coincideTipo && coincideBusqueda;
    });
  }, [mascotas, filtros]);

  const setFiltro = useCallback(<K extends keyof FiltrosMascotas>(key: K, value: FiltrosMascotas[K]) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetearFiltros = useCallback(() => {
    setFiltros({
      barrio: 'todos',
      estado: 'todos',
      tipo: 'todos',
      busqueda: ''
    });
  }, []);

  const agregarReporte = useCallback(async (
    nuevoReporte: Omit<MascotaReportada, 'id' | 'fecha'>
  ): Promise<MascotaReportada | null> => {
    setIsSaving(true);
    setError(null);
    try {
      const mascotaCreada = await backendService.addMascota(nuevoReporte);
      if (!backendService.isRealtimeActive()) {
        setMascotas(prev => [mascotaCreada, ...prev]);
      }
      return mascotaCreada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el nuevo reporte.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const value = useMemo(() => ({
    mascotas: mascotasFiltradas,
    rawMascotas: mascotas,
    loading,
    error,
    isSaving,
    isRealtime,
    filtros,
    setFiltro,
    resetearFiltros,
    agregarReporte,
    recargarMascotas: cargarMascotas,
    vista,
    toggleVista
  }), [mascotasFiltradas, mascotas, loading, error, isSaving, isRealtime, filtros, setFiltro, resetearFiltros, agregarReporte, cargarMascotas, vista, toggleVista]);

  return (
    <MascotasContext.Provider value={value}>
      {children}
    </MascotasContext.Provider>
  );
};
