import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Award, Target, Sun, Moon, Star, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { loadDatabase, saveDatabase } from '../lib/storage';

export function Dashboard() {
  const stats = useMemo(() => {
    const db = loadDatabase();
    const now = Date.now();
    const cards = Object.values(db.cards);

    let newCards = 0;
    let mastered = 0;
    let dueToday = 0;
    const leechThreshold = db.settings.leechThreshold ?? 8;

    for (const c of cards) {
      if (c.state === 'new') newCards++;
      if (c.state === 'mastered') mastered++;

      const isLeech = (c.lapses ?? 0) >= leechThreshold;
      if (!isLeech && c.dueDate <= now) {
        dueToday++;
      }
    }

    const accuracy =
      db.stats.totalStudied > 0
        ? Math.round((db.stats.totalCorrect / db.stats.totalStudied) * 100)
        : 0;

    return {
      totalCards: cards.length,
      newCards,
      mastered,
      dueToday,
      accuracy,
      points: db.stats.points || 0,
      streak: db.stats.streakDays || 0
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 mt-1">Resumen de tu progreso</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl w-10 h-10 p-0"
          onClick={() => {
            const db = loadDatabase();
            const next = !db.settings.darkMode;
            db.settings.darkMode = next;
            saveDatabase(db);
            window.dispatchEvent(new CustomEvent('theme-change', { detail: next }));
          }}
        >
          <Sun className="h-5 w-5 dark:hidden text-amber-500" />
          <Moon className="h-5 w-5 hidden dark:block text-indigo-400" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300 glass rounded-2xl shadow-premium border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="h-16 w-16 text-indigo-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Pendientes hoy
            </CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{stats.dueToday}</div>
            <Link to="/estudiar">
              <Button size="sm" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-bold px-4">
                Estudiar
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="h-16 w-16 text-emerald-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Dominadas
            </CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{stats.mastered}</div>
            <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">de {stats.totalCards} tarjetas</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="h-16 w-16 text-amber-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Puntos Totales
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">{stats.points.toLocaleString()}</div>
            <Link to="/ranking" className="text-[10px] font-black text-indigo-500 hover:underline uppercase tracking-widest mt-2 inline-block">Ver Ranking Global →</Link>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Flame className="h-16 w-16 text-orange-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Racha Actual
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-orange-500">{stats.streak} días</div>
            <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">¡No te detengas!</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen className="h-16 w-16 text-rose-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Precisión
            </CardTitle>
            <BookOpen className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-rose-500">{stats.accuracy}%</div>
            <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">en tus repasos</p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl shadow-premium border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Plus className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Por Estudiar
            </CardTitle>
            <Plus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight text-blue-500">{stats.newCards}</div>
            <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">tarjetas nuevas</p>
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
