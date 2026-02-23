import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { loadDatabase, saveDatabase, setHasSeenTutorial } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../types';
import type { Settings } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CloudSyncService } from '../services/CloudSyncService';
import { LogOut, Cloud, CloudOff, RefreshCw, User as UserIcon } from 'lucide-react';

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left font-medium bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {open ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        {title}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

export function Configuracion() {
  const { currentUser, logout } = useAuth();
  const db = loadDatabase();
  const [newPerDay, setNewPerDay] = useState(db.settings.newCardsPerDay);
  const [reviewPerDay, setReviewPerDay] = useState(db.settings.reviewCardsPerDay);
  const [learnStep1, setLearnStep1] = useState(db.settings.learnSteps[0] ?? 1);
  const [learnStep2, setLearnStep2] = useState(db.settings.learnSteps[1] ?? 10);
  const [lapseStep, setLapseStep] = useState(db.settings.lapseSteps[0] ?? 10);
  const [graduatingInterval, setGraduatingInterval] = useState(
    db.settings.graduatingInterval ?? DEFAULT_SETTINGS.graduatingInterval
  );
  const [easyInterval, setEasyInterval] = useState(
    db.settings.easyInterval ?? DEFAULT_SETTINGS.easyInterval
  );
  const [newInterval, setNewInterval] = useState(
    db.settings.newInterval ?? DEFAULT_SETTINGS.newInterval
  );
  const [leechThreshold, setLeechThreshold] = useState(
    db.settings.leechThreshold ?? DEFAULT_SETTINGS.leechThreshold
  );
  const [masteredInterval, setMasteredInterval] = useState(
    db.settings.masteredInterval ?? DEFAULT_SETTINGS.masteredInterval
  );
  const [darkMode, setDarkMode] = useState(db.settings.darkMode);
  const [studyMode, setStudyMode] = useState<'swipe' | 'classic'>(db.settings.darkMode ? (db.settings.studyMode ?? 'swipe') : (db.settings.studyMode ?? 'swipe'));
  // Wait, db.settings might not have studyMode yet if it was just added to types
  useEffect(() => {
    setStudyMode(db.settings.studyMode ?? 'swipe');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSave = () => {
    const db = loadDatabase();
    const s: Partial<Settings> = {
      newCardsPerDay: Math.max(1, Math.min(1000, newPerDay)),
      reviewCardsPerDay: Math.max(10, Math.min(5000, reviewPerDay)),
      learnSteps: db.settings.learnSteps.length > 2
        ? db.settings.learnSteps
        : [Math.max(0.5, learnStep1), Math.max(1, learnStep2)].sort((a, b) => a - b),
      lapseSteps: db.settings.lapseSteps,
      graduatingInterval: Math.max(0.5, graduatingInterval),
      easyInterval: Math.max(1, easyInterval),
      newInterval: Math.max(0.5, newInterval),
      leechThreshold: Math.max(1, Math.min(50, leechThreshold)),
      masteredInterval: Math.max(1, masteredInterval),
      darkMode,
      studyMode,
    };
    Object.assign(db.settings, s);
    saveDatabase(db);
    setNewPerDay(db.settings.newCardsPerDay);
    setReviewPerDay(db.settings.reviewCardsPerDay);
    setLearnStep1(db.settings.learnSteps[0] ?? 1);
    setLearnStep2(db.settings.learnSteps[1] ?? 10);
    setLapseStep(db.settings.lapseSteps[0] ?? 10);
    setGraduatingInterval(db.settings.graduatingInterval);
    setEasyInterval(db.settings.easyInterval);
    setNewInterval(db.settings.newInterval);
    setLeechThreshold(db.settings.leechThreshold);
    setMasteredInterval(db.settings.masteredInterval);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Configuración
        </h1>
        <p className="text-zinc-500 mt-1">Ajusta el comportamiento del SRS</p>
      </div>

      <div className="space-y-4">
        <Section title="Límites diarios" defaultOpen={true}>
          <p className="text-sm text-zinc-500 -mt-2">
            Cuántas tarjetas nuevas y de repaso por día
          </p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tarjetas nuevas por día
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={newPerDay}
              onChange={(e) => setNewPerDay(Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tarjetas de repaso por día
            </label>
            <Input
              type="number"
              min={10}
              max={500}
              value={reviewPerDay}
              onChange={(e) => setReviewPerDay(Number(e.target.value) || 10)}
            />
          </div>
        </Section>

        <Section title="Learning">
          <p className="text-sm text-zinc-500 -mt-2">
            Intervalos (minutos) entre pasos cuando una tarjeta está en aprendizaje
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Paso 1 (minutos)
              </label>
              <Input
                type="number"
                min={0.5}
                step={0.5}
                value={learnStep1}
                onChange={(e) => setLearnStep1(Number(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Paso 2 (minutos)
              </label>
              <Input
                type="number"
                min={1}
                value={learnStep2}
                onChange={(e) => setLearnStep2(Number(e.target.value) || 10)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Intervalo de graduación (días)
            </label>
            <Input
              type="number"
              min={0.5}
              step={0.5}
              value={graduatingInterval}
              onChange={(e) =>
                setGraduatingInterval(Number(e.target.value) || 1)
              }
            />
            <p className="text-xs text-zinc-500 mt-1">
              Días para pasar de learning a review tras responder Good
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Intervalo Easy en primera vez (días)
            </label>
            <Input
              type="number"
              min={1}
              value={easyInterval}
              onChange={(e) => setEasyInterval(Number(e.target.value) || 4)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Intervalo base para repaso (días)
            </label>
            <Input
              type="number"
              min={0.5}
              step={0.5}
              value={newInterval}
              onChange={(e) => setNewInterval(Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Umbral de dominio (días)
            </label>
            <Input
              type="number"
              min={1}
              value={masteredInterval}
              onChange={(e) => setMasteredInterval(Number(e.target.value) || 14)}
            />
            <p className="text-xs text-zinc-500 mt-1">
              Cuando el intervalo de una tarjeta alcanza este número de días, se marca como "Dominada".
            </p>
          </div>
        </Section>

        <Section title="Lapses" defaultOpen={false}>
          <p className="text-sm text-zinc-500 -mt-2">
            Minutos de espera tras olvidar una tarjeta (lapse)
          </p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Paso lapse (minutos)
            </label>
            <Input
              type="number"
              min={1}
              value={lapseStep}
              onChange={(e) => setLapseStep(Number(e.target.value) || 10)}
            />
          </div>
        </Section>

        <Section title="Avanzado" defaultOpen={false}>
          <div>
            <label className="block text-sm font-medium mb-2">
              Umbral leech
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              value={leechThreshold}
              onChange={(e) =>
                setLeechThreshold(Number(e.target.value) || 8)
              }
            />
            <p className="text-xs text-zinc-500 mt-1">
              Lapses antes de marcar una tarjeta como leech (no se incluirá en repasos)
            </p>
          </div>
        </Section>

        <Section title="Apariencia" defaultOpen={false}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modo de estudio</label>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setStudyMode('swipe')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${studyMode === 'swipe'
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500'
                    }`}
                >
                  Deslizar
                </button>
                <button
                  onClick={() => setStudyMode('classic')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${studyMode === 'classic'
                    ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500'
                    }`}
                >
                  Botones
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="dark"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="rounded border-zinc-300 w-4 h-4 text-indigo-600"
              />
              <label htmlFor="dark" className="text-sm font-medium">
                Modo oscuro
              </label>
            </div>
          </div>
        </Section>

        <Section title="Cuenta y Sincronización" defaultOpen={true}>
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">{currentUser.email}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Sincronización activada</p>
                </div>
                <Button
                  variant="ghost"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1 h-12 rounded-xl"
                  onClick={async () => {
                    try {
                      await CloudSyncService.uploadSnapshot(currentUser, true);
                      alert("Copia de seguridad subida correctamente");
                    } catch (err: any) {
                      const { remaining } = CloudSyncService.canSync();
                      if (remaining > 0) alert(`Espera ${remaining}s para sincronizar de nuevo.`);
                      else alert(err.message || "Error al subir");
                    }
                  }}
                >
                  <Cloud className="w-4 h-4 mr-2 text-indigo-600" />
                  Subir a la nube
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 h-12 rounded-xl"
                  onClick={async () => {
                    try {
                      const updated = await CloudSyncService.syncFromCloud(currentUser, true);
                      if (updated) alert("Datos sincronizados desde la nube");
                      else alert("Ya estás al día");
                    } catch (err: any) {
                      const { remaining } = CloudSyncService.canSync();
                      if (remaining > 0) alert(`Espera ${remaining}s para sincronizar de nuevo.`);
                      else alert(err.message || "Error al sincronizar");
                    }
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-indigo-600" />
                  Bajar de la nube
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center">
              <CloudOff className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-zinc-500 mb-4">
                Inicia sesión para sincronizar tu progreso y nunca perder tus tarjetas.
              </p>
              <Button onClick={() => window.location.href = '/login'}>
                Iniciar Sesión
              </Button>
            </div>
          )}
        </Section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave}>Guardar configuración</Button>
        <Button
          variant="secondary"
          onClick={() => {
            setHasSeenTutorial(false);
            window.dispatchEvent(new CustomEvent('icfes-show-onboarding'));
          }}
        >
          Ver tutorial de nuevo
        </Button>
      </div>
    </div>
  );
}
