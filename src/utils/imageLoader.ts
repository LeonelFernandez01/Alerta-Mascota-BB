import { crearImagenFallback } from './canvasHelpers';

/**
 * Carga una imagen de forma asíncrona usando Fetch + Blob Base64
 * Evita problemas de seguridad CORS en HTML5 Canvas al exportar a DataURL
 */
export const cargarImagen = async (src: string): Promise<HTMLImageElement> => {
  if (src.startsWith('data:')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(crearImagenFallback('Foto no disponible'));
      img.src = src;
    });
  }

  try {
    const res = await fetch(src, { mode: 'cors' });
    if (!res.ok) throw new Error('Error en descarga de imagen');
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(crearImagenFallback('Error al renderizar'));
      img.src = dataUrl;
    });
  } catch {
    // Asignación directa como mecanismo secundario si falla fetch
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(crearImagenFallback('Imagen no disponible'));
      img.src = src;
    });
  }
};
