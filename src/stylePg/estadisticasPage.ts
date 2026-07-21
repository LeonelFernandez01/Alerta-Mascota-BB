/**
 * Definiciones de clases Tailwind para la pantalla de Estadísticas
 */
export const estadisticasStyles = {
  container: 'max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fade-in pb-24 md:pb-12',
  header: 'flex flex-col space-y-2',
  title: 'text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5',
  subtitle: 'text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed',
  kpiGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  chartsGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  bannerContainer: 'p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-500/30',
  bannerTitle: 'text-lg font-extrabold tracking-tight',
  bannerDesc: 'text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed',
};
