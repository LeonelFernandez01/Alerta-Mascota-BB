/**
 * Definiciones de clases Tailwind para la pantalla del Mapa Interactivo
 */
export const mapaStyles = {
  container: 'max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in pb-24 md:pb-12',
  header: 'flex flex-col md:flex-row md:items-center justify-between gap-4',
  titleGroup: 'space-y-1',
  title: 'text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5',
  subtitle: 'text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl',
  filterGroup: 'flex items-center gap-2 overflow-x-auto pb-2 md:pb-0',
  mapContainer: 'w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-white/40 dark:border-slate-800/60 relative z-10 glass-panel',
  legendCard: 'p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800/40 flex flex-wrap items-center justify-between gap-4 text-xs',
};
