import { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar, SidebarTrigger } from './components/layout/Sidebar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { loadDatabase, getHasSeenTutorial, setHasSeenTutorial, saveDatabase } from './lib/storage';
import './index.css';
import { Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/Button';

// ── Eager (critical path) ───────────────────────────────────────────────────
import { Dashboard } from './pages/Dashboard';

// ── Lazy (route-level code splitting) ───────────────────────────────────────
const Estudiar = lazy(() => import('./pages/Estudiar').then(m => ({ default: m.Estudiar })));
const Grupos = lazy(() => import('./pages/Grupos').then(m => ({ default: m.Grupos })));
const NuevaTarjeta = lazy(() => import('./pages/NuevaTarjeta').then(m => ({ default: m.NuevaTarjeta })));
const Importar = lazy(() => import('./pages/Importar').then(m => ({ default: m.Importar })));
const Estadisticas = lazy(() => import('./pages/Estadisticas').then(m => ({ default: m.Estadisticas })));
const Configuracion = lazy(() => import('./pages/Configuracion').then(m => ({ default: m.Configuracion })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Ranking = lazy(() => import('./pages/Ranking').then(m => ({ default: m.Ranking })));
const Compartir = lazy(() => import('./pages/Compartir').then(m => ({ default: m.Compartir })));
const Perfil = lazy(() => import('./pages/Perfil').then(m => ({ default: m.Perfil })));
const OnboardingOverlay = lazy(() => import('./components/onboarding/OnboardingOverlay').then(m => ({ default: m.OnboardingOverlay })));
const InitialImportModal = lazy(() => import('./components/import/InitialImportModal').then(m => ({ default: m.InitialImportModal })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  );
}

const SHOW_ONBOARDING_EVENT = 'icfes-show-onboarding';


function AppContent() {
  const { currentUser } = useAuth();
  const initialDb = loadDatabase();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const totalCards = Object.keys(initialDb.cards).length;
    return !getHasSeenTutorial() && totalCards === 0;
  });
  const [isDark, setIsDark] = useState(initialDb.settings.darkMode);
  const [showInitialPack, setShowInitialPack] = useState(!initialDb.settings.initialPackLoaded);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handler = () => setShowOnboarding(true);
    const themeHandler = (e: any) => setIsDark(e.detail);
    const storageHandler = (e: any) => {
      const db = e.detail;
      setShowInitialPack(!db.settings.initialPackLoaded);
      setIsDark(db.settings.darkMode);
    };

    window.addEventListener(SHOW_ONBOARDING_EVENT, handler);
    window.addEventListener('theme-change', themeHandler);
    window.addEventListener('storage-update', storageHandler);

    return () => {
      window.removeEventListener(SHOW_ONBOARDING_EVENT, handler);
      window.removeEventListener('theme-change', themeHandler);
      window.removeEventListener('storage-update', storageHandler);
    };
  }, []);

  const handleOnboardingComplete = () => {
    setHasSeenTutorial(true);
    setShowOnboarding(false);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Sidebar
          collapsed={sidebarCollapsed}
          open={sidebarOpen}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 min-h-[56px] shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 pt-[env(safe-area-inset-top)] dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
            <SidebarTrigger onClick={() => setSidebarOpen(true)} />
            <span className="font-semibold text-indigo-600">ICFES-SRS</span>
            <div className="ml-auto flex items-center gap-2">
              {!currentUser && (
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/login'} className="text-zinc-500">
                  Entrar
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl w-10 h-10 p-0"
                onClick={() => {
                  const db = loadDatabase();
                  const next = !db.settings.darkMode;
                  db.settings.darkMode = next;
                  saveDatabase(db);
                  window.dispatchEvent(new CustomEvent('theme-change', { detail: next }));
                }}
              >
                <Sun className="h-5 w-5 dark:hidden text-amber-500" />
                <Moon className="h-5 w-5 hidden dark:block text-indigo-400" />
                <span className="sr-only">Cambiar tema</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/ranking" element={<Ranking />} />
                  <Route path="/compartir" element={<Compartir />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/estudiar" element={<Estudiar />} />
                  <Route path="/grupos" element={<Grupos />} />
                  <Route path="/nueva-tarjeta" element={<NuevaTarjeta />} />
                  <Route path="/importar" element={<Importar />} />
                  <Route path="/estadisticas" element={<Estadisticas />} />
                  <Route path="/configuracion" element={<Configuracion />} />
                </Routes>
              </Suspense>
            </div>
          </main>
        </div>
      </div>
      {showOnboarding && (
        <Suspense fallback={null}>
          <OnboardingOverlay onComplete={handleOnboardingComplete} />
        </Suspense>
      )}
      {showInitialPack && (
        <Suspense fallback={null}>
          <InitialImportModal onComplete={() => setShowInitialPack(false)} />
        </Suspense>
      )}
      <Analytics />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
