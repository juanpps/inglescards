import { useMemo } from 'react';
import { BarChart3, Target, Award, Download, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { loadDatabase } from '../lib/storage';

export function Estadisticas() {
  const stats = useMemo(() => {
    // ... (mismo código de stats)
    const db = loadDatabase();
    const total = Object.keys(db.cards).length;
    const mastered = Object.values(db.cards).filter((c) => c.state === 'mastered').length;
    const accuracy = db.stats.totalStudied > 0 ? Math.round((db.stats.totalCorrect / db.stats.totalStudied) * 100) : 0;
    const byGroup = Object.entries(db.stats.byGroup).map(([gid, s]) => {
      const g = db.groups[gid];
      return { name: g?.name ?? gid, studied: s.studied, correct: s.correct, percent: s.studied > 0 ? Math.round((s.correct / s.studied) * 100) : 0 };
    });
    return { total, mastered, accuracy, totalStudied: db.stats.totalStudied, streakDays: db.stats.streakDays, byGroup };
  }, []);

  const exportToCSV = () => {
    const headers = ['Nombre Grupo', 'Repasos Totales', 'Aciertos', 'Precision %'];
    const rows = stats.byGroup.map(g => [g.name, g.studied, g.correct, `${g.percent}%`]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `icfes_stats_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Estadísticas
          </h1>
          <p className="text-zinc-500 mt-1">Tu progreso global y por grupo</p>
        </div>
        <Button onClick={exportToCSV} variant="secondary" className="bg-white dark:bg-zinc-800 shadow-premium border-none">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Tarjetas repasadas
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.totalStudied}</div>
          </CardContent>
        </Card>

        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Precisión
            </CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.accuracy}%</div>
          </CardContent>
        </Card>

        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Dominadas
            </CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {stats.mastered} <span className="text-lg font-medium text-zinc-400">/ {stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass shadow-premium border-none rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Racha (días)
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.streakDays}</div>
          </CardContent>
        </Card>
      </div>

      {stats.byGroup.length > 0 && (
        <Card className="glass shadow-premium border-none rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Rendimiento por grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byGroup.map((g: any) => (
                <div key={g.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-zinc-800/50 border border-white/20 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{g.name}</span>
                    <span className="text-sm text-zinc-500">{g.studied} repasos totales</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{g.percent}%</span>
                      <span className="text-[10px] uppercase font-bold tracking-tighter text-zinc-400">Precisión</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
