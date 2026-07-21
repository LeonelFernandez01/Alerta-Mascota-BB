import L from 'leaflet';
import type { MascotaReportada } from '../types/mascota';

/**
 * Crea un DivIcon personalizado de Leaflet para representar cada mascota en el mapa
 * con bordes redondeados, silueta de color y sombra.
 */
export const crearIconoMascotaMapa = (mascota: MascotaReportada): L.DivIcon => {
  const esPerdido = mascota.estado === 'perdido';
  const colorBg = esPerdido ? '#e11d48' : '#059669'; // Rose 600 o Emerald 600
  const emojiAnimal = mascota.tipo === 'perro' ? '🐶' : mascota.tipo === 'gato' ? '🐱' : '🐾';

  const html = `
    <div style="
      background-color: ${colorBg};
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: transform 0.2s ease;
    ">
      ${emojiAnimal}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};
