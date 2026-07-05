import { FeedPage } from './pages/FeedPage';
import { MascotasProvider } from './contexts/MascotasContext';

function App() {
  return (
    <MascotasProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col antialiased transition-colors duration-300">
        <FeedPage />
      </div>
    </MascotasProvider>
  );
}

export default App;
