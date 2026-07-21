import type { MascotaReportada } from '../types/mascota';
import { dibujarRectanguloRedondeado, envolverTexto } from './canvasHelpers';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

/**
 * Dibuja el fondo del afiche con un degradado oscuro profesional
 */
export const dibujarFondoFlyer = (ctx: CanvasRenderingContext2D): void => {
  const gradienteFondo = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradienteFondo.addColorStop(0, '#0f172a');
  gradienteFondo.addColorStop(0.5, '#1e293b');
  gradienteFondo.addColorStop(1, '#090d16');
  ctx.fillStyle = gradienteFondo;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

/**
 * Dibuja la cabecera institucional
 */
export const dibujarHeaderFlyer = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🐾 ALERTA MASCOTA BB', 60, 75);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Bahía Blanca & Punta Alta', CANVAS_WIDTH - 60, 75);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 100);
  ctx.lineTo(CANVAS_WIDTH - 60, 100);
  ctx.stroke();
};

/**
 * Dibuja el banner principal de estado (SE BUSCA / ENCONTRADO)
 */
export const dibujarBannerEstado = (
  ctx: CanvasRenderingContext2D,
  mascota: MascotaReportada,
  colorPrimario: string
): void => {
  const bannerY = 125;
  const bannerHeight = 90;
  dibujarRectanguloRedondeado(ctx, 60, bannerY, CANVAS_WIDTH - 120, bannerHeight, 24);
  ctx.fillStyle = colorPrimario;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';

  const esPerdido = mascota.estado === 'perdido';
  const tituloBanner = esPerdido 
    ? `¡SE BUSCA ${mascota.tipo.toUpperCase()}!` 
    : `¡${mascota.tipo.toUpperCase()} ENCONTRADO!`;
  ctx.fillText(tituloBanner, CANVAS_WIDTH / 2, bannerY + 62);
};

/**
 * Dibuja el contenedor de la foto de la mascota con efecto backdrop
 */
export const dibujarContenedorFoto = (
  ctx: CanvasRenderingContext2D,
  fotoMascota: HTMLImageElement,
  colorPrimario: string
): void => {
  const fotoContainerY = 240;
  const fotoContainerHeight = 500;
  const fotoContainerWidth = CANVAS_WIDTH - 120;

  dibujarRectanguloRedondeado(ctx, 60, fotoContainerY, fotoContainerWidth, fotoContainerHeight, 28);
  ctx.fillStyle = '#020617';
  ctx.fill();
  ctx.strokeStyle = colorPrimario;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.save();
  dibujarRectanguloRedondeado(ctx, 64, fotoContainerY + 4, fotoContainerWidth - 8, fotoContainerHeight - 8, 24);
  ctx.clip();

  // Fondo desenfocado
  ctx.globalAlpha = 0.25;
  ctx.drawImage(fotoMascota, 60, fotoContainerY, fotoContainerWidth, fotoContainerHeight);
  ctx.globalAlpha = 1.0;

  // Foto nítida centrada proporcionalmente
  const imgAspect = fotoMascota.width / fotoMascota.height;
  const containerAspect = fotoContainerWidth / fotoContainerHeight;

  let drawW = fotoContainerWidth;
  let drawH = fotoContainerHeight;
  let drawX = 60;
  let drawY = fotoContainerY;

  if (imgAspect > containerAspect) {
    drawH = fotoContainerWidth / imgAspect;
    drawY = fotoContainerY + (fotoContainerHeight - drawH) / 2;
  } else {
    drawW = fotoContainerHeight * imgAspect;
    drawX = 60 + (fotoContainerWidth - drawW) / 2;
  }
  ctx.drawImage(fotoMascota, drawX, drawY, drawW, drawH);
  ctx.restore();
};

/**
 * Dibuja el bloque con la información de ubicación y barrio
 */
export const dibujarBloqueUbicacion = (
  ctx: CanvasRenderingContext2D,
  mascota: MascotaReportada
): void => {
  const infoY = 770;
  dibujarRectanguloRedondeado(ctx, 60, infoY, CANVAS_WIDTH - 120, 110, 20);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📍 UBICACIÓN Y ZONA:', 90, infoY + 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Barrio ${mascota.barrio}`, 90, infoY + 82);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(mascota.zonaEspecifica, CANVAS_WIDTH - 90, infoY + 82);
};

/**
 * Dibuja la sección con la descripción y señas particulares
 */
export const dibujarBloqueDescripcion = (
  ctx: CanvasRenderingContext2D,
  mascota: MascotaReportada
): void => {
  const descY = 905;
  const descBoxHeight = 220;
  dibujarRectanguloRedondeado(ctx, 60, descY, CANVAS_WIDTH - 120, descBoxHeight, 20);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📝 DESCRIPCIÓN Y SEÑAS:', 90, descY + 40);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 22px system-ui, -apple-system, sans-serif';

  const textoCompleto = [
    mascota.descripcion,
    mascota.señasParticulares ? `Señas: ${mascota.señasParticulares}` : ''
  ].filter(Boolean).join(' | ');

  const lineasDesc = envolverTexto(ctx, textoCompleto, CANVAS_WIDTH - 180);
  let lineY = descY + 80;
  lineasDesc.slice(0, 4).forEach((linea) => {
    ctx.fillText(linea, 90, lineY);
    lineY += 34;
  });
};

/**
 * Dibuja la sección inferior (Footer) con datos de contacto y código QR
 */
export const dibujarFooterContacto = (
  ctx: CanvasRenderingContext2D,
  mascota: MascotaReportada,
  qrCodeImage: HTMLImageElement,
  colorPrimario: string,
  colorPrimarioClaro: string
): void => {
  const footerY = 1150;
  const footerHeight = 150;

  dibujarRectanguloRedondeado(ctx, 60, footerY, CANVAS_WIDTH - 120, footerHeight, 24);
  ctx.fillStyle = colorPrimarioClaro;
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CONTACTO DIRECTO POR WHATSAPP:', 90, footerY + 45);

  ctx.fillStyle = colorPrimario;
  ctx.font = '900 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(`📞 ${mascota.telefonoContacto}`, 90, footerY + 95);

  ctx.fillStyle = '#475569';
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Preguntar por: ${mascota.nombreContacto}`, 90, footerY + 128);

  const qrSize = 120;
  const qrX = CANVAS_WIDTH - 60 - qrSize - 15;
  const qrY = footerY + 15;

  ctx.fillStyle = '#ffffff';
  dibujarRectanguloRedondeado(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 12);
  ctx.fill();

  ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);
};
