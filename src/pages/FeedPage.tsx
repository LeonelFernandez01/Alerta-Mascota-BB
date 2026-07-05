import React, { useState, useEffect } from 'react';
import { Info, ShieldAlert, RefreshCw, ArrowUp } from 'lucide-react';
import { useMascotas } from '../hooks/useMascotas';
import { FilterBar } from '../components/FilterBar';
import { MascotaCard } from '../components/MascotaCard';
import { MascotaDetailModal } from '../components/MascotaDetailModal';
import { feedStyles } from '../stylePg/feedPage';
import type { MascotaReportada } from '../types/mascota';

export const FeedPage: React.FC = () => {
  const {
    mascotas,
    loading,
    error,
    filtros,
    setFiltro,
    resetearFiltros,
    recargarMascotas
  } = useMascotas();

  const [selectedMascota, setSelectedMascota] = useState<MascotaReportada | null>(null);
  
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

  // Filtrar las mascotas visibles según el límite de paginación
  const mascotasVisibles = mascotas.slice(0, limiteCarga);

  // Renderiza skeletons de carga
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
    <>
      {/* Barra de Filtros y Búsqueda */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto">
          <FilterBar
            filtros={filtros}
            setFiltro={setFiltro}
            resetearFiltros={resetearFiltros}
          />
        </div>
      </div>

      {/* Listado de Mascotas */}
      <main className={feedStyles.container}>
        
        {/* Toggle de vistas para Desktop */}
        <div className="hidden md:flex justify-end gap-2 px-2">
          <button
            onClick={() => setVista('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              vista === 'grid' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Cuadrícula
          </button>
          <button
            onClick={() => setVista('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              vista === 'list' 
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Lista compacta
          </button>
        </div>

        {/* Cartel Informativo Comunitario */}
        <div className={feedStyles.infoBanner}>
          <Info className={feedStyles.infoIcon} />
          <p className={feedStyles.infoText}>
            <strong>¡Alerta Mascota Bahía Blanca!</strong> Esta es una red de vecinos solidarios. Si perdiste a tu compañero o encontraste una mascota sola en la calle, crea una alerta para que toda la comunidad colabore en su regreso a casa.
          </p>
        </div>

        {/* Manejo de estados de carga/error/resultados */}
        {error ? (
          <div className={feedStyles.errorBanner}>
            <ShieldAlert className={feedStyles.errorIcon} />
            <div>
              <h3 className={feedStyles.errorTitle}>Problema al sincronizar reportes</h3>
              <p className={feedStyles.errorText}>{error}</p>
            </div>
            <button onClick={recargarMascotas} className={feedStyles.retryButton}>
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
          </div>
        ) : loading ? (
          <div className={feedStyles.gridContainer}>
            {renderSkeletons()}
          </div>
        ) : mascotas.length === 0 ? (
          <div className={feedStyles.emptyContainer}>
            <div className={feedStyles.emptyIconWrapper}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className={feedStyles.emptyTitle}>No hay resultados</h3>
              <p className={feedStyles.emptyText}>
                No encontramos alertas que coincidan con los filtros seleccionados. Intenta ampliar tu búsqueda o cambiar de barrio.
              </p>
            </div>
            <button onClick={resetearFiltros} className={feedStyles.emptyButton}>
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Listado dinámico según el modo de vista */}
            <div className={vista === 'grid' ? feedStyles.gridContainer : feedStyles.listContainer}>
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
              <div className={feedStyles.paginationWrapper}>
                <button
                  onClick={() => setLimiteCarga(prev => prev + 4)}
                  className={feedStyles.loadMoreButton}
                >
                  Cargar más alertas
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Botón Flotante "Volver arriba" (Back to Top FAB) */}
      {showScrollTop && (
        <button onClick={scrollToTop} className={feedStyles.scrollTopButton} title="Volver al inicio">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Modal para Visualizar Detalles en Grande (Glassmorphism) */}
      <MascotaDetailModal
        mascota={selectedMascota}
        onClose={() => setSelectedMascota(null)}
      />
    </>
  );
};
