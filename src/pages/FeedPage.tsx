import React, { useState, useEffect } from 'react';
import { 
  Plus, RefreshCw, Info, CheckCircle2, ShieldAlert, 
  Home, HeartHandshake, HelpCircle, PhoneCall, MapPin, Shield,
  Sun, Moon, LayoutGrid, List, ArrowUp
} from 'lucide-react';
import { useMascotas } from '../hooks/useMascotas';
import { useDarkMode } from '../hooks/useDarkMode';
import { FilterBar } from '../components/FilterBar';
import { MascotaCard } from '../components/MascotaCard';
import { ReportModal } from '../components/ReportModal';
import { MascotaDetailModal } from '../components/MascotaDetailModal';
import type { MascotaReportada } from '../types/mascota';

type TabId = 'feed' | 'recursos' | 'info';

interface RecursoLocal {
  nombre: string;
  contacto: string;
  contactoLink: string;
  horario?: string;
  ubicacion: string;
  descripcion: string;
  tipo: 'municipal' | 'protectora';
}

const RECURSOS_BAHIA: RecursoLocal[] = [
  {
    nombre: 'Zoonosis Municipal Bahía Blanca',
    contacto: '0291 456-0139',
    contactoLink: 'tel:02914560139',
    horario: 'Lunes a Viernes de 7:30 a 15:00 hs',
    ubicacion: 'Parque de Mayo (Ingreso por calle Florida)',
    descripcion: 'Vacunación antirrábica gratuita sin turno, castraciones con turno previo y tratamiento contra la sarna.',
    tipo: 'municipal'
  },
  {
    nombre: 'Zoonosis Coronel Rosales (Punta Alta)',
    contacto: '02932 42-1830',
    contactoLink: 'tel:02932421830',
    horario: 'Lunes a Viernes de 7:00 a 13:00 hs',
    ubicacion: 'Humberto I 658, Punta Alta',
    descripcion: 'Atención municipal para mascotas en Punta Alta y zonas linderas. Castraciones y vacunación antirrábica.',
    tipo: 'municipal'
  },
  {
    nombre: 'Protectora de Animales Bahía Blanca',
    contacto: '2914420311',
    contactoLink: 'https://wa.me/5492914420311?text=Hola,%20me%20contacto%20desde%20Alerta%20Mascota%20BB',
    ubicacion: 'Bahía Blanca (Virtual / Tránsito)',
    descripcion: 'Asociación civil sin fines de lucro. Campañas de adopción, auxilio a animales en situación de calle y recepción de denuncias por maltrato.',
    tipo: 'protectora'
  }
];

export const FeedPage: React.FC = () => {
  const {
    mascotas,
    loading,
    error,
    filtros,
    setFiltro,
    resetearFiltros,
    agregarReporte,
    recargarMascotas
  } = useMascotas();

  const { isDarkMode, toggleTheme } = useDarkMode();
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<MascotaReportada | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  
  // Estados para optimizar UX de Scroll y Layout
  const [vista, setVista] = useState<'grid' | 'list'>('grid');
  const [limiteCarga, setLimiteCarga] = useState(4);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Escuchar evento de scroll para mostrar el botón "Volver arriba"
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reiniciar el límite de carga cada vez que cambien los filtros para una búsqueda fluida
  useEffect(() => {
    setLimiteCarga(4);
  }, [filtros]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveReport = async (nuevoReporte: any): Promise<boolean> => {
    const result = await agregarReporte(nuevoReporte);
    if (result) {
      setSuccessToast('¡Alerta publicada! Ya aparece en la lista.');
      setTimeout(() => setSuccessToast(null), 4000);
      setActiveTab('feed'); // Volver al feed para ver la alerta
      return true;
    }
    return false;
  };

  // Filtrar las mascotas visibles según el límite de paginación
  const mascotasVisibles = mascotas.slice(0, limiteCarga);

  // Renderiza skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div 
        key={index} 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden flex flex-col h-full animate-pulse shadow-sm"
      >
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800" />
        <div className="p-5 flex-grow space-y-4">
          <div className="flex gap-2">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/3" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/4" />
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
          </div>
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full mt-4" />
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#fafafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased relative">
      
      {/* Cabecera Responsiva */}
      <header className="bg-white dark:bg-slate-900 sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shadow-sm flex-shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Alerta Mascota BB Logo" className="w-9 h-9 object-contain cursor-pointer animate-fade-in" onClick={() => setActiveTab('feed')} />
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-white tracking-tight leading-none text-sm md:text-base">Alerta Mascota BB</h1>
            <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase mt-0.5">Bahía Blanca • Comunidad</p>
          </div>
        </div>

        {/* Navegación para Pantallas de Escritorio (md+) */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('feed')}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'feed' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Feed de Alertas
          </button>
          <button
            onClick={() => setActiveTab('recursos')}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'recursos' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Zoonosis y Refugios
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'info' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Cómo Funciona
          </button>
        </div>
        
        {/* Botones de acción del header */}
        <div className="flex items-center gap-2">
          
          {/* Selector de Vista (Cuadrícula / Lista) */}
          {activeTab === 'feed' && (
            <button
              onClick={() => setVista(prev => (prev === 'grid' ? 'list' : 'grid'))}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer mr-1"
              title={vista === 'grid' ? "Cambiar a vista de lista compacta" : "Cambiar a vista de cuadrícula"}
            >
              {vista === 'grid' ? <List className="w-4.5 h-4.5" /> : <LayoutGrid className="w-4.5 h-4.5" />}
            </button>
          )}

          {/* Botón de Modo Oscuro */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer mr-1"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {activeTab === 'feed' && (
            <button 
              onClick={recargarMascotas}
              disabled={loading}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer mr-1"
              title="Recargar alertas"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
            </button>
          )}
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs transition-all shadow-sm active:scale-95 shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Crear Alerta
          </button>
        </div>
      </header>

      {/* Contenido Dinámico según la Pestaña Activa */}
      <div className="flex-grow w-full">
        {activeTab === 'feed' && (
          <>
            {/* Filtros pegados en la parte superior */}
            <div className="w-full">
              <div className="max-w-6xl mx-auto">
                <FilterBar
                  filtros={filtros}
                  setFiltro={setFiltro}
                  resetearFiltros={resetearFiltros}
                />
              </div>
            </div>

            {/* Listado Principal */}
            <main className="w-full max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-12 space-y-6">
              
              {/* Cartel Informativo Comunitario */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-3xl flex items-start gap-3 transition-colors duration-300">
                <Info className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>¡Alerta Mascota Bahía Blanca!</strong> Esta es una red de vecinos solidarios. Si perdiste a tu compañero o encontraste una mascota sola en la calle, crea una alerta para que toda la comunidad colabore en su regreso a casa.
                </p>
              </div>

              {/* Manejo de estados de carga/error/resultados */}
              {error ? (
                <div className="py-12 px-6 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 rounded-3xl text-center space-y-4 max-w-md mx-auto">
                  <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
                  <div>
                    <h3 className="font-bold text-rose-900 dark:text-rose-455 text-sm">Problema al sincronizar reportes</h3>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={recargarMascotas}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reintentar
                  </button>
                </div>
              ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {renderSkeletons()}
                </div>
              ) : mascotas.length === 0 ? (
                <div className="text-center py-16 px-6 space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-md mx-auto transition-colors duration-300">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">No hay resultados</h3>
                    <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                      No encontramos alertas que coincidan con los filtros seleccionados. Intenta ampliar tu búsqueda o cambiar de barrio.
                    </p>
                  </div>
                  <button
                    onClick={resetearFiltros}
                    className="px-5 py-2.5 bg-slate-900 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Listado dinámico según el modo de vista */}
                  <div className={vista === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                    : "flex flex-col gap-3.5 max-w-4xl mx-auto w-full"
                  }>
                    {mascotasVisibles.map((mascota) => (
                      <MascotaCard 
                        key={mascota.id} 
                        mascota={mascota} 
                        onClick={() => setSelectedMascota(mascota)}
                        vista={vista}
                      />
                    ))}
                  </div>

                  {/* Paginación Progresiva - Botón "Cargar Más" */}
                  {mascotas.length > limiteCarga && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => setLimiteCarga(prev => prev + 4)}
                        className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold rounded-2xl text-xs hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        Cargar más alertas
                      </button>
                    </div>
                  )}
                </div>
              )}
            </main>
          </>
        )}

        {activeTab === 'recursos' && (
          <main className="w-full max-w-3xl mx-auto px-4 py-8 pb-28 md:pb-12 space-y-6">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">Zoonosis y Refugios Locales</h2>
              <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">Contactos útiles y servicios públicos de emergencia para mascotas en Bahía Blanca y cercanías.</p>
            </div>

            <div className="space-y-4">
              {RECURSOS_BAHIA.map((recurso, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">{recurso.nombre}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      recurso.tipo === 'municipal' 
                        ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30' 
                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                    }`}>
                      {recurso.tipo === 'municipal' ? 'Municipal' : 'ONG'}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-2 leading-relaxed">{recurso.descripcion}</p>

                  <div className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 text-xs">
                    {recurso.horario && (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>Horario: {recurso.horario}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{recurso.ubicacion}</span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100/80 dark:bg-slate-800/80 w-full my-4" />

                  <a
                    href={recurso.contactoLink}
                    target={recurso.contactoLink.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors active:scale-98 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Contactar: {recurso.contacto}
                  </a>
                </div>
              ))}
            </div>

            {/* Consejos Rápidos */}
            <div className="p-5 rounded-3xl bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 space-y-3">
              <h4 className="text-xs md:text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                Guía de Primeros Auxilios y Denuncias
              </h4>
              <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li>Si encuentras un perro o gato herido gravemente en la vía pública, Zoonosis Municipal puede proveer asistencia.</li>
                <li>Si quieres denunciar maltrato animal en Bahía Blanca, puedes dirigirte a las oficinas de la Policía Local o contactar a la Protectora de Animales para orientación jurídica.</li>
                <li>Asegúrate de tomar fotos o videos que sirvan de evidencia legal para las denuncias de maltrato.</li>
              </ul>
            </div>
          </main>
        )}

        {activeTab === 'info' && (
          <main className="w-full max-w-3xl mx-auto px-4 py-8 pb-28 md:pb-12 space-y-6">
            <div className="text-center py-6">
              <img src="/logo.svg" alt="Alerta Mascota BB Logo" className="w-14 h-14 mx-auto mb-3 object-contain" />
              <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">Alerta Mascota BB</h2>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-1">Bahía Blanca • Punta Alta • Solidaridad</p>
            </div>

            <div className="space-y-5 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base border-b border-slate-100 dark:border-slate-800 pb-2">¿Cómo funciona la red?</h3>
              <p>
                Alerta Mascota BB es una plataforma digital móvil-first y responsiva creada por y para los vecinos de Bahía Blanca. Nuestro objetivo es reducir drásticamente el tiempo de reencuentro de los animales perdidos.
              </p>
              <p>
                La aplicación funciona de forma completamente abierta: no requiere registros molestos. Cualquier vecino que pierda o encuentre un animal puede cargar una alerta especificando calle, barrio y teléfono de contacto. Las personas interesadas se conectan de manera directa enviando un mensaje automático por WhatsApp con un solo clic.
              </p>
              
              <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base border-b border-slate-100 dark:border-slate-800 pb-2 pt-2">Normas de Uso y Convivencia</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Por favor, sube únicamente fotos nítidas del animal en cuestión.</li>
                <li>Describe rasgos específicos de comportamiento (si es asustadizo, si muerde, si lleva collar) para facilitar la búsqueda.</li>
                <li>Una vez que recuperes a tu mascota o encuentres a sus dueños, por favor comunícalo o dale de baja si la app se conecta en el futuro a una base de datos.</li>
              </ul>

              <div className="pt-6 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400">Desarrollo Frontend MVP 1.0.0 • Bahía Blanca, Argentina</p>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Toast Notificación de Éxito - Renderizado absoluto flotante responsive */}
      {successToast && (
        <div className="fixed bottom-20 inset-x-4 md:bottom-6 md:right-6 md:left-auto md:max-w-md z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-slide-up border border-emerald-500 mx-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Navegación Inferior Móvil (Oculta en Desktop con 'md:hidden') */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100/90 dark:border-slate-800/90 py-3.5 px-4 flex items-center justify-around z-35 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] md:hidden transition-colors duration-300">
        
        {/* Tab 1: Alertas */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-505 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Alertas</span>
        </button>

        {/* Botón Central de Reporte */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md shadow-indigo-600/30 active:scale-95 transition-all transform -translate-y-4 border-4 border-white dark:border-slate-950 cursor-pointer"
          title="Crear Alerta"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Tab 2: Recursos Zoonosis */}
        <button
          onClick={() => setActiveTab('recursos')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'recursos' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-505 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <HeartHandshake className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Zoonosis</span>
        </button>

        {/* Tab 3: Ayuda */}
        <button
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'info' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-505 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Ayuda</span>
        </button>
      </nav>

      {/* Botón Flotante "Volver arriba" (Back to Top FAB) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 p-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-40 animate-fade-in"
          title="Volver al inicio"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Modal para Crear Alerta */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReport}
      />

      {/* Modal para Visualizar Detalles en Grande (Glassmorphism) */}
      <MascotaDetailModal
        mascota={selectedMascota}
        onClose={() => setSelectedMascota(null)}
      />
    </div>
  );
};
