import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LogOut, Cloud, RefreshCw, Edit2, Check, X,
    Flame, Star, BookCheck, Trophy, Target, BarChart3,
    Share2, Lock,
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { loadDatabase } from '../lib/storage';
import { CloudSyncService } from '../services/CloudSyncService';
import { getPointsTier } from '../services/LeaderboardService';
import { ACHIEVEMENTS } from '../types/achievements';
import { auth } from '../lib/firebase';

function StatPill({
    icon: Icon,
    value,
    label,
    color,
}: {
    icon: React.ElementType;
    value: string | number;
    label: string;
    color: string;
}) {
    return (
        <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex-1 min-w-0">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className={`text-xl font-black tracking-tight ${color}`}>{value}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
        </div>
    );
}

export function Perfil() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const db = loadDatabase();
    const stats = useMemo(() => {
        const s = db.stats;
        const accuracy = s.totalStudied > 0
            ? Math.round((s.totalCorrect / s.totalStudied) * 100)
            : 0;
        return {
            points: s.points ?? 0,
            streak: s.streakDays ?? 0,
            mastered: s.masteredCount ?? 0,
            accuracy,
            totalStudied: s.totalStudied ?? 0,
        };
    }, []);

    const tier = getPointsTier(stats.points);

    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(currentUser?.displayName ?? '');
    const [savingName, setSavingName] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
    const [cooldown, setCooldown] = useState(0);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveName = async () => {
        if (!currentUser || !nameInput.trim()) return;
        setSavingName(true);
        try {
            await updateProfile(auth.currentUser!, { displayName: nameInput.trim() });
            if (currentUser) await CloudSyncService.uploadSnapshot(currentUser);
            showToast('✓ Nombre actualizado');
        } catch {
            showToast('Error al actualizar el nombre');
        } finally {
            setSavingName(false);
            setEditingName(false);
        }
    };

    const handleSync = async () => {
        if (!currentUser) return;
        setSyncStatus('syncing');
        try {
            await CloudSyncService.uploadSnapshot(currentUser, true);
            setSyncStatus('done');
            showToast('✓ Datos sincronizados');
        } catch (err: any) {
            setSyncStatus('error');
            const { remaining } = CloudSyncService.canSync();
            if (remaining > 0) {
                setCooldown(remaining);
                showToast(`Espera ${remaining}s para sincronizar`);
                setTimeout(() => setCooldown(0), remaining * 1000);
            } else {
                showToast(err.message || 'Error al sincronizar');
            }
        }
        setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Progress bar for tier
    const tierThresholds = [0, 500, 2000, 5000];
    const tierNames = ['Bronce', 'Plata', 'Oro', 'Diamante'];
    const currentTierIdx = tierNames.findIndex(t => t === tier.label);
    const nextThreshold = tierThresholds[currentTierIdx + 1];
    const prevThreshold = tierThresholds[currentTierIdx] ?? 0;
    const tierProgress = nextThreshold
        ? Math.min(100, Math.round(((stats.points - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
        : 100;

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-16">
            {/* Hero Card */}
            <Card className="overflow-hidden border-none rounded-[32px] shadow-premium">
                {/* Gradient banner */}
                <div className="h-28 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 relative">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }} />
                </div>

                <CardContent className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="flex items-end justify-between -mt-10 mb-4">
                        <div className="relative">
                            {currentUser?.photoURL ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt="avatar"
                                    className="w-20 h-20 rounded-[20px] border-4 border-white dark:border-zinc-900 shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-[20px] border-4 border-white dark:border-zinc-900 shadow-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black">
                                    {(currentUser?.displayName ?? currentUser?.email ?? 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                            {/* Tier badge */}
                            <span
                                title={tier.label}
                                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-white dark:border-zinc-900 shadow"
                                style={{ background: tier.color + '30' }}
                            >
                                {tier.emoji}
                            </span>
                        </div>

                        {currentUser ? (
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="h-9 px-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold text-sm border-none"
                            >
                                <LogOut className="w-4 h-4 mr-1.5" />
                                Salir
                            </Button>
                        ) : (
                            <Link to="/login">
                                <Button className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm border-none">
                                    Iniciar sesión
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Name + email */}
                    <div className="space-y-1">
                        {editingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                                    maxLength={40}
                                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-1.5 text-lg font-black outline-none focus:ring-2 ring-indigo-500 transition-all"
                                />
                                <button onClick={handleSaveName} disabled={savingName} className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingName(false)} className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    {currentUser?.displayName ?? 'Estudiante Anónimo'}
                                </h1>
                                {currentUser && (
                                    <button
                                        onClick={() => setEditingName(true)}
                                        className="p-1 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                        title="Editar nombre"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <p className="text-zinc-400 text-sm font-medium">{currentUser?.email ?? 'Sin cuenta'}</p>
                    </div>

                    {/* Tier progress */}
                    <div className="mt-5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span style={{ color: tier.color }}>{tier.emoji} {tier.label}</span>
                            {nextThreshold && (
                                <span className="text-zinc-400">
                                    {(nextThreshold - stats.points).toLocaleString()} pts para {tierNames[currentTierIdx + 1]}
                                </span>
                            )}
                        </div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${tierProgress}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(to right, ${tier.color}, ${tier.color}aa)` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Tu Progreso</h2>
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    <StatPill icon={Star} value={stats.points.toLocaleString()} label="Puntos" color="text-amber-500" />
                    <StatPill icon={Flame} value={`${stats.streak}d`} label="Racha" color="text-orange-500" />
                    <StatPill icon={BookCheck} value={stats.mastered} label="Dominadas" color="text-emerald-500" />
                    <StatPill icon={Target} value={`${stats.accuracy}%`} label="Precisión" color="text-indigo-500" />
                </div>
                <div className="flex gap-3">
                    <StatPill icon={BarChart3} value={stats.totalStudied.toLocaleString()} label="Repasos" color="text-violet-500" />
                    <StatPill icon={Trophy} value={(db.stats.unlockedAchievements || []).length} label="Logros" color="text-amber-500" />
                </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Logros Desbloqueados</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = (db.stats.unlockedAchievements || []).includes(ach.id);
                        return (
                            <Card
                                key={ach.id}
                                className={`border-none rounded-2xl shadow-sm overflow-hidden transition-all ${isUnlocked ? 'bg-white dark:bg-zinc-900 border-2 border-amber-400' : 'bg-zinc-100 dark:bg-zinc-800 opacity-60 grayscale'
                                    }`}
                            >
                                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                    <div className="text-3xl mb-1">{ach.icon}</div>
                                    <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-50 leading-tight">{ach.title}</h3>
                                    <p className="text-[9px] font-bold text-zinc-400 leading-tight">{ach.description}</p>
                                    {isUnlocked && (
                                        <div className="absolute top-1 right-1">
                                            <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Accesos Rápidos</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/ranking">
                        <Card className="border-none rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-zinc-900 dark:text-zinc-50">Ranking</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Global</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/compartir">
                        <Card className="border-none rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <Share2 className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-zinc-900 dark:text-zinc-50">Comunidad</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Packs</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Sync */}
            {currentUser && (
                <div className="space-y-3">
                    <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Sincronización</h2>
                    <Card className="border-none rounded-2xl shadow-sm overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                    <Cloud className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-zinc-900 dark:text-zinc-50">Copia en la Nube</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Firestore activo</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSync}
                                disabled={syncStatus === 'syncing' || cooldown > 0}
                                className={`h-10 px-4 rounded-xl font-bold text-sm border-none ${syncStatus === 'done'
                                    ? 'bg-emerald-500 text-white'
                                    : cooldown > 0
                                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                            >
                                <RefreshCw className={`w-4 h-4 mr-1.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                                {syncStatus === 'syncing' ? 'Subiendo...' : cooldown > 0 ? `Esperar ${cooldown}s` : syncStatus === 'done' ? 'Listo' : 'Sincronizar'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Not logged in note */}
            {!currentUser && (
                <Card className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-none bg-transparent">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div>
                            <p className="font-black text-zinc-700 dark:text-zinc-300">Inicia sesión para competir</p>
                            <p className="text-sm text-zinc-400 mt-1">Tu progreso aparecerá en el ranking global y podrás sincronizar tus tarjetas.</p>
                        </div>
                        <Link to="/login">
                            <Button className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-6 border-none">
                                Iniciar Sesión
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Toast */}
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold max-w-xs text-center"
                >
                    {toast}
                </motion.div>
            )}
        </div>
    );
}
