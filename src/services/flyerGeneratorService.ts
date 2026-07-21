import type { MascotaReportada } from '../types/mascota';
import { cargarImagen } from '../utils/imageLoader';
import { obtenerImagenQR } from '../utils/qrGenerator';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  dibujarFondoFlyer,
  dibujarHeaderFlyer,
  dibujarBannerEstado,
  dibujarContenedorFoto,
  dibujarBloqueUbicacion,
  dibujarBloqueDescripcion,
  dibujarFooterContacto
} from '../utils/flyerDrawers';

/**
 * Servicio Orquestador para la generación de carteles de búsqueda (Flyers)
 * Delega el renderizado en componentes atómicos de dibujo en Canvas.
 */
export const generarCartelMascotaCanvas = async (mascota: MascotaReportada): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el contexto de Canvas 2D');
  }

  const esPerdido = mascota.estado === 'perdido';
  const colorPrimario = esPerdido ? '#e11d48' : '#059669';
  const colorPrimarioClaro = esPerdido ? '#fff1f2' : '#ecfdf5';

  // 1. Carga asíncrona de recursos en paralelo
  const appUrl = window.location.href;
  const [fotoMascota, qrCodeImage] = await Promise.all([
    cargarImagen(mascota.fotoUrl),
    obtenerImagenQR(appUrl)
  ]);

  // 2. Orquestación del dibujado atómico por capas
  dibujarFondoFlyer(ctx);
  dibujarHeaderFlyer(ctx);
  dibujarBannerEstado(ctx, mascota, colorPrimario);
  dibujarContenedorFoto(ctx, fotoMascota, colorPrimario);
  dibujarBloqueUbicacion(ctx, mascota);
  dibujarBloqueDescripcion(ctx, mascota);
  dibujarFooterContacto(ctx, mascota, qrCodeImage, colorPrimario, colorPrimarioClaro);

  return canvas.toDataURL('image/png');
};
