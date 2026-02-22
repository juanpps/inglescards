import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { loadDatabase, saveDatabase, setHasSeenTutorial } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../types';
import type { Settings } from '../types';

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
  const [darkMode, setDarkMode] = useState(db.settings.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSave = () => {
    const db = loadDatabase();
    const s: Partial<Settings> = {
      newCardsPerDay: Math.max(1, Math.min(100, newPerDay)),
      reviewCardsPerDay: Math.max(10, Math.min(500, reviewPerDay)),
      learnSteps: [Math.max(0.5, learnStep1), Math.max(1, learnStep2)].sort(
        (a, b) => a - b
      ),
      lapseSteps: [Math.max(1, lapseStep)],
      graduatingInterval: Math.max(0.5, graduatingInterval),
      easyInterval: Math.max(1, easyInterval),
      newInterval: Math.max(0.5, newInterval),
      leechThreshold: Math.max(1, Math.min(20, leechThreshold)),
      darkMode,
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
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dark"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <label htmlFor="dark" className="text-sm font-medium">
              Modo oscuro
            </label>
          </div>
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
