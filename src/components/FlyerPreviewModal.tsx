import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Loader2, Sparkles, Check } from 'lucide-react';
import type { MascotaReportada } from '../types/mascota';
import { generarCartelMascotaCanvas } from '../services/flyerGeneratorService';

interface FlyerPreviewModalProps {
  mascota: MascotaReportada | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FlyerPreviewModal: React.FC<FlyerPreviewModalProps> = ({
  mascota,
  isOpen,
  onClose,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && mascota) {
      setLoading(true);
      setImageUrl(null);
      generarCartelMascotaCanvas(mascota)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((err) => {
          console.error('Error generando afiche:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, mascota]);

  if (!isOpen || !mascota) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `alerta-mascota-${mascota.barrio.toLowerCase()}-${mascota.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    if (navigator.share) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `cartel-${mascota.id}.png`, { type: 'image/png' });
        await navigator.share({
          title: `Alerta Mascota BB - ${mascota.estado.toUpperCase()}`,
          text: `Difundir alerta de ${mascota.tipo} ${mascota.estado} en Barrio ${mascota.barrio}.`,
          files: [file],
        });
      } catch (err) {
        // Fallback simple a copiar enlace
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative my-6 cursor-default"
      >
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-tight">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Afiche de Búsqueda Generado</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Previsualización del Cartel */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[380px] bg-slate-950/50 relative">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-slate-400 my-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="text-xs font-semibold">Generando cartel en alta resolución con QR...</span>
            </div>
          ) : imageUrl ? (
            <div className="relative group w-full flex justify-center">
              <img
                src={imageUrl}
                alt="Afiche Generado"
                className="max-h-[60vh] w-auto object-contain rounded-2xl shadow-xl border border-slate-800/80 transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          ) : (
            <div className="text-rose-400 text-xs font-semibold">
              No se pudo generar el afiche. Revisa la imagen o la conexión.
            </div>
          )}
        </div>

        {/* Footer con Acciones */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={loading || !imageUrl}
            className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar Imagen HD (PNG)
          </button>

          <button
            onClick={handleShare}
            disabled={loading || !imageUrl}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-300" />
                <span>Compartir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
