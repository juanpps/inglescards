import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Award, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { loadDatabase } from '../lib/storage';
import { getDueCount } from '../lib/srs';

export function Dashboard() {
  const stats = useMemo(() => {
    const db = loadDatabase();
    const totalCards = Object.keys(db.cards).length;
    const newCards = Object.values(db.cards).filter((c) => c.state === 'new').length;
    const mastered = Object.values(db.cards).filter((c) => c.state === 'mastered').length;
    const dueToday = getDueCount(null);
    const accuracy =
      db.stats.totalStudied > 0
        ? Math.round((db.stats.totalCorrect / db.stats.totalStudied) * 100)
        : 0;

    return { totalCards, newCards, mastered, dueToday, accuracy };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-1">Resumen de tu progreso</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 glass rounded-2xl shadow-premium border-white/20 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Pendientes hoy
            </CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.dueToday}</div>
            <Link to="/estudiar">
              <Button variant="secondary" size="sm" className="mt-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-none hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
                Estudiar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Nuevas
            </CardTitle>
            <Plus className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.newCards}</div>
            <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-tighter">sin estudiar</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Dominadas
            </CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.mastered}</div>
            <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-tighter">de {stats.totalCards} total</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Precisión
            </CardTitle>
            <BookOpen className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.accuracy}%</div>
            <p className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-tighter">en repasos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-premium rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
        <CardContent className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">¡Listo para practicar!</CardTitle>
            <p className="text-indigo-100 text-base sm:text-lg opacity-90">
              Continúa tu racha y mejora tu vocabulario para el ICFES hoy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/estudiar" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-h-[56px] px-8 bg-white text-indigo-600 hover:bg-zinc-100 border-none shadow-lg text-lg font-bold">
                Estudiar ahora
              </Button>
            </Link>
            <Link to="/importar" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto min-h-[56px] px-8 text-white hover:bg-white/10 border-white/20 text-lg">
                Importar tarjetas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
