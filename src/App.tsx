import { useState } from 'react';
import { Plus, RefreshCw, Sun, Moon, Home, CheckCircle2, LayoutGrid, List, BarChart3, MapPin, User, LogIn } from 'lucide-react';
import { FeedPage } from './pages/FeedPage';
import { MapaPage } from './pages/MapaPage';
import { EstadisticasPage } from './pages/EstadisticasPage';
import { RecursosPage } from './pages/RecursosPage';
import { InfoPage } from './pages/InfoPage';
import { MascotasProvider } from './contexts/MascotasContext';
import { AuthProvider } from './contexts/AuthContext';
import { useMascotas } from './hooks/useMascotas';
import { useDarkMode } from './hooks/useDarkMode';
import { useAuth } from './hooks/useAuth';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';

type TabId = 'feed' | 'mapa' | 'estadisticas' | 'recursos' | 'info';

function MainLayout() {
  const { agregarReporte, recargarMascotas, loading, vista, toggleVista } = useMascotas();
  const { isDarkMode, toggleTheme } = useDarkMode();
  const { user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col antialiased transition-colors duration-300 relative overflow-x-hidden">
      {/* Esferas de Resplandor Neon de Fondo (Ambient Glows) con Flotación Lenta */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] top-[10%] -left-[100px] pointer-events-none z-0 animate-float-slow" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/5 dark:bg-purple-500/8 blur-[120px] top-[40%] -right-[80px] pointer-events-none z-0 animate-float-slow-alt" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/8 blur-[110px] bottom-[15%] left-[5%] pointer-events-none z-0 animate-float-slow" />

      {/* Cabecera Responsiva Flotante de Vidrio */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-white/20 dark:border-slate-800/40 shadow-sm flex-shrink-0 transition-all duration-300">
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
            onClick={() => setActiveTab('mapa')}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'mapa' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Mapa Interactivo
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'estadisticas' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Estadísticas
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
              onClick={toggleVista}
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

          {/* BOTÓN PERFIL / AUTENTICACIÓN */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1.5 pr-3 bg-indigo-50 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-slate-800 border border-indigo-200/60 dark:border-slate-700 rounded-2xl transition-all cursor-pointer active:scale-95"
              title="Ver mi perfil"
            >
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.nombre)}`}
                alt={user.nombre}
                className="w-7 h-7 rounded-xl object-cover border border-indigo-400/40"
              />
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                {user.nombre.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3.5 py-2 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 transition-all cursor-pointer active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          )}
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-2xl text-xs transition-all shadow-sm active:scale-95 shadow-indigo-600/10 cursor-pointer ml-1"
          >
            <Plus className="w-4 h-4" />
            Crear Alerta
          </button>
        </div>
      </header>

      {/* Contenido de la Página */}
      <div className="flex-grow w-full">
        {activeTab === 'feed' && <FeedPage />}
        {activeTab === 'mapa' && <MapaPage />}
        {activeTab === 'estadisticas' && <EstadisticasPage />}
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

      {/* Navegación Inferior Móvil Estilo Vidrio Esmerilado */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-white/20 dark:border-slate-800/40 py-3.5 px-4 flex items-center justify-around z-35 shadow-[0_-8px_30px_rgba(0,0,0,0.02)] md:hidden transition-all duration-300">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Alertas</span>
        </button>

        <button
          onClick={() => setActiveTab('mapa')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'mapa' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Mapa</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md shadow-indigo-600/30 active:scale-95 transition-all transform -translate-y-4 border-4 border-white dark:border-slate-950 cursor-pointer"
          title="Crear Alerta"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('estadisticas')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'estadisticas' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Stats</span>
        </button>

        {/* PERFIL / INICIAR SESIÓN EN NAVEGACIÓN MÓVIL */}
        {isAuthenticated && user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex flex-col items-center gap-1 text-indigo-600 dark:text-indigo-400 cursor-pointer"
          >
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.nombre)}`}
              alt={user.nombre}
              className="w-5 h-5 rounded-full object-cover border border-indigo-500"
            />
            <span className="text-[10px] font-semibold">Perfil</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Ingresar</span>
          </button>
        )}
      </nav>

      {/* Modal de Crear Reporte */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReport}
      />

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Modal de Perfil de Usuario */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MascotasProvider>
        <MainLayout />
      </MascotasProvider>
    </AuthProvider>
  );
}

export default App;
