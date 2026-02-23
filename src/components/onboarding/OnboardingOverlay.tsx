import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';
import { loadDatabase, saveDatabase } from '../../lib/storage';

const STEPS = [
  {
    id: 'import',
    title: 'Importa o crea tu primera tarjeta',
    description: 'Puedes importar vocabulario desde un archivo JSON o crear tarjetas manualmente.',
    path: '/importar',
    selector: '[data-onboarding="import"]',
  },
  {
    id: 'grupos',
    title: 'Organiza en grupos',
    description: 'Crea grupos temáticos para organizar tus tarjetas y estudiar por temas.',
    path: '/grupos',
    selector: '[data-onboarding="grupos"]',
  },
  {
    id: 'estudiar',
    title: 'Estudia con repetición espaciada',
    description: 'El algoritmo SRS te ayudará a repasar en el momento óptimo para memorizar mejor.',
    path: '/estudiar',
    selector: '[data-onboarding="estudiar"]',
  },
  {
    id: 'estadisticas',
    title: 'Revisa tu progreso',
    description: 'Consulta estadísticas de estudio, rachas y dominio por grupo.',
    path: '/estadisticas',
    selector: '[data-onboarding="estadisticas"]',
  },
  {
    id: 'config',
    title: 'Configura el SRS',
    description: 'Ajusta límites diarios, intervalos y parámetros avanzados del algoritmo.',
    path: '/configuracion',
    selector: '[data-onboarding="config"]',
  },
  {
    id: 'mode',
    title: 'Elige tu estilo',
    description: '¿Prefieres deslizar tarjetas (Swipe) o usar botones clásicos de precisión?',
    path: '/',
    selector: '',
  },
];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState<DOMRect | null>(null);
  const navigate = useNavigate();
  const rafRef = useRef<number | null>(null);

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  useEffect(() => {
    const updateSpotlight = () => {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSpotlight(rect);
      } else {
        setSpotlight(null);
      }
    };
    updateSpotlight();
    const obs = new ResizeObserver(updateSpotlight);
    const el = document.querySelector(currentStep.selector);
    if (el) obs.observe(el);
    window.addEventListener('scroll', updateSpotlight, true);
    rafRef.current = requestAnimationFrame(updateSpotlight);
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', updateSpotlight, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentStep.selector]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleGoTo = () => {
    navigate(currentStep.path);
    if (isLast) {
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleSkip}
        aria-hidden="true"
      />
      {spotlight && (
        <div
          className="absolute rounded-xl ring-4 ring-indigo-400 ring-offset-2 ring-offset-transparent bg-transparent pointer-events-none animate-pulse"
          style={{
            left: spotlight.left - 8,
            top: spotlight.top - 8,
            width: spotlight.width + 16,
            height: spotlight.height + 16,
          }}
        />
      )}
      <div
        className="relative z-10 mx-4 max-w-md w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
              Paso {step + 1} de {STEPS.length}
            </p>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {currentStep.title}
            </h2>
          </div>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          {currentStep.description}
        </p>
        {currentStep.id === 'mode' ? (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                const db = loadDatabase();
                db.settings.studyMode = 'swipe';
                saveDatabase(db);
                handleNext();
              }}
              className="flex-1 p-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 transition-all text-center"
            >
              <div className="text-2xl mb-1">👆</div>
              <div className="font-bold text-sm">Deslizar</div>
              <div className="text-[10px] text-zinc-500">Rápido y táctil</div>
            </button>
            <button
              onClick={() => {
                const db = loadDatabase();
                db.settings.studyMode = 'classic';
                saveDatabase(db);
                handleNext();
              }}
              className="flex-1 p-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 transition-all text-center"
            >
              <div className="text-2xl mb-1">⌨️</div>
              <div className="font-bold text-sm">Botones</div>
              <div className="text-[10px] text-zinc-500">Precisión Anki</div>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGoTo}>
              {isLast ? 'Empezar' : 'Ir ahí'}
            </Button>
            <Button variant="secondary" onClick={handleNext}>
              {isLast ? 'Finalizar' : 'Siguiente'}
            </Button>
            <Button variant="ghost" onClick={handleSkip}>
              Saltar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
