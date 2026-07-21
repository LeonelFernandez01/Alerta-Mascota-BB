import type { MascotaReportada, BarrioBahia, TipoAnimal } from '../types/mascota';

export interface StatsMetricas {
  totalReportes: number;
  totalPerdidos: number;
  totalEncontrados: number;
  tasaReencuentroPorcentaje: number;
  distribucionTipo: Array<{
    tipo: TipoAnimal;
    etiqueta: string;
    cantidad: number;
    porcentaje: number;
    color: string;
  }>;
  topBarrios: Array<{
    barrio: BarrioBahia;
    cantidad: number;
    porcentaje: number;
  }>;
}

/**
 * Servicio puro de cálculo de analíticas sobre los reportes de mascotas
 */
export const calcularEstadisticasMascotas = (mascotas: MascotaReportada[]): StatsMetricas => {
  const total = mascotas.length;

  if (total === 0) {
    return {
      totalReportes: 0,
      totalPerdidos: 0,
      totalEncontrados: 0,
      tasaReencuentroPorcentaje: 0,
      distribucionTipo: [],
      topBarrios: [],
    };
  }

  const perdidos = mascotas.filter((m) => m.estado === 'perdido').length;
  const encontrados = mascotas.filter((m) => m.estado === 'encontrado').length;
  const tasaReencuentroPorcentaje = Math.round((encontrados / total) * 100);

  // Conteo por tipo de animal
  const conteoTipo: Record<TipoAnimal, number> = {
    perro: 0,
    gato: 0,
    otro: 0,
  };

  mascotas.forEach((m) => {
    if (conteoTipo[m.tipo] !== undefined) {
      conteoTipo[m.tipo]++;
    } else {
      conteoTipo.otro++;
    }
  });

  const distribucionTipo = [
    {
      tipo: 'perro' as TipoAnimal,
      etiqueta: 'Perros',
      cantidad: conteoTipo.perro,
      porcentaje: Math.round((conteoTipo.perro / total) * 100),
      color: '#6366f1', // Indigo
    },
    {
      tipo: 'gato' as TipoAnimal,
      etiqueta: 'Gatos',
      cantidad: conteoTipo.gato,
      porcentaje: Math.round((conteoTipo.gato / total) * 100),
      color: '#ec4899', // Pink
    },
    {
      tipo: 'otro' as TipoAnimal,
      etiqueta: 'Otros',
      cantidad: conteoTipo.otro,
      porcentaje: Math.round((conteoTipo.otro / total) * 100),
      color: '#f59e0b', // Amber
    },
  ];

  // Conteo por barrio
  const conteoBarrios: Partial<Record<BarrioBahia, number>> = {};
  mascotas.forEach((m) => {
    conteoBarrios[m.barrio] = (conteoBarrios[m.barrio] || 0) + 1;
  });

  const topBarrios = Object.entries(conteoBarrios)
    .map(([barrio, cantidad]) => ({
      barrio: barrio as BarrioBahia,
      cantidad: cantidad as number,
      porcentaje: Math.round(((cantidad as number) / total) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return {
    totalReportes: total,
    totalPerdidos: perdidos,
    totalEncontrados: encontrados,
    tasaReencuentroPorcentaje,
    distribucionTipo,
    topBarrios,
  };
};
