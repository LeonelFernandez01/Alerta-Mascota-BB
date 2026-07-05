import { useState, useEffect, useMemo, useCallback } from 'react';
import type { MascotaReportada, BarrioBahia, EstadoMascota, TipoAnimal } from '../../core/types/mascota';
import { mockService } from '../../data/mockService';

export interface FiltrosMascotas {
  barrio: BarrioBahia | 'todos';
  estado: EstadoMascota | 'todos';
  tipo: TipoAnimal | 'todos';
  busqueda: string;
}

const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const useMascotas = () => {
  const [mascotas, setMascotas] = useState<MascotaReportada[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Estado de los filtros
  const [filtros, setFiltros] = useState<FiltrosMascotas>({
    barrio: 'todos',
    estado: 'todos',
    tipo: 'todos',
    busqueda: ''
  });

  // Cargar datos al montar el componente
  const cargarMascotas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockService.getMascotas();
      setMascotas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar las mascotas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarMascotas();
  }, [cargarMascotas]);

  // Aplicar filtros de forma eficiente usando useMemo
  const mascotasFiltradas = useMemo(() => {
    return mascotas.filter(mascota => {
      // Filtrar por Barrio
      const coincideBarrio = filtros.barrio === 'todos' || mascota.barrio === filtros.barrio;
      
      // Filtrar por Estado (perdido/encontrado)
      const coincideEstado = filtros.estado === 'todos' || mascota.estado === filtros.estado;
      
      // Filtrar por Tipo de Animal
      const coincideTipo = filtros.tipo === 'todos' || mascota.tipo === filtros.tipo;
      
      // Filtrar por búsqueda textual (búsqueda insensible a mayúsculas y acentos)
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


  // Actualizar un filtro individual
  const setFiltro = useCallback(<K extends keyof FiltrosMascotas>(key: K, value: FiltrosMascotas[K]) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Limpiar todos los filtros
  const resetearFiltros = useCallback(() => {
    setFiltros({
      barrio: 'todos',
      estado: 'todos',
      tipo: 'todos',
      busqueda: ''
    });
  }, []);

  // Agregar nuevo reporte de mascota
  const agregarReporte = useCallback(async (
    nuevoReporte: Omit<MascotaReportada, 'id' | 'fecha'>
  ): Promise<MascotaReportada | null> => {
    setIsSaving(true);
    setError(null);
    try {
      const mascotaCreada = await mockService.addMascota(nuevoReporte);
      // Actualizar el estado local agregándola al principio
      setMascotas(prev => [mascotaCreada, ...prev]);
      return mascotaCreada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el nuevo reporte.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    mascotas: mascotasFiltradas, // Devolvemos la lista ya filtrada
    rawMascotas: mascotas, // Lista completa sin filtros por si se requiere
    loading,
    error,
    isSaving,
    filtros,
    setFiltro,
    resetearFiltros,
    agregarReporte,
    recargarMascotas: cargarMascotas
  };
};
