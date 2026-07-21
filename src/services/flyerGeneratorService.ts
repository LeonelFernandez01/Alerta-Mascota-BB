import type { MascotaReportada } from '../types/mascota';

/**
 * Servicio puro para la generación de carteles de búsqueda (Flyers)
 * Utiliza HTML5 Canvas para renderizar una imagen de alta resolución (1080x1350 px - Formato 4:5)
 * lista para compartir en Instagram Stories, WhatsApp o imprimir.
 */

// Helper para cargar imagen de forma asíncrona con soporte CORS
const cargarImagen = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Si la imagen falla por CORS u otro error, creamos un fallback
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 400;
      fallbackCanvas.height = 400;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sin imagen previa', 200, 200);
      }
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.src = fallbackCanvas.toDataURL();
    };
    img.src = src;
  });
};

// Genera una imagen QR mediante API con soporte CORS y fallback en Canvas
const obtenerImagenQR = (textoUrl: string): Promise<HTMLImageElement> => {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(textoUrl)}&color=000000&bgcolor=ffffff&margin=2`;
  return cargarImagen(qrApiUrl);
};

/**
 * Dibuja un rectángulo con bordes redondeados en Canvas
 */
const dibujarRectanguloRedondeado = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

/**
 * Trunca o envuelve texto en múltiples líneas si excede el ancho máximo
 */
const envolverTexto = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

export const generarCartelMascotaCanvas = async (mascota: MascotaReportada): Promise<string> => {
  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el contexto de Canvas 2D');
  }

  const esPerdido = mascota.estado === 'perdido';
  const colorPrimario = esPerdido ? '#e11d48' : '#059669'; // Rose 600 o Emerald 600
  const colorPrimarioClaro = esPerdido ? '#fff1f2' : '#ecfdf5';

  // 1. Fondo principal con degradado elegante
  const gradienteFondo = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradienteFondo.addColorStop(0, '#0f172a'); // Slate 900
  gradienteFondo.addColorStop(0.5, '#1e293b'); // Slate 800
  gradienteFondo.addColorStop(1, '#090d16'); // Dark slate
  ctx.fillStyle = gradienteFondo;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Cargar fotos necesarias en paralelo
  const appUrl = window.location.href;
  const [fotoMascota, qrCodeImage] = await Promise.all([
    cargarImagen(mascota.fotoUrl),
    obtenerImagenQR(appUrl)
  ]);

  // 2. Encabezado Superior (Header Brand)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🐾 ALERTA MASCOTA BB', 60, 75);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 20px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Bahía Blanca & Punta Alta', CANVAS_WIDTH - 60, 75);

  // Línea divisoria superior
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 100);
  ctx.lineTo(CANVAS_WIDTH - 60, 100);
  ctx.stroke();

  // 3. Banner de Estado (SE BUSCA / ENCONTRADO)
  const bannerY = 125;
  const bannerHeight = 90;
  dibujarRectanguloRedondeado(ctx, 60, bannerY, CANVAS_WIDTH - 120, bannerHeight, 24);
  ctx.fillStyle = colorPrimario;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  const tituloBanner = esPerdido 
    ? `¡SE BUSCA ${mascota.tipo.toUpperCase()}!` 
    : `¡${mascota.tipo.toUpperCase()} ENCONTRADO!`;
  ctx.fillText(tituloBanner, CANVAS_WIDTH / 2, bannerY + 62);

  // 4. Contenedor de la Foto Principal (500px de alto aprox)
  const fotoContainerY = 240;
  const fotoContainerHeight = 500;
  const fotoContainerWidth = CANVAS_WIDTH - 120;

  // Fondo del contenedor de la foto
  dibujarRectanguloRedondeado(ctx, 60, fotoContainerY, fotoContainerWidth, fotoContainerHeight, 28);
  ctx.fillStyle = '#020617';
  ctx.fill();
  ctx.strokeStyle = colorPrimario;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Dibujar la foto centrada manteniendo aspecto (contain)
  ctx.save();
  dibujarRectanguloRedondeado(ctx, 64, fotoContainerY + 4, fotoContainerWidth - 8, fotoContainerHeight - 8, 24);
  ctx.clip();

  // Fondo borroso simulado si la foto no llena todo
  ctx.globalAlpha = 0.25;
  ctx.drawImage(fotoMascota, 60, fotoContainerY, fotoContainerWidth, fotoContainerHeight);
  ctx.globalAlpha = 1.0;

  // Dibujar foto nítida centrada
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

  // 5. Bloque de Datos e Información Key
  const infoY = 770;

  // Barrio & Zona Card
  dibujarRectanguloRedondeado(ctx, 60, infoY, CANVAS_WIDTH - 120, 110, 20);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#818cf8'; // Indigo 400
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

  // 6. Descripción y Señas Particulares
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

  // 7. Footer de Contacto y Código QR
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

  return canvas.toDataURL('image/png');
};
