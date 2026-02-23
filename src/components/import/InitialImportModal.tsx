import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { BookOpen, Sparkles, CheckCircle2, Loader2, Rocket } from 'lucide-react';
import { commitImport, normalizeImportRows } from '../../services/importService';
import { loadDatabase, saveDatabase } from '../../lib/storage';

interface InitialImportModalProps {
    onComplete: () => void;
}

export function InitialImportModal({ onComplete }: InitialImportModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleImport = async () => {
        setLoading(true);
        try {
            const response = await fetch('/seed-vocabulario-icfes.json');
            const data = await response.json();

            const rows = normalizeImportRows({
                rows: data,
                headers: data.length > 0 ? Object.keys(data[0]) : [],
                errors: []
            });
            commitImport(rows);

            const db = loadDatabase();
            db.settings.initialPackLoaded = true;
            saveDatabase(db);

            setSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 1500);
        } catch (error) {
            console.error('Error importing initial pack:', error);
            alert('Error al cargar el pack inicial. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="p-8 pb-10">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-indigo-600" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-2 -right-2"
                            >
                                <Sparkles className="w-8 h-8 text-amber-500 fill-amber-500" />
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-center space-y-3 mb-8">
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                            ¡Bienvenido a ICFES-SRS!
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                            Para empezar con el pie derecho, necesitamos cargar tu arsenal de vocabulario esencial.
                            Este paquete contiene las <span className="text-indigo-600 dark:text-indigo-400 font-bold">1200+ palabras más frecuentes</span> en las pruebas de inglés.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-start gap-4">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Contenido Optimizada</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Verbos, conectores y vocabulario técnico clave para la prueba.</p>
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-start gap-4">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center shrink-0">
                                <Rocket className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Listo para estudiar</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Las tarjetas se organizan automáticamente por categorías.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-500 text-white rounded-2xl py-4 text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    ¡Paquete cargado con éxito!
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    <Button
                                        disabled={loading}
                                        onClick={handleImport}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-7 text-lg font-black shadow-xl shadow-indigo-500/25 relative overflow-hidden group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                CARGAR PACK INICIAL
                                                <motion.div
                                                    className="absolute inset-0 bg-white/20"
                                                    initial={{ x: "-100%" }}
                                                    whileHover={{ x: "100%" }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        disabled={loading}
                                        onClick={() => navigate('/login')}
                                        className="w-full text-zinc-500 hover:text-indigo-600 font-bold py-4 rounded-xl"
                                    >
                                        ¿Ya tienes cuenta? Iniciar sesión
                                    </Button>
                                </div>
                            )}
                        </AnimatePresence>
                        <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-4 italic">
                            O sincroniza tus datos si ya eres usuario
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
