import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar, SidebarTrigger } from './components/layout/Sidebar';
import { OnboardingOverlay } from './components/onboarding/OnboardingOverlay';
import { Dashboard } from './pages/Dashboard';
import { Estudiar } from './pages/Estudiar';
import { Grupos } from './pages/Grupos';
import { NuevaTarjeta } from './pages/NuevaTarjeta';
import { Importar } from './pages/Importar';
import { Estadisticas } from './pages/Estadisticas';
import { Configuracion } from './pages/Configuracion';
import { loadDatabase, getHasSeenTutorial, setHasSeenTutorial } from './lib/storage';
import './index.css';

const SHOW_ONBOARDING_EVENT = 'icfes-show-onboarding';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const db = loadDatabase();
    const totalCards = Object.keys(db.cards).length;
    return !getHasSeenTutorial() && totalCards === 0;
  });

  useEffect(() => {
    const handler = () => setShowOnboarding(true);
    window.addEventListener(SHOW_ONBOARDING_EVENT, handler);
    return () => window.removeEventListener(SHOW_ONBOARDING_EVENT, handler);
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
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/estudiar" element={<Estudiar />} />
                <Route path="/grupos" element={<Grupos />} />
                <Route path="/nueva-tarjeta" element={<NuevaTarjeta />} />
                <Route path="/importar" element={<Importar />} />
                <Route path="/estadisticas" element={<Estadisticas />} />
                <Route path="/configuracion" element={<Configuracion />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      {showOnboarding && (
        <OnboardingOverlay onComplete={handleOnboardingComplete} />
      )}
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
