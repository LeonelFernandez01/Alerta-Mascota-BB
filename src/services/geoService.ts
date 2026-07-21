import type { BarrioBahia } from '../types/mascota';

export interface CoordenadaGeo {
  lat: number;
  lng: number;
}

// Coordenadas geográficas de respaldo para el centro de cada barrio de BB y Punta Alta
const BARRIO_COORDINATES: Record<BarrioBahia, CoordenadaGeo> = {
  Centro: { lat: -38.7183, lng: -62.2663 },
  Universitario: { lat: -38.7058, lng: -62.2536 },
  'Villa Mitre': { lat: -38.7231, lng: -62.2458 },
  Patagonia: { lat: -38.6753, lng: -62.2221 },
  Palihue: { lat: -38.6942, lng: -62.2356 },
  Noroeste: { lat: -38.7042, lng: -62.2851 },
  'Harding Green': { lat: -38.7156, lng: -62.1956 },
  Grumbein: { lat: -38.7421, lng: -62.1482 },
  'Punta Alta': { lat: -38.8781, lng: -62.0728 },
};

export const BAHIA_BLANCA_CENTER: CoordenadaGeo = { lat: -38.7183, lng: -62.255 };

const cacheCoordenadas = new Map<string, CoordenadaGeo>();

/**
 * Obtiene las coordenadas de respaldo de un barrio con desfasaje determinista
 */
export const obtenerCoordenadasBarrio = (barrio: BarrioBahia, idMascota: string): CoordenadaGeo => {
  const base = BARRIO_COORDINATES[barrio] || BAHIA_BLANCA_CENTER;

  let hash = 0;
  for (let i = 0; i < idMascota.length; i++) {
    hash = idMascota.charCodeAt(i) + ((hash << 5) - hash);
  }

  const latOffset = ((hash % 100) / 10000) * 0.4;
  const lngOffset = (((hash >> 2) % 100) / 10000) * 0.4;

  return {
    lat: base.lat + latOffset,
    lng: base.lng + lngOffset,
  };
};

/**
 * Geocodifica en tiempo real la calle y altura exacta (ej: Teniente Lestani 3584)
 * mediante la API OpenStreetMap Nominatim. Si no la encuentra, utiliza el barrio como fallback.
 */
export const geocodificarDireccionMascota = async (
  zonaEspecifica: string,
  barrio: BarrioBahia,
  idMascota: string
): Promise<CoordenadaGeo> => {
  const ciudad = barrio === 'Punta Alta' ? 'Punta Alta' : 'Bahía Blanca';
  const direccionConsulta = `${zonaEspecifica.trim()}, ${ciudad}, Argentina`;

  if (cacheCoordenadas.has(direccionConsulta)) {
    return cacheCoordenadas.get(direccionConsulta)!;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionConsulta)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'es',
        'User-Agent': 'AlertaMascotaBB/1.0',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const coords: CoordenadaGeo = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        cacheCoordenadas.set(direccionConsulta, coords);
        return coords;
      }
    }
  } catch (err) {
    console.warn('Geocodificación Nominatim falló, usando coordenadas de barrio fallback:', err);
  }

  // Fallback por barrio si la dirección exacta no fue encontrada por Nominatim
  const coordsFallback = obtenerCoordenadasBarrio(barrio, idMascota);
  cacheCoordenadas.set(direccionConsulta, coordsFallback);
  return coordsFallback;
};
