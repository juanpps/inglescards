import { useMemo } from 'react';
import { BarChart3, Target, Award, Download, Flame, PieChart, TrendingUp, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { loadDatabase } from '../lib/storage';
import { motion } from 'framer-motion';

export function Estadisticas() {
  const stats = useMemo(() => {
    const db = loadDatabase();
    const cards = Object.values(db.cards);
    const total = cards.length;

    const states = { new: 0, learning: 0, review: 0, mastered: 0 };
    let totalLapses = 0;

    // Group counters
    const groupMap: Record<string, { count: number; mastered: number }> = {};
    for (const gid of Object.keys(db.groups)) {
      groupMap[gid] = { count: 0, mastered: 0 };
    }

    for (const c of cards) {
      // States
      if (c.state === 'new') states.new++;
      else if (c.state === 'review') states.review++;
      else if (c.state === 'mastered') states.mastered++;
      else states.learning++; // learning or relearning

      // Retention
      totalLapses += (c.lapses || 0);

      // Groups
      for (const gid of c.groups) {
        if (groupMap[gid]) {
          groupMap[gid].count++;
          if (c.state === 'mastered') groupMap[gid].mastered++;
        }
      }
    }

    const accuracy = db.stats.totalStudied > 0 ? Math.round((db.stats.totalCorrect / db.stats.totalStudied) * 100) : 0;
    const retention = db.stats.totalStudied > 0
      ? Math.max(0, Math.round(((db.stats.totalStudied - totalLapses) / db.stats.totalStudied) * 100))
      : 0;

    const byGroup = Object.entries(db.stats.byGroup).map(([gid, s]) => {
      const g = db.groups[gid];
      const gm = groupMap[gid] || { count: 0, mastered: 0 };
      return {
        name: g?.name ?? gid,
        studied: s.studied,
        correct: s.correct,
        percent: s.studied > 0 ? Math.round((s.correct / s.studied) * 100) : 0,
        count: gm.count,
        mastered: gm.mastered,
        progress: gm.count > 0 ? Math.round((gm.mastered / gm.count) * 100) : 0
      };
    }).sort((a, b) => b.studied - a.studied);

    return { total, states, accuracy, retention, totalStudied: db.stats.totalStudied, streakDays: db.stats.streakDays, byGroup };
  }, []);

  const exportToCSV = () => {
    const headers = ['Nombre Grupo', 'Tarjetas', 'Dominadas', 'Progreso %', 'Repasos Totales', 'Precision %'];
    const rows = stats.byGroup.map(g => [g.name, g.count, g.mastered, `${g.progress}%`, g.studied, `${g.percent}%`]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `icfes_stats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const stateColors = {
    new: 'bg-zinc-300 dark:bg-zinc-700',
    learning: 'bg-indigo-400 dark:bg-indigo-500',
    review: 'bg-emerald-400 dark:bg-emerald-500',
    mastered: 'bg-amber-400 dark:bg-amber-500',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Estadísticas
          </h1>
          <p className="text-zinc-500 font-medium">Análisis detallado de tu aprendizaje</p>
        </div>
        <Button onClick={exportToCSV} variant="secondary" className="bg-white dark:bg-zinc-800 shadow-premium border-none rounded-2xl h-11">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Repasos', val: stats.totalStudied, icon: BarChart3, color: 'text-indigo-500' },
          { label: 'Precisión', val: `${stats.accuracy}%`, icon: Target, color: 'text-emerald-500' },
          { label: 'Retención', val: `${stats.retention}%`, icon: TrendingUp, color: 'text-sky-500' },
          { label: 'Racha', val: stats.streakDays, icon: Flame, color: 'text-orange-500' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass shadow-premium border-none rounded-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <item.icon className="w-12 h-12" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">{item.val}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass shadow-premium border-none rounded-[32px] p-6">
          <CardHeader className="px-0 pt-0 pb-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Distribución de Estados</CardTitle>
              <p className="text-xs text-zinc-500 font-medium mt-1">Nivel de dominio de tus {stats.total} tarjetas</p>
            </div>
            <Layers className="w-5 h-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="px-0">
            <div className="h-10 w-full flex rounded-2xl overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-800">
              {Object.entries(stats.states).map(([state, count]) => {
                const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                if (percent === 0) return null;
                return (
                  <motion.div
                    key={state}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`${stateColors[state as keyof typeof stateColors]} h-full relative group`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                      {state.toUpperCase()}: {count}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {Object.entries(stats.states).map(([state, count]) => (
                <div key={state} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stateColors[state as keyof typeof stateColors]}`} />
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">{state}</span>
                  </div>
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{count}</span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% del total
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-premium border-none rounded-[32px] p-6 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 rounded-full border-8 border-amber-400/20 flex items-center justify-center relative mb-4">
            <div className="absolute inset-0 border-8 border-amber-400 rounded-full border-t-transparent animate-spin-slow" />
            <Award className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">{stats.states.mastered}</h3>
          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mb-6">Tarjetas Dominadas</p>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl">
            <p className="text-xs font-medium text-zinc-500 leading-relaxed">
              Has dominado el <span className="text-amber-500 font-bold">
                {stats.total > 0 ? Math.round((stats.states.mastered / stats.total) * 100) : 0}%
              </span> del contenido disponible. ¡Sigue así para llegar al 100%!
            </p>
          </div>
        </Card>
      </div>

      {stats.byGroup.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Rendimiento por Grupo</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.byGroup.map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-premium transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{g.name}</span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{g.studied} repasos</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">{g.progress}%</span>
                    <p className="text-[8px] uppercase font-black text-zinc-400 tracking-tighter">Dominio</p>
                  </div>
                </div>

                <div className="h-2 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                  />
                </div>

                <div className="flex justify-between items-center mt-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>{g.mastered} / {g.count} Dom</span>
                  <span className={`${g.percent >= 80 ? 'text-emerald-500' : 'text-zinc-500'}`}>Precisión {g.percent}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
