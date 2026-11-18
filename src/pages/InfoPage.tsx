import React, { useState } from 'react';
import { MapPin, Sparkles, Bookmark, CheckCircle2, ChevronDown, ShieldCheck, MessageCircle } from 'lucide-react';
import { infoStyles } from '../stylePg/infoPage';

interface PasoGuia {
  numero: string;
  titulo: string;
  descripcion: string;
  icon: React.ReactNode;
  badgeColor: string;
}

const PASOS_GUIA: PasoGuia[] = [
  {
    numero: '01',
    titulo: 'Publica la Alerta en Segundos',
    descripcion: 'Sube una foto nítida, indica el barrio y la calle o intersección. Si iniciaste sesión como vecino, tu nombre y WhatsApp se autocompletan al instante.',
    icon: <MapPin className="w-5 h-5" />,
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  },
  {
    numero: '02',
    titulo: 'Genera el Cartel HD con Código QR',
    descripcion: 'Desde cualquier alerta puedes tocar "Generar Cartel" para descargar un afiche listo para imprimir o compartir en historias. Su código QR lleva directo a la ficha online.',
    icon: <Sparkles className="w-5 h-5" />,
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
  },
  {
    numero: '03',
    titulo: 'Ubica en el Mapa y Guarda en Seguimiento',
    descripcion: 'Explora el Mapa Interactivo filtrando por barrio o especie, y usa el ícono de marcador para guardar casos en tu lista de seguimiento rápido.',
    icon: <Bookmark className="w-5 h-5" />,
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  {
    numero: '04',
    titulo: 'Contacto Directo y Cierre del Caso',
    descripcion: 'Los vecinos se comunican con un clic vía WhatsApp. Cuando la mascota vuelve a casa, puedes marcarla como "¡Encontrado!" desde el detalle o tu perfil.',
    icon: <CheckCircle2 className="w-5 h-5" />,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  }
];

const PREGUNTAS_FRECUENTES = [
  {
    pregunta: '¿Tiene algún costo publicar o generar carteles de búsqueda?',
    respuesta: 'No. Alerta Mascota BB es 100% gratuita, solidaria y abierta para todos los vecinos de Bahía Blanca, Punta Alta y la región.'
  },
  {
    pregunta: '¿Cómo se posicionan los pines en el Mapa Interactivo?',
    respuesta: 'El sistema geocodifica automáticamente la calle o intersección que escribas en "Referencia de Zona" dentro de Bahía Blanca o Punta Alta utilizando OpenStreetMap Nominatim.'
  },
  {
    pregunta: '¿Cómo cambio el estado de mi mascota cuando ya apareció?',
    respuesta: 'Si ingresaste con tu cuenta de vecino, al abrir tu publicación (o entrando a tu Perfil > Mis Publicaciones) verás el botón "¡Marcar como Encontrado!" y la opción de eliminar la alerta.'
  },
  {
    pregunta: '¿Para qué sirve el botón de Guardados en las tarjetas?',
    respuesta: 'Te permite marcar alertas específicas que estés ayudando a difundir o que hayas visto por tu cuadra, para filtrarlas con un solo toque desde la barra superior.'
  }
];

export const InfoPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main className={infoStyles.container}>
      <div className={infoStyles.header}>
        <img src="/logo.svg" alt="Alerta Mascota BB Logo" className={infoStyles.logo} />
        <h2 className={infoStyles.title}>Alerta Mascota BB</h2>
        <p className={infoStyles.subtitle}>Bahía Blanca • Punta Alta • Red Vecinal Solidaria</p>
      </div>

      {/* Guía visual paso a paso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PASOS_GUIA.map((paso) => (
          <div
            key={paso.numero}
            className="glass-panel p-5 rounded-3xl border border-white/40 dark:border-slate-800/60 shadow-sm flex flex-col gap-3 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-2xl border ${paso.badgeColor}`}>
                {paso.icon}
              </div>
              <span className="text-xs font-black text-slate-300 dark:text-slate-700 tracking-widest">
                PASO {paso.numero}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
              {paso.titulo}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {paso.descripcion}
            </p>
          </div>
        ))}
      </div>

      {/* Normas y Preguntas Frecuentes */}
      <div className={infoStyles.contentBox}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <h3 className={infoStyles.sectionTitle}>Normas de Convivencia y Buenas Prácticas</h3>
        </div>
        <ul className={infoStyles.list}>
          <li>Sube fotos claras donde se distingan el pelaje, tamaño, collar o señas particulares del animal.</li>
          <li>Indica calles o esquinas reales (ej: <em>Alem al 1200</em> o <em>Garibaldi y Chiclana</em>) para que el mapa ubique el marcador con precisión.</li>
          <li>Jamás solicites transferencias de dinero por adelantado para devolver una mascota; ante cualquier intento de estafa repórtalo a las autoridades.</li>
        </ul>

        <h3 className={infoStyles.sectionTitleWithMargin}>Preguntas Frecuentes (FAQ)</h3>
        <div className="space-y-2.5 pt-1">
          {PREGUNTAS_FRECUENTES.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.pregunta}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-indigo-500 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={infoStyles.footerBox}>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5 mb-1">
            <MessageCircle className="w-3.5 h-3.5" />
            Conectando vecinos en tiempo real
          </p>
          <p className={infoStyles.versionText}>Alerta Mascota BB v2.0 • Bahía Blanca & Punta Alta, Argentina</p>
        </div>
      </div>
    </main>
  );
};
