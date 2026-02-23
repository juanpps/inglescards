import { useState, useEffect, useCallback } from 'react';
import { Trophy, Flame, BookCheck, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';

import {
    fetchLeaderboard,
    getPointsTier,
    clearLeaderboardCache,
    type LeaderboardEntry,
    type LeaderboardFilter,
} from '../services/LeaderboardService';
import { useAuth } from '../contexts/AuthContext';

const FILTERS: { value: LeaderboardFilter; label: string }[] = [
    { value: 'all', label: 'Global' },
    { value: 'weekly', label: 'Esta semana' },
    { value: 'monthly', label: 'Este mes' },
];

const PODIUM_COLORS = [
    { bg: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-500/40', crown: '👑', rank: 1 },
    { bg: 'from-zinc-300 to-zinc-400', shadow: 'shadow-zinc-400/40', crown: '🥈', rank: 2 },
    { bg: 'from-orange-500 to-amber-700', shadow: 'shadow-orange-500/40', crown: '🥉', rank: 3 },
];

function Avatar({ user, size = 12 }: { user: Pick<LeaderboardEntry, 'photoURL' | 'displayName'>; size?: number }) {
    return user.photoURL ? (
        <img
            src={user.photoURL}
            alt={user.displayName}
            className={`w-${size} h-${size} rounded-full object-cover border-2 border-white/30`}
        />
    ) : (
        <div className={`w-${size} h-${size} rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-lg`}>
            {user.displayName?.charAt(0).toUpperCase() || 'U'}
        </div>
    );
}

function PodiumCard({ entry, rank }: { entry: LeaderboardEntry; rank: 0 | 1 | 2 }) {
    const pm = PODIUM_COLORS[rank];
    const tier = getPointsTier(entry.points);
    const pointsField = rank === 0 ? entry.points : entry.points; // always total for podium
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 + 0.1 }}
            className={`flex flex-col items-center gap-2 ${rank === 1 ? 'mt-6' : rank === 2 ? 'mt-10' : ''}`}
        >
            <span className="text-2xl">{pm.crown}</span>
            <div className={`relative`}>
                <Avatar user={entry} size={rank === 0 ? 16 : 12} />
                <span className="absolute -bottom-1 -right-1 text-sm" title={tier.label}>{tier.emoji}</span>
            </div>
            <div className="text-center max-w-[90px]">
                <p className="font-black text-zinc-900 dark:text-zinc-50 text-xs truncate">{entry.displayName}</p>
                <div className={`mt-1 bg-gradient-to-br ${pm.bg} text-white font-black text-xs px-3 py-1 rounded-full shadow-lg ${pm.shadow}`}>
                    {pointsField.toLocaleString()} pts
                </div>
            </div>
            <div className={`flex items-center gap-0.5 text-[10px] font-bold text-orange-500`}>
                <Flame className="w-3 h-3 fill-current" />
                {entry.streakDays}d
            </div>
        </motion.div>
    );
}

export function Ranking() {
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState<LeaderboardFilter>('all');
    const [users, setUsers] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async (f: LeaderboardFilter, isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
            clearLeaderboardCache();
        }
        else setLoading(true);

        const data = await fetchLeaderboard(f, 20);
        setUsers(data);

        if (isRefresh) setRefreshing(false);
        else setLoading(false);
    }, []);

    useEffect(() => { load(filter); }, [filter, load]);

    const myEntry = currentUser ? users.find((u) => u.uid === currentUser.uid) : null;
    const myRank = myEntry ? users.indexOf(myEntry) + 1 : null;
    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-3xl mb-2">
                    <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Ranking Global
                </h1>
                <p className="text-zinc-500 font-medium italic text-sm">
                    Cada tarjeta aprendida te acerca a la cima. ¡Tú puedes!
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center">
                <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1 gap-1">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f.value
                                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="mt-4 text-zinc-400 font-bold uppercase tracking-widest text-xs">Cargando...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-24 text-zinc-500">
                    <Trophy className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                    <p className="font-bold">Sin datos aún. ¡Sé el primero!</p>
                    <p className="text-sm mt-1">Estudia tarjetas para aparecer en el ranking.</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                        {/* Podium */}
                        {top3.length > 0 && (
                            <div className="flex justify-center items-end gap-6 py-4">
                                {/* Reorder: 2nd, 1st, 3rd */}
                                {[
                                    top3[1] ? { entry: top3[1], rank: 1 as const } : null,
                                    top3[0] ? { entry: top3[0], rank: 0 as const } : null,
                                    top3[2] ? { entry: top3[2], rank: 2 as const } : null,
                                ].map((item, i) =>
                                    item ? (
                                        <PodiumCard key={item.entry.uid} entry={item.entry} rank={item.rank} />
                                    ) : (
                                        <div key={i} className="w-20" />
                                    )
                                )}
                            </div>
                        )}

                        {/* Refresh button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => load(filter, true)}
                                disabled={refreshing}
                                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-500 font-bold transition-colors"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </button>
                        </div>

                        {/* Rest of the list */}
                        <div className="grid gap-3">
                            {rest.map((user, i) => {
                                const tier = getPointsTier(user.points);
                                const isMe = currentUser?.uid === user.uid;
                                const displayPoints = filter === 'weekly' ? user.weeklyPoints : filter === 'monthly' ? user.monthlyPoints : user.points;
                                return (
                                    <motion.div
                                        key={user.uid}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <Card className={`border-none shadow-sm rounded-2xl ${isMe ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'bg-white dark:bg-zinc-900'}`}>
                                            <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                                                <span className="w-7 text-center text-sm font-black text-zinc-400">
                                                    #{i + 4}
                                                </span>
                                                <Avatar user={user} size={10} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-sm">
                                                            {user.displayName}
                                                            {isMe && <span className="ml-1 text-indigo-500 text-[10px] font-black">(TÚ)</span>}
                                                        </p>
                                                        <span title={tier.label} className="text-sm">{tier.emoji}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-500">
                                                            <Flame className="w-3 h-3 fill-current" />{user.streakDays}d
                                                        </span>
                                                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                                                            <BookCheck className="w-3 h-3" />{user.masteredCount}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                                                        {displayPoints.toLocaleString()}
                                                    </div>
                                                    <div className="text-[9px] uppercase font-black tracking-widest text-zinc-400">pts</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Sticky "My position" banner */}
            {myRank && myEntry && (
                <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pointer-events-none flex justify-center">
                    <div className="pointer-events-auto bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 px-5 py-3 flex items-center gap-4 max-w-sm w-full">
                        <Avatar user={myEntry} size={10} />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm truncate">Tu posición</p>
                            <p className="text-indigo-200 text-xs font-bold">#{myRank} en el ranking</p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-xl font-black">{myEntry.points.toLocaleString()}</div>
                            <div className="text-[9px] uppercase font-black tracking-widest text-indigo-300">puntos</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
