import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X } from 'lucide-react';
import type { Achievement } from '../types/achievements';
import confetti from 'canvas-confetti';

export function AchievementOverlay() {
    const [queue, setQueue] = useState<Achievement[]>([]);
    const [current, setCurrent] = useState<Achievement | null>(null);

    useEffect(() => {
        const handleUnlock = (e: any) => {
            const ach = e.detail as Achievement;
            setQueue(prev => [...prev, ach]);
        };

        window.addEventListener('achievement-unlocked', handleUnlock);
        return () => window.removeEventListener('achievement-unlocked', handleUnlock);
    }, []);

    useEffect(() => {
        if (!current && queue.length > 0) {
            const next = queue[0];
            setQueue(prev => prev.slice(1));
            setCurrent(next);

            // Celebration!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
            });

            // Auto close after 5 seconds
            const timer = setTimeout(() => setCurrent(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [queue, current]);

    return (
        <AnimatePresence>
            {current && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
                >
                    <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-1 shadow-2xl border border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 p-5 rounded-[24px] flex items-center gap-4 relative">
                            <div className="absolute top-2 right-2">
                                <button onClick={() => setCurrent(null)} className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center text-3xl">
                                {current.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">¡Logro Desbloqueado!</span>
                                </div>
                                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                                    {current.title}
                                </h3>
                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                                    {current.description}
                                </p>
                            </div>

                            <motion.div
                                className="absolute -bottom-2 -left-2 opacity-10"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            >
                                <Star className="w-20 h-20 text-indigo-500" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
