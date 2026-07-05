import React from 'react';
import { MapPin, Calendar, MessageCircle, CheckCircle, Dog, Cat, HelpCircle } from 'lucide-react';
import type { MascotaReportada } from '../types/mascota';

interface MascotaCardProps {
  mascota: MascotaReportada;
  onClick: () => void;
  vista?: 'grid' | 'list';
}

export const MascotaCard: React.FC<MascotaCardProps> = ({ mascota, onClick, vista = 'grid' }) => {
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

  // Formatear la fecha para hacerla amigable y relativa
  const formatearFecha = (isoString: string): string => {
    try {
      const fechaReporte = new Date(isoString);
      const diffMs = Date.now() - fechaReporte.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      
      return fechaReporte.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  // Generar el enlace de WhatsApp
  const obtenerEnlaceWhatsApp = (): string => {
    const numeroLimpio = telefonoContacto.replace(/[^0-9]/g, '');
    const articulo = tipo === 'perro' ? 'un perro' : tipo === 'gato' ? 'un gato' : 'una mascota';
    const estadoTexto = estado === 'perdido' ? 'perdido' : 'encontrado';
    
    const mensaje = estado === 'perdido'
      ? `Hola ${nombreContacto}, vi tu publicación en Alerta Mascota BB sobre ${articulo} ${estadoTexto} en el barrio ${barrio} y me quería poner en contacto contigo.`
      : `Hola ${nombreContacto}, vi tu publicación en Alerta Mascota BB sobre ${articulo} ${estadoTexto} en el barrio ${barrio} y quería consultarte si ya apareció el dueño o darte información.`;

    return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
  };

  // Ícono dinámico según el tipo de animal
  const obtenerIconoAnimal = () => {
    switch (tipo) {
      case 'perro':
        return <Dog className="w-3.5 h-3.5" />;
      case 'gato':
        return <Cat className="w-3.5 h-3.5" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  // 1. RENDERIZADO VISTA DE LISTA COMPACTA
  if (vista === 'list') {
    return (
      <article 
        onClick={onClick}
        className="group bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100/80 dark:border-slate-800/80 overflow-hidden transition-all duration-300 hover:shadow-md flex items-center p-3 md:p-4 gap-3.5 md:gap-5 transition-colors cursor-pointer w-full"
      >
        {/* Foto de la Mascota a la izquierda */}
        <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0">
          <img
            src={fotoUrl}
            alt={`Mascota ${estado}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Información central */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Barrio y calle */}
          <span className="text-[10px] md:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight truncate">
            {barrio} • <span className="text-slate-500 dark:text-slate-400 font-normal">{zonaEspecifica}</span>
          </span>

          {/* Estado y tipo */}
          <div className="flex items-center gap-1.5 mt-0.5 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-wide ${
              estado === 'perdido' 
                ? 'bg-rose-50/90 dark:bg-rose-950/70 text-rose-600 dark:text-rose-455' 
                : 'bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-450'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${estado === 'perdido' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              {estado}
            </span>
            
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
              {obtenerIconoAnimal()}
              {tipo}
            </span>
          </div>

          {/* Breve descripción snippet (solo visible en tablets/desktop) */}
          <p className="hidden md:block text-slate-500 dark:text-slate-350 text-xs leading-relaxed mt-1 mb-2 line-clamp-2 max-w-xl">
            {descripcion}
          </p>

          {/* Fecha y nombre del reportante (Móvil) */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none md:mt-0.5">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formatearFecha(fecha)} <span className="sm:hidden">• Por {nombreContacto}</span></span>
          </div>
        </div>

        {/* Sección de contacto derecha (Redistribuida para responsive) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Perfil del reportante (Oculto en móvil, visible en tablets/desktop) */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-4 mr-1">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex-shrink-0">
              {nombreContacto.charAt(0).toUpperCase()}
            </div>
            <div className="max-w-[90px] overflow-hidden text-left">
              <span className="text-slate-800 dark:text-slate-200 text-xs font-semibold block truncate leading-tight">{nombreContacto}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none mt-0.5">Reportante</span>
            </div>
          </div>

          {/* Botón de WhatsApp dinámico */}
          <a
            href={obtenerEnlaceWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-3 md:py-2.5 md:px-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-650 text-white rounded-xl md:rounded-2xl transition-colors flex-shrink-0 active:scale-95 shadow-sm shadow-emerald-600/10 dark:shadow-none cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Contactar por WhatsApp"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-600 dark:text-emerald-500" />
            <span className="hidden md:inline">Contactar</span>
          </a>
        </div>
      </article>
    );
  }

  // 2. RENDERIZADO VISTA DE CUADRÍCULA (GRID) CLÁSICA
  return (
    <article 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100/80 dark:border-slate-800/80 overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01] flex flex-col h-full transition-colors duration-300 cursor-pointer"
    >
      {/* Sección de la Imagen */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <img
          src={fotoUrl}
          alt={`Mascota ${estado}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Capa de degradado superior para visibilidad de los badges */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />

        {/* Badge de Estado (Perdido/Encontrado) */}
        <div className="absolute top-3 left-3 z-10">
          {estado === 'perdido' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-rose-50/95 dark:bg-rose-950/90 text-rose-600 dark:text-rose-455 border border-rose-200/50 dark:border-rose-900/30 backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              Perdido
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-450 border border-emerald-200/50 dark:border-emerald-900/30 backdrop-blur-sm shadow-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Encontrado
            </span>
          )}
        </div>

        {/* Badge del tipo de animal */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/75 dark:bg-slate-950/85 text-white backdrop-blur-sm shadow-sm capitalize">
            {obtenerIconoAnimal()}
            {tipo}
          </span>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Ubicación y Barrio */}
        <div className="flex items-start gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold tracking-tight text-xs uppercase mb-1">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
          <div>
            <span className="text-indigo-700 dark:text-indigo-400">{barrio}</span>
            <span className="mx-1 text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 normal-case font-normal text-xs">{zonaEspecifica}</span>
          </div>
        </div>

        {/* Fecha de Publicación */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mb-3">
          <Calendar className="w-3 h-3" />
          <span>{formatearFecha(fecha)}</span>
        </div>

        {/* Descripción */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
          {descripcion}
        </p>

        {/* Señas Particulares */}
        {señasParticulares && (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/20 text-xs">
            <span className="font-semibold text-indigo-900 dark:text-indigo-200 block mb-0.5">Señas Particulares:</span>
            <span className="text-slate-600 dark:text-slate-355 leading-relaxed truncate block">{señasParticulares}</span>
          </div>
        )}

        {/* Separador */}
        <div className="h-px bg-slate-100/80 dark:bg-slate-800/80 w-full mb-4" />

        {/* Contacto (Fila de perfil arriba del botón) */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex-shrink-0">
            {nombreContacto.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-slate-800 dark:text-slate-200 text-xs font-semibold block leading-tight">{nombreContacto}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none mt-0.5">Reportante</span>
          </div>
        </div>

        {/* Botón de WhatsApp a ancho completo */}
        <a
          href={obtenerEnlaceWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-650 text-white font-semibold py-2.5 px-4 rounded-2xl text-xs transition-colors w-full active:scale-[0.98] shadow-sm shadow-emerald-600/10 dark:shadow-none cursor-pointer mt-auto"
        >
          <MessageCircle className="w-4 h-4 fill-white text-emerald-600 dark:text-emerald-500" />
          Contactar por WhatsApp
        </a>
      </div>
    </article>
  );
};
