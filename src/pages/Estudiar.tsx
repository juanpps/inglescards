import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getDueCards, processReview, saveCard, updateStats } from '../lib/srs';
import { loadDatabase } from '../lib/storage';
import type { Card as CardType } from '../types';
import { ChevronLeft } from 'lucide-react';

import { playSuccessSound, playErrorSound, playFlipSound } from '../lib/audio';

const QUALITY = [
  { q: 1 as const, label: 'Again', color: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white dark:text-rose-400' },
  { q: 2 as const, label: 'Hard', color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white dark:text-amber-400' },
  { q: 3 as const, label: 'Good', color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:text-emerald-400' },
  { q: 4 as const, label: 'Easy', color: 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white dark:text-indigo-400' },
  { q: 5 as const, label: 'Easy+', color: 'bg-violet-500/10 text-violet-600 hover:bg-violet-500 hover:text-white dark:text-violet-400' },
];

export function Estudiar() {
  const [searchParams] = useSearchParams();
  const groupsParam = searchParams.get('groups') ?? '';
  const groupIds = useMemo(
    () => (groupsParam ? groupsParam.split(',').filter(Boolean) : null),
    [groupsParam]
  );

  const [cards, setCards] = useState<CardType[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [nextInterval, setNextInterval] = useState<string | null>(null);

  useEffect(() => {
    const due = getDueCards(groupIds);
    setCards(due);
    setIndex(0);
    setFlipped(false);
    setShowHint(false);
  }, [groupsParam]);

  const current = cards[index];
  const settings = loadDatabase().settings;

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      playFlipSound();
    }
  };

  const handleQuality = (quality: (typeof QUALITY)[number]['q']) => {
    if (!current) return;

    if (quality >= 3) playSuccessSound();
    else playErrorSound();

    const updated = processReview(current, quality, settings);
    saveCard(updated);
    updateStats(quality >= 3, current.groups);
    const interval =
      updated.interval > 0
        ? updated.interval === 1
          ? '1 día'
          : `${updated.interval} días`
        : null;
    setNextInterval(interval ?? null);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setFlipped(false);
      setShowHint(false);
      setNextInterval(null);
    }, 300);
  };

  if (cards.length === 0 || index >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {index >= cards.length && cards.length > 0 ? '¡Sesión completada!' : '¡Todo al día!'}
        </h2>
        <p className="text-zinc-500 mt-2">
          {index >= cards.length && cards.length > 0
            ? 'Completaste todas las tarjetas de esta sesión.'
            : 'No hay tarjetas pendientes para estudiar.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/grupos">
            <Button variant="secondary">
              <ChevronLeft className="w-4 h-4 mr-2 inline" />
              Cambiar grupo
            </Button>
          </Link>
          <Link to="/estudiar">
            <Button variant="ghost">Estudiar todo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/grupos"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors touch-manipulation min-h-[44px] items-center"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          {groupIds ? 'Cambiar grupo' : 'Ver grupos'}
        </Link>
        <span className="text-sm text-zinc-500">
          {index + 1} / {cards.length}
        </span>
      </div>

      <div
        className="cursor-pointer [perspective:1200px] touch-manipulation min-h-[220px] sm:min-h-[300px] group"
        onClick={handleFlip}
      >
        <div
          className="relative min-h-[220px] sm:min-h-[300px] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 [backface-visibility:hidden] glass rounded-3xl shadow-premium border-white/20 dark:border-white/10"
            style={{ transform: 'rotateY(0deg)' }}
          >
            <CardContent className="flex flex-col items-center justify-center w-full space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-500/80 dark:text-indigo-400/80">
                Pregunta
              </span>
              <p className="text-3xl sm:text-4xl font-bold text-center text-zinc-900 dark:text-zinc-50 tracking-tight break-words max-w-full">
                {current?.word}
              </p>
              {current?.example && (
                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 text-center italic leading-relaxed max-w-[90%] mx-auto">
                  "{current.example}"
                </p>
              )}
              {current?.definition && !flipped && (
                <div className="mt-4">
                  {!showHint ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full transition-all"
                    >
                      Ver pista (definición)
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 max-w-[90%] mx-auto">
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 italic">
                        {current.definition}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {!flipped && (
                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-tighter">
                    Toca para revelar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 bg-white/40 dark:bg-zinc-900/40 [backface-visibility:hidden] glass rounded-3xl shadow-premium border-white/20 dark:border-white/10"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <CardContent className="flex flex-col items-center justify-center w-full space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-500/80 dark:text-emerald-400/80">
                Respuesta
              </span>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 text-center tracking-tight break-words max-w-full">
                {current?.translation}
              </p>
              <div className="space-y-4 w-full">
                {current?.definition && (
                  <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/5 dark:to-violet-500/5 p-5 rounded-3xl border border-indigo-500/10 shadow-inner">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1 block text-center">Definición</span>
                    <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-200 text-center font-medium leading-relaxed">
                      {current.definition}
                    </p>
                  </div>
                )}
                {current?.example && (
                  <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 text-center italic leading-relaxed opacity-80">
                    "{current.example}"
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {flipped && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {QUALITY.map(({ q, label, color }) => (
            <Button
              key={q}
              className={`${color} text-white border-0 min-h-[48px] sm:min-h-0 touch-manipulation`}
              onClick={() => handleQuality(q)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {nextInterval && (
        <p className="text-center text-sm text-zinc-500">
          Próxima repetición: {nextInterval}
        </p>
      )}
    </div>
  );
}
