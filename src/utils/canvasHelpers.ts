/**
 * Utilidades generales para manipulaciones de HTML5 Canvas
 */

/**
 * Dibuja un rectángulo con bordes redondeados en un contexto de Canvas 2D
 */
export const dibujarRectanguloRedondeado = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void => {
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
 * Divide y envuelve texto en múltiples líneas si excede el ancho máximo disponible
 */
export const envolverTexto = (
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

/**
 * Crea una imagen sintética de fallback cuando una foto no puede cargarse
 */
export const crearImagenFallback = (texto: string): HTMLImageElement => {
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
    ctx.fillText(texto, 200, 200);
  }
  const fallbackImg = new Image();
  fallbackImg.src = fallbackCanvas.toDataURL();
  return fallbackImg;
};
