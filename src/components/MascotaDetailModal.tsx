import React, { useState } from 'react';
import { X, MapPin, Calendar, MessageCircle, CheckCircle, Dog, Cat, HelpCircle, Shield, Sparkles, Share2, Check, CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';
import type { MascotaReportada } from '../types/mascota';
import { FlyerPreviewModal } from './FlyerPreviewModal';
import { useAuth } from '../hooks/useAuth';
import { useMascotas } from '../hooks/useMascotas';

interface MascotaDetailModalProps {
  mascota: MascotaReportada | null;
  onClose: () => void;
}

export const MascotaDetailModal: React.FC<MascotaDetailModalProps> = ({ mascota, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { rawMascotas, cambiarEstadoMascota, eliminarMascota } = useMascotas();
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!mascota) return null;

  // Sincronizar con la lista global por si cambió el estado en vivo mientras está abierto el modal
  const mascotaActual = rawMascotas.find((m) => m.id === mascota.id) || mascota;

  const {
    id,
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
  } = mascotaActual;

  const esMiPublicacion = Boolean(
    isAuthenticated &&
      user &&
      (user.telefono === telefonoContacto || user.nombre.toLowerCase() === nombreContacto.toLowerCase())
  );

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?alerta=${encodeURIComponent(id)}`;
    const shareTitle = `Alerta Mascota BB: ${tipo.toUpperCase()} ${estado.toUpperCase()} en ${barrio}`;
    const shareText = `${shareTitle} (${zonaEspecifica}). Contacto: ${nombreContacto}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback a portapapeles si el usuario cancela o falla
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Noop
    }
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 dark:bg-black/65 backdrop-blur-xl transition-all duration-300 animate-fade-in overflow-y-auto cursor-pointer"
    >
      {/* Tarjeta con Efecto Glassmorphism Avanzado */}
      <div 
        onClick={handleCardClick}
        className="w-full max-w-lg glass-panel rounded-[32px] shadow-[0_32px_64px_rgba(99,102,241,0.18)] dark:shadow-[0_32px_64px_rgba(99,102,241,0.22)] border border-white/40 dark:border-slate-800/50 overflow-hidden flex flex-col relative my-8 transform scale-100 transition-transform duration-300 cursor-default"
      >
        {/* Imagen del Reporte (Foto completa con fondo difuminado) */}
        <div className="relative h-[280px] sm:h-[340px] w-full bg-slate-950 overflow-hidden flex items-center justify-center flex-shrink-0">
          {/* Fondo difuminado para rellenar bordes */}
          <img
            src={fotoUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-105 pointer-events-none select-none"
          />
          {/* Foto original centrada sin recortar */}
          <img
            src={fotoUrl}
            alt={`Detalle Mascota ${estado}`}
            className="relative z-10 max-w-full max-h-full object-contain pointer-events-none"
          />
          
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-20" />

          {/* Botón de Cierre */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-slate-900/60 dark:bg-slate-950/60 text-white rounded-full hover:bg-slate-900/85 dark:hover:bg-slate-950/85 backdrop-blur-sm transition-all active:scale-95 cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge de Estado */}
          <div className="absolute top-3 left-3 z-20">
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

          {/* Datos del Reportante */}
          <div className="flex items-center justify-between gap-3.5 p-4 bg-white/70 dark:bg-slate-800/40 rounded-2xl border border-white/30 dark:border-slate-800/40 shadow-sm transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 flex-shrink-0">
                {nombreContacto.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-slate-800 dark:text-slate-100 text-xs font-extrabold block">{nombreContacto}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 font-medium">
                  {esMiPublicacion ? 'Tu publicación activa' : 'Vecino publicador'}
                </span>
              </div>
            </div>

            {esMiPublicacion && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                Autor
              </span>
            )}
          </div>

          {/* Barra de gestión directa para el autor de la alerta */}
          {esMiPublicacion && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/70 border border-indigo-200/50 dark:border-slate-700/70 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                 Administrar mi alerta
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cambiarEstadoMascota(id, estado === 'perdido' ? 'encontrado' : 'perdido')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                    estado === 'perdido'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {estado === 'perdido' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      ¡Marcar como Encontrado!
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Volver a Perdido
                    </>
                  )}
                </button>

                {confirmDelete ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        await eliminarMascota(id);
                        setConfirmDelete(false);
                        onClose();
                      }}
                      className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer active:scale-95"
                    >
                      Borrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/70 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-800/50 transition-colors cursor-pointer active:scale-95"
                    title="Eliminar publicación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer con Botones de Acción */}
        <div className="p-6 border-t border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/30 flex-shrink-0 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFlyerOpen(true)}
              className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Generar Cartel</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              title="Compartir enlace directo a esta alerta"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="sm:hidden md:inline">Compartir</span>
                </>
              )}
            </button>
          </div>

          <a
            href={obtenerEnlaceWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2.5 w-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold py-3.5 px-5 rounded-2xl text-xs transition-colors shadow-md shadow-emerald-600/10 dark:shadow-none active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-600 dark:text-emerald-500" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      {/* Modal de Previsualización y Descarga del Afiche */}
      <FlyerPreviewModal
        mascota={mascota}
        isOpen={isFlyerOpen}
        onClose={() => setIsFlyerOpen(false)}
      />
    </div>
  );
};
