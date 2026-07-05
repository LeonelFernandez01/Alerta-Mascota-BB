import React from 'react';
import { X, MapPin, Calendar, MessageCircle, CheckCircle, Dog, Cat, HelpCircle, Shield } from 'lucide-react';
import type { MascotaReportada } from '../../core/types/mascota';

interface MascotaDetailModalProps {
  mascota: MascotaReportada | null;
  onClose: () => void;
}

export const MascotaDetailModal: React.FC<MascotaDetailModalProps> = ({ mascota, onClose }) => {
  if (!mascota) return null;

  const {
    tipo,
    estado,
    barrio,
    zonaEspecifica,
    fecha,
    fotoUrl,
    descripcion,
    señasParticulares,
    telefonoContacto,
    nombreContacto,
  } = mascota;

  // Formatear fecha amigable
  const formatearFecha = (isoString: string): string => {
    try {
      const fechaReporte = new Date(isoString);
      return fechaReporte.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const obtenerEnlaceWhatsApp = (): string => {
    const numeroLimpio = telefonoContacto.replace(/[^0-9]/g, '');
    const articulo = tipo === 'perro' ? 'un perro' : tipo === 'gato' ? 'un gato' : 'una mascota';
    const estadoTexto = estado === 'perdido' ? 'perdido' : 'encontrado';
    
    const mensaje = estado === 'perdido'
      ? `Hola ${nombreContacto}, vi tu publicación en Alerta Mascota BB sobre ${articulo} ${estadoTexto} en el barrio ${barrio} y me quería poner en contacto contigo.`
      : `Hola ${nombreContacto}, vi tu publicación en Alerta Mascota BB sobre ${articulo} ${estadoTexto} en el barrio ${barrio} y quería consultarte si ya apareció el dueño o darte información.`;

    return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
  };

  const obtenerIconoAnimal = () => {
    switch (tipo) {
      case 'perro':
        return <Dog className="w-4 h-4" />;
      case 'gato':
        return <Cat className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  // Prevenir que hacer clic dentro de la tarjeta cierre el modal
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md transition-all duration-300 animate-fade-in overflow-y-auto cursor-pointer"
    >
      {/* Tarjeta con Efecto Glassmorphism Avanzado */}
      <div 
        onClick={handleCardClick}
        className="w-full max-w-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-800/40 rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative my-8 transform scale-100 transition-transform duration-300 cursor-default"
      >
        {/* Imagen del Reporte */}
        <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex-shrink-0">
          <img
            src={fotoUrl}
            alt={`Detalle Mascota ${estado}`}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

          {/* Botón de Cierre */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-slate-900/60 dark:bg-slate-950/60 text-white rounded-full hover:bg-slate-900/85 dark:hover:bg-slate-950/85 backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge de Estado */}
          <div className="absolute top-3 left-3">
            {estado === 'perdido' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-rose-50/95 dark:bg-rose-950/90 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 backdrop-blur-sm shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Perdido
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-450 border border-emerald-200/50 dark:border-emerald-900/30 backdrop-blur-sm shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Encontrado
              </span>
            )}
          </div>
        </div>

        {/* Detalles del Reporte */}
        <div className="p-6 flex flex-col space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Fila de Ubicación */}
          <div className="flex items-start gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight text-xs">
            <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-indigo-700 dark:text-indigo-400">{barrio}</span>
              <span className="mx-1 text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 normal-case font-normal">{zonaEspecifica}</span>
            </div>
          </div>

          {/* Fila de Animal y Fecha */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/30 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg capitalize font-semibold shadow-sm">
              {obtenerIconoAnimal()}
              {tipo}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="capitalize">{formatearFecha(fecha)}</span>
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-slate-200/60 dark:bg-slate-850/60 w-full" />

          {/* Descripción Completa */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Detalles del reporte</h4>
            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium">
              {descripcion}
            </p>
          </div>

          {/* Señas Particulares */}
          {señasParticulares && (
            <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/20 dark:border-indigo-900/20 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                Señas Particulares:
              </span>
              <span className="text-slate-600 dark:text-slate-300 leading-relaxed block">{señasParticulares}</span>
            </div>
          )}

          {/* Datos del Reportante (Ajustado para alto contraste en Dark Mode) */}
          <div className="flex items-center gap-3.5 p-4 bg-white/70 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-slate-800/40 shadow-sm transition-colors">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm border border-slate-250 dark:border-slate-700 flex-shrink-0">
              {nombreContacto.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-slate-800 dark:text-slate-100 text-xs font-extrabold block">{nombreContacto}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-medium">Vecino publicador</span>
            </div>
          </div>
        </div>

        {/* Footer con Botón a lo ancho */}
        <div className="p-6 border-t border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/30 flex-shrink-0">
          <a
            href={obtenerEnlaceWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold py-3.5 px-5 rounded-2xl text-xs transition-colors shadow-md shadow-emerald-600/10 dark:shadow-none active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-600 dark:text-emerald-500" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
