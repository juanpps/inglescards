export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    requirement: (stats: any, cards: any[]) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_steps',
        title: 'Primeros Pasos',
        description: 'Estudia tu primera tarjeta',
        icon: '🌱',
        color: 'text-emerald-500',
        requirement: (stats) => stats.totalStudied >= 1,
    },
    {
        id: 'streak_3',
        title: 'Constancia',
        description: 'Mantén una racha de 3 días',
        icon: '🔥',
        color: 'text-orange-500',
        requirement: (stats) => stats.streakDays >= 3,
    },
    {
        id: 'master_10',
        title: 'Aprendiz',
        description: 'Domina 10 palabras',
        icon: '🎓',
        color: 'text-indigo-500',
        requirement: (stats) => stats.masteredCount >= 10,
    },
    {
        id: 'points_1000',
        title: 'Milionario de Puntos',
        description: 'Alcanza los 1,000 puntos',
        icon: '💰',
        color: 'text-amber-500',
        requirement: (stats) => stats.points >= 1000,
    },
    {
        id: 'perfect_session',
        title: 'Mente Brillante',
        description: 'Ten una precisión mayor al 90% con más de 50 repasos',
        icon: '✨',
        color: 'text-violet-500',
        requirement: (stats) => stats.totalStudied >= 50 && (stats.totalCorrect / stats.totalStudied) >= 0.9,
    },
    {
        id: 'night_owl',
        title: 'Búho Nocturno',
        description: 'Estudia después de las 10 PM',
        icon: '🦉',
        color: 'text-slate-500',
        requirement: () => {
            const hour = new Date().getHours();
            return hour >= 22 || hour <= 4;
        }
    }
];
