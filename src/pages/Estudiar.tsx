import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getDueCards, processReview, saveCardAndStats } from '../lib/srs';
import { loadDatabase } from '../lib/storage';
import type { Card as CardType } from '../types';
import { ChevronLeft, Keyboard, MoveHorizontal, CheckCircle2, XCircle, Zap } from 'lucide-react';

import { playSuccessSound, playErrorSound, playFlipSound } from '../lib/audio';

export function Estudiar() {
  const [searchParams] = useSearchParams();
  const groupsParam = searchParams.get('groups') ?? '';
  const isIntensive = searchParams.get('mode') === 'intensive';

  const groupIds = useMemo(
    () => (groupsParam ? groupsParam.split(',').filter(Boolean) : null),
    [groupsParam]
  );

  const [cards, setCards] = useState<CardType[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [nextInterval, setNextInterval] = useState<string | null>(null);
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const successOpacity = useTransform(x, [50, 150], [0, 1]);
  const failureOpacity = useTransform(x, [-150, -50], [1, 0]);

  useEffect(() => {
    const due = getDueCards(groupIds, undefined, groupIds === null, isIntensive);
    setCards(due);
    setIndex(0);
    setFlipped(false);
    setShowHint(false);
  }, [groupsParam, groupIds, isIntensive]);

  const current = cards[index];
  const settings = loadDatabase().settings;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFlip = () => {
    if (!flipped && !isWritingMode) {
      setFlipped(true);
      playFlipSound();
    }
  };

  const handleReview = (quality: 1 | 5) => {
    if (!current) return;

    if (quality === 5) playSuccessSound();
    else playErrorSound();

    const updated = processReview(current, quality, settings);
    saveCardAndStats(updated, quality === 5);

    let intervalText: string | null = null;
    if (updated.interval > 0) {
      intervalText = updated.interval === 1 ? '1 día' : `${updated.interval} días`;
    } else {
      const now = Date.now();
      const diffMs = updated.dueDate - now;
      const diffMin = Math.round(diffMs / 60000);
      if (diffMin < 60) {
        intervalText = `${diffMin} min`;
      } else {
        const diffHrs = Math.round(diffMin / 60);
        intervalText = `${diffHrs} h`;
      }
    }

    setNextInterval(intervalText);

    setTimeout(() => {
      setIndex((i) => i + 1);
      setFlipped(false);
      setShowHint(false);
      setNextInterval(null);
      setUserInput('');
      setIsCorrect(null);
      x.set(0);
    }, 400);
  };

  const handleWritingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || isCorrect !== null) return;

    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedTranslation = current.translation.trim().toLowerCase();

    if (normalizedInput === normalizedTranslation) {
      setIsCorrect(true);
      setFlipped(true);
      handleReview(5);
    } else {
      setIsCorrect(false);
      setFlipped(true);
      playErrorSound();
    }
  };

  if (cards.length === 0 || index >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/50 dark:bg-zinc-900/50 p-8 rounded-3xl glass shadow-premium"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {index >= cards.length && cards.length > 0 ? '¡Sesión completada!' : '¡Todo al día!'}
          </h2>
          <p className="text-zinc-500 mt-2">
            {index >= cards.length && cards.length > 0
              ? 'Has dominado nuevas palabras hoy. ¡Buen trabajo!'
              : 'No hay tarjetas pendientes por ahora.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/grupos">
              <Button variant="secondary" className="rounded-2xl px-6">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Cambiar grupo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const studyMode = settings.studyMode ?? 'swipe';

  return (
    <div className="max-w-xl mx-auto space-y-8 px-4 py-6">
      <div className="flex items-center justify-between">
        <Link
          to="/grupos"
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {groupIds ? 'Grupos' : 'Dashboard'}
        </Link>

        <div className="flex items-center gap-4">
          {isIntensive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-wider">Intensivo</span>
            </div>
          )}
          <button
            onClick={() => setIsWritingMode(!isWritingMode)}
            className={`p-2 rounded-xl transition-all ${isWritingMode
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              }`}
            title={isWritingMode ? 'Modo lectura' : 'Modo escritura'}
          >
            {isWritingMode ? <Keyboard className="w-5 h-5" /> : <MoveHorizontal className="w-5 h-5" />}
          </button>
          <span className="text-xs font-bold font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-lg">
            {index + 1} / {cards.length}
          </span>
        </div>
      </div>

      <div className="relative h-[400px] w-full [perspective:1200px]">
        <AnimatePresence mode="wait">
          {!flipped || isWritingMode ? (
            <motion.div
              key={`front-${index}`}
              style={{ x: studyMode === 'swipe' && flipped ? x : 0, rotate: studyMode === 'swipe' && flipped ? rotate : 0, opacity }}
              drag={studyMode === 'swipe' && flipped && !isWritingMode ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (isWritingMode || !flipped) return;
                if (info.offset.x > 100) handleReview(5);
                else if (info.offset.x < -100) handleReview(1);
              }}
              onClick={handleFlip}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Card className="h-full w-full flex flex-col items-center justify-center p-8 glass rounded-[40px] shadow-premium border-white/20 dark:border-white/10 relative overflow-hidden bg-white dark:bg-zinc-900/80">
                <motion.div
                  style={{ opacity: successOpacity }}
                  className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center pointer-events-none"
                >
                  <CheckCircle2 className="w-20 h-20 text-emerald-500/40" />
                </motion.div>
                <motion.div
                  style={{ opacity: failureOpacity }}
                  className="absolute inset-0 bg-rose-500/10 flex items-center justify-center pointer-events-none"
                >
                  <XCircle className="w-20 h-20 text-rose-500/40" />
                </motion.div>

                <CardContent className="flex flex-col items-center justify-center w-full space-y-6 text-center">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400">
                    {isWritingMode ? 'Escribe la traducción' : '¿Cómo se dice?'}
                  </span>
                  <p className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                    {current?.word}
                  </p>

                  {isWritingMode ? (
                    <form onSubmit={handleWritingSubmit} className="w-full mt-4">
                      <input
                        ref={inputRef}
                        autoFocus
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Escribe aquí..."
                        className={`w-full bg-zinc-100 dark:bg-zinc-800/50 border-2 rounded-2xl px-6 py-4 text-center text-xl font-bold transition-all outline-none ${isCorrect === true ? 'border-emerald-500 ring-4 ring-emerald-500/10' :
                          isCorrect === false ? 'border-rose-500 ring-4 ring-rose-500/10' :
                            'border-transparent focus:border-indigo-500'
                          }`}
                        disabled={isCorrect !== null}
                      />
                      {isCorrect === false && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleReview(1)}
                          className="mt-4 text-rose-500 font-bold"
                        >
                          Entendido, lo intentaré luego
                        </Button>
                      )}
                    </form>
                  ) : (
                    <>
                      {current?.example && (
                        <p className="text-lg text-zinc-500 dark:text-zinc-400 italic leading-relaxed max-w-[90%] font-medium">
                          "{current.example}"
                        </p>
                      )}
                      {!showHint ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="text-xs font-black text-indigo-500 bg-indigo-500/10 px-4 py-2 rounded-full hover:scale-105 transition-transform"
                        >
                          VER PISTA
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10"
                        >
                          <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                            {current.definition}
                          </p>
                        </motion.div>
                      )}
                      <p className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest pt-4">
                        {flipped ? (studyMode === 'swipe' ? 'Desliza para calificar' : 'Elige tu nivel abajo') : 'Toca para revelar'}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={`back-${index}`}
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
              className="absolute inset-0"
              style={{ x: studyMode === 'swipe' ? x : 0, rotate: studyMode === 'swipe' ? rotate : 0 }}
              drag={studyMode === 'swipe' ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (studyMode !== 'swipe') return;
                if (info.offset.x > 100) handleReview(5);
                else if (info.offset.x < -100) handleReview(1);
              }}
            >
              <Card className="h-full w-full flex flex-col items-center justify-center p-8 rounded-[40px] shadow-premium border-indigo-400/20 dark:border-white/10 bg-indigo-600 dark:bg-indigo-950 text-white relative overflow-hidden backdrop-blur-xl">
                <motion.div
                  style={{ opacity: successOpacity }}
                  className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center pointer-events-none"
                >
                  <CheckCircle2 className="w-20 h-20 text-white/40" />
                </motion.div>
                <motion.div
                  style={{ opacity: failureOpacity }}
                  className="absolute inset-0 bg-rose-500/20 flex items-center justify-center pointer-events-none"
                >
                  <XCircle className="w-20 h-20 text-white/40" />
                </motion.div>

                <CardContent className="flex flex-col items-center justify-center w-full space-y-6 text-center">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50">
                    Traducción
                  </span>
                  <p className="text-4xl sm:text-5xl font-black tracking-tighter">
                    {current?.translation}
                  </p>

                  <div className="w-full space-y-4 pt-4">
                    {current?.definition && (
                      <div className="bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
                        <p className="text-sm sm:text-base font-semibold leading-relaxed">
                          {current.definition}
                        </p>
                      </div>
                    )}

                    {studyMode === 'classic' && (
                      <div className="flex flex-wrap gap-2 justify-center pt-6">
                        {[
                          { label: 'Again', q: 1, color: 'bg-rose-500' },
                          { label: 'Hard', q: 2, color: 'bg-amber-600' },
                          { label: 'Good', q: 3, color: 'bg-indigo-400' },
                          { label: 'Easy', q: 4, color: 'bg-emerald-500' },
                          { label: 'Perfect', q: 5, color: 'bg-sky-500' },
                        ].map((btn) => (
                          <button
                            key={btn.q}
                            onClick={() => handleReview(btn.q as any)}
                            className={`${btn.color} hover:scale-105 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all shadow-lg`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {studyMode === 'swipe' && (
                      <div className="flex gap-4 justify-center pt-6">
                        <Button
                          onClick={() => handleReview(1)}
                          className="bg-white/10 hover:bg-rose-500 text-white border-0 rounded-2xl px-8 h-12 font-bold transition-all"
                        >
                          Fallo
                        </Button>
                        <Button
                          onClick={() => handleReview(5)}
                          className="bg-white text-indigo-600 hover:bg-emerald-500 hover:text-white border-0 rounded-2xl px-10 h-12 font-black shadow-xl transition-all"
                        >
                          ¡Lo tengo!
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {nextInterval && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs font-black text-emerald-500 uppercase tracking-widest"
        >
          Próxima meta: {nextInterval}
        </motion.p>
      )}

      {studyMode === 'swipe' && (
        <div className="flex justify-center gap-8 opacity-20 pointer-events-none sm:opacity-40">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${flipped ? 'border-rose-500 text-rose-500' : 'border-zinc-300 text-zinc-300'}`}>
              <ChevronLeft />
            </div>
            <span className={`text-[10px] font-bold uppercase transition-colors ${flipped ? 'text-rose-500' : 'text-zinc-300'}`}>Fallo</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${flipped ? 'border-emerald-500 text-emerald-500' : 'border-zinc-300 text-zinc-300'}`}>
              <ChevronLeft className="rotate-180" />
            </div>
            <span className={`text-[10px] font-bold uppercase transition-colors ${flipped ? 'text-emerald-500' : 'text-zinc-300'}`}>Acierto</span>
          </div>
        </div>
      )}
    </div>
  );
}
