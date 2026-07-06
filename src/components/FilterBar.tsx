import React from 'react';
import { Search, X, Grid, Heart, Map } from 'lucide-react';
import type { FiltrosMascotas } from '../contexts/MascotasContext';
import type { BarrioBahia, EstadoMascota, TipoAnimal } from '../types/mascota';


interface FilterBarProps {
  filtros: FiltrosMascotas;
  setFiltro: <K extends keyof FiltrosMascotas>(key: K, value: FiltrosMascotas[K]) => void;
  resetearFiltros: () => void;
}

const BARRIOS_LIST: (BarrioBahia | 'todos')[] = [
  'todos',
  'Centro',
  'Universitario',
  'Villa Mitre',
  'Patagonia',
  'Palihue',
  'Noroeste',
  'Harding Green',
  'Grumbein',
  'Punta Alta'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filtros,
  setFiltro,
  resetearFiltros
}) => {
  const tieneFiltrosActivos =
    filtros.barrio !== 'todos' ||
    filtros.estado !== 'todos' ||
    filtros.tipo !== 'todos' ||
    filtros.busqueda !== '';

  return (
    <div className="w-full space-y-4 glass-panel rounded-3xl p-5 shadow-[0_8px_30px_rgba(99,102,241,0.02)] dark:shadow-[0_8px_32px_rgba(99,102,241,0.05)] border border-white/40 dark:border-slate-800/50 transition-all duration-300">
      {/* Barra de Búsqueda */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={filtros.busqueda}
          onChange={(e) => setFiltro('busqueda', e.target.value)}
          placeholder="Buscar señas, raza, contacto..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/40 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl text-sm focus:outline-none focus:border-indigo-500/80 dark:focus:border-indigo-400/80 focus:bg-white dark:focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/5 transition-all text-slate-700 dark:text-slate-200"
        />
        {filtros.busqueda && (
          <button
            onClick={() => setFiltro('busqueda', '')}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tipo de Animal (Pills) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
          <Grid className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          ¿Qué buscas?
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 mask-edges sm:mask-none">
          {(['todos', 'perro', 'gato', 'otro'] as (TipoAnimal | 'todos')[]).map((t) => {
            const isSelected = filtros.tipo === t;
            return (
              <button
                key={t}
                onClick={() => setFiltro('tipo', t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all active:scale-95 cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 dark:bg-indigo-550 text-white shadow-md shadow-indigo-600/20 border-indigo-600 dark:border-indigo-550'
                    : 'bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-350 hover:bg-white/70 dark:hover:bg-slate-900/70 border-slate-250/30 dark:border-slate-800/40'
                }`}
              >
                {t === 'todos' ? 'Todos' : t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado (Pills) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
          <Heart className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          Estado de Alerta
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 mask-edges sm:mask-none">
          {(['todos', 'perdido', 'encontrado'] as (EstadoMascota | 'todos')[]).map((est) => {
            const isSelected = filtros.estado === est;
            
            // Colores temáticos según el estado
            let activeClass = 'bg-indigo-600 dark:bg-indigo-550 text-white border-indigo-600 dark:border-indigo-550 shadow-md shadow-indigo-600/20';
            if (est === 'perdido') activeClass = 'bg-rose-600 dark:bg-rose-500 text-white border-rose-600 dark:border-rose-500 shadow-md shadow-rose-600/25';
            if (est === 'encontrado') activeClass = 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 dark:border-emerald-500 shadow-md shadow-emerald-600/25';

            return (
              <button
                key={est}
                onClick={() => setFiltro('estado', est)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all active:scale-95 cursor-pointer border ${
                  isSelected
                    ? activeClass
                    : 'bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-355 hover:bg-white/70 dark:hover:bg-slate-900/70 border-slate-250/30 dark:border-slate-800/40'
                }`}
              >
                {est === 'todos' ? 'Cualquier Estado' : est}
              </button>
            );
          })}
        </div>
      </div>

      {/* Barrios (Pills) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Map className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            Barrio (Bahía Blanca)
          </label>
          
          {tieneFiltrosActivos && (
            <button
              onClick={resetearFiltros}
              className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 mask-edges sm:mask-none">
          {BARRIOS_LIST.map((b) => {
            const isSelected = filtros.barrio === b;
            return (
              <button
                key={b}
                onClick={() => setFiltro('barrio', b)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 dark:bg-indigo-550 text-white shadow-md shadow-indigo-600/20 border-indigo-600 dark:border-indigo-550'
                    : 'bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-350 hover:bg-white/70 dark:hover:bg-slate-900/70 border-slate-250/30 dark:border-slate-800/40'
                }`}
              >
                {b === 'todos' ? 'Todos los Barrios' : b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
