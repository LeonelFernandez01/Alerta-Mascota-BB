import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Filter } from 'lucide-react';
import { useMascotas } from '../hooks/useMascotas';
import { geocodificarDireccionMascota, BAHIA_BLANCA_CENTER } from '../services/geoService';
import { crearIconoMascotaMapa } from '../utils/mapMarkerHelper';
import { MascotaDetailModal } from '../components/MascotaDetailModal';
import type { MascotaReportada, EstadoMascota } from '../types/mascota';
import { mapaStyles } from '../stylePg/mapaPage';

export const MapaPage: React.FC = () => {
  const { rawMascotas } = useMascotas();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filtroEstado, setFiltroEstado] = useState<EstadoMascota | 'todos'>('todos');
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<MascotaReportada | null>(null);

  const mascotasFiltradas = rawMascotas.filter((m) => {
    if (filtroEstado === 'todos') return true;
    return m.estado === filtroEstado;
  });

  // Inicializar mapa de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [BAHIA_BLANCA_CENTER.lat, BAHIA_BLANCA_CENTER.lng],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors • Alerta Mascota BB',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Actualizar marcadores cuando cambien los datos o filtros
  useEffect(() => {
    if (!markersLayerRef.current) return;

    const layerGroup = markersLayerRef.current;
    layerGroup.clearLayers();

    let isMounted = true;

    // Cargar marcadores resolviendo la dirección exacta de cada calle
    const cargarMarcadores = async () => {
      for (const mascota of mascotasFiltradas) {
        const coords = await geocodificarDireccionMascota(mascota.zonaEspecifica, mascota.barrio, mascota.id);
        if (!isMounted) break;

        const icon = crearIconoMascotaMapa(mascota);
        const marker = L.marker([coords.lat, coords.lng], { icon });

        const esPerdido = mascota.estado === 'perdido';
        const badgeClass = esPerdido ? 'background: #fff1f2; color: #e11d48;' : 'background: #ecfdf5; color: #059669;';

        const popupHtml = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
            <img src="${mascota.fotoUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;" />
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; ${badgeClass}">
                ${mascota.estado}
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #6366f1;">${mascota.barrio}</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">
              📍 ${mascota.zonaEspecifica}
            </div>
            <p style="font-size: 12px; font-weight: 600; color: #1e293b; margin: 4px 0 8px 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${mascota.descripcion}
            </p>
            <button 
              id="btn-popup-${mascota.id}" 
              style="width: 100%; background: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;"
            >
              Ver Ficha Completa
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-popup-${mascota.id}`);
          if (btn) {
            btn.onclick = () => setMascotaSeleccionada(mascota);
          }
        });

        layerGroup.addLayer(marker);
      }
    };

    cargarMarcadores();

    return () => {
      isMounted = false;
    };
  }, [mascotasFiltradas]);

  return (
    <div className={mapaStyles.container}>
      {/* Header */}
      <div className={mapaStyles.header}>
        <div className={mapaStyles.titleGroup}>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[10px] tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Geolocalización Comunitaria</span>
          </div>
          <h2 className={mapaStyles.title}>
            Mapa de Alertas Activas 🗺️
          </h2>
          <p className={mapaStyles.subtitle}>
            Ubica geográficamente los reportes de mascotas en Bahía Blanca y Punta Alta. Toca cualquier marcador para ver la foto y datos de contacto.
          </p>
        </div>

        {/* Filtros rápidos de estado */}
        <div className={mapaStyles.filterGroup}>
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filtrar:
          </span>
          <button
            onClick={() => setFiltroEstado('todos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroEstado === 'todos'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Todos ({rawMascotas.length})
          </button>

          <button
            onClick={() => setFiltroEstado('perdido')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroEstado === 'perdido'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-slate-100'
            }`}
          >
            Perdidos ({rawMascotas.filter((m) => m.estado === 'perdido').length})
          </button>

          <button
            onClick={() => setFiltroEstado('encontrado')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtroEstado === 'encontrado'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-slate-100'
            }`}
          >
            Encontrados ({rawMascotas.filter((m) => m.estado === 'encontrado').length})
          </button>
        </div>
      </div>

      {/* Contenedor del Mapa */}
      <div className={mapaStyles.mapContainer}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Leyenda */}
      <div className={mapaStyles.legendCard}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Mascota Perdida (Busqueda activa)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Mascota Encontrada (Resguardada)</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          * Coordenadas ubicadas por zona de referencia en Bahía Blanca & Punta Alta.
        </span>
      </div>

      {/* Modal de Detalle al hacer clic en el popup del mapa */}
      <MascotaDetailModal
        mascota={mascotaSeleccionada}
        onClose={() => setMascotaSeleccionada(null)}
      />
    </div>
  );
};
