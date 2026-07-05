import { useState } from 'react';
import { Plus, RefreshCw, Sun, Moon, Home, HeartHandshake, HelpCircle, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import { FeedPage } from './pages/FeedPage';
import { RecursosPage } from './pages/RecursosPage';
import { InfoPage } from './pages/InfoPage';
import { MascotasProvider } from './contexts/MascotasContext';
import { useMascotas } from './hooks/useMascotas';
import { useDarkMode } from './hooks/useDarkMode';
import { ReportModal } from './components/ReportModal';

type TabId = 'feed' | 'recursos' | 'info';

function MainLayout() {
  const { agregarReporte, recargarMascotas, loading, vista, toggleVista } = useMascotas();
  const { isDarkMode, toggleTheme } = useDarkMode();
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col antialiased transition-colors duration-300">
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
          
          {/* Botón de Modo Oscuro */}
          {/* Selector de Vista (Cuadrícula / Lista) */}
          {activeTab === 'feed' && (
            <button
              onClick={toggleVista}
              className="p-2 text-slate-400 dark:text-slate-505 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer mr-1"
              title={vista === 'grid' ? "Cambiar a vista de lista compacta" : "Cambiar a vista de cuadrícula"}
            >
              {vista === 'grid' ? <List className="w-4.5 h-4.5" /> : <LayoutGrid className="w-4.5 h-4.5" />}
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 dark:text-slate-505 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer mr-1"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {activeTab === 'feed' && (
            <button 
              onClick={recargarMascotas}
              disabled={loading}
              className="p-2 text-slate-400 dark:text-slate-555 hover:text-slate-600 dark:hover:text-slate-300 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer mr-1"
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

      {/* Contenido de la Página */}
      <div className="flex-grow w-full">
        {activeTab === 'feed' && <FeedPage />}
        {activeTab === 'recursos' && <RecursosPage />}
        {activeTab === 'info' && <InfoPage />}
      </div>

      {/* Toast de Éxito */}
      {successToast && (
        <div className="fixed bottom-20 inset-x-4 md:bottom-6 md:right-6 md:left-auto md:max-w-md z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-slide-up border border-emerald-500 mx-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Navegación Inferior Móvil */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100/90 dark:border-slate-800/90 py-3.5 px-4 flex items-center justify-around z-35 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] md:hidden transition-colors duration-300">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-505 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Alertas</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md shadow-indigo-600/30 active:scale-95 transition-all transform -translate-y-4 border-4 border-white dark:border-slate-950 cursor-pointer"
          title="Crear Alerta"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('recursos')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'recursos' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-555 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <HeartHandshake className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Zoonosis</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'info' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-555 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Ayuda</span>
        </button>
      </nav>

      {/* Modal de Crear Reporte */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReport}
      />
    </div>
  );
}

function App() {
  return (
    <MascotasProvider>
      <MainLayout />
    </MascotasProvider>
  );
}

export default App;
