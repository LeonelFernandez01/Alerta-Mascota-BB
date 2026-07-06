export const feedStyles = {
  // Contenedor principal de la pantalla
  container: "w-full max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-12 space-y-6",
  
  // Cartel informativo comunitario
  infoBanner: "p-4 glass-panel rounded-3xl flex items-start gap-3 shadow-[0_8px_30px_rgba(99,102,241,0.01)] dark:shadow-[0_8px_32px_rgba(99,102,241,0.03)] border-white/30 dark:border-slate-800/40 transition-colors duration-300",
  infoIcon: "w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0",
  infoText: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed",
  
  // Banner de error de sincronización
  errorBanner: "py-12 px-6 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 rounded-3xl text-center space-y-4 max-w-md mx-auto",
  errorIcon: "w-12 h-12 text-rose-500 mx-auto animate-pulse",
  errorTitle: "font-bold text-rose-900 dark:text-rose-455 text-sm",
  errorText: "text-xs text-rose-600 dark:text-rose-400 mt-1",
  retryButton: "px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer",
  
  // Estado vacío (sin resultados)
  emptyContainer: "text-center py-16 px-6 space-y-4 glass-panel rounded-[28px] shadow-[0_8px_30px_rgba(99,102,241,0.02)] dark:shadow-[0_8px_32px_rgba(99,102,241,0.05)] max-w-md mx-auto transition-colors duration-300",
  emptyIconWrapper: "w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto",
  emptyTitle: "font-bold text-slate-800 dark:text-slate-100 text-sm",
  emptyText: "text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed",
  emptyButton: "px-5 py-2.5 bg-slate-900 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer",

  // Grid/List Layout Wrappers
  gridContainer: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  listContainer: "flex flex-col gap-3.5 max-w-4xl mx-auto w-full",
  
  // Paginación
  paginationWrapper: "flex justify-center pt-4",
  loadMoreButton: "px-6 py-3 glass-panel text-indigo-600 dark:text-indigo-400 font-extrabold rounded-2xl text-xs hover:bg-white/90 dark:hover:bg-slate-900/90 active:scale-95 transition-all shadow-md shadow-indigo-600/5 border-white/40 dark:border-slate-800/50 cursor-pointer",
  
  // Botón flotante Volver Arriba
  scrollTopButton: "fixed bottom-20 md:bottom-8 right-4 p-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-40 animate-fade-in"
};
