import { useState, useEffect, useCallback } from 'react';
import { Share2, Download, Trash2, Search, Tag, Loader2, PackageOpen, BookOpen, User2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchPacks, importPack, deletePack, type SharedPack } from '../services/ShareService';
import { useAuth } from '../contexts/AuthContext';
import { SharePackModal } from '../components/share/SharePackModal';

const POPULAR_TAGS = ['ICFES', 'verbos', 'gramática', 'vocabulario', 'conectores', 'phrasal'];

function PackCard({
    pack,
    onImport,
    onDelete,
    currentUserId,
}: {
    pack: SharedPack;
    onImport: (id: string) => Promise<void>;
    onDelete: (id: string) => void;
    currentUserId?: string;
}) {
    const [importing, setImporting] = useState(false);
    const [done, setDone] = useState(false);
    const isOwn = currentUserId === pack.authorId;

    const handleImport = async () => {
        setImporting(true);
        try {
            await onImport(pack.id);
            setDone(true);
        } finally {
            setImporting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card className="overflow-hidden border-none shadow-sm rounded-2xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all">
                <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-black text-zinc-900 dark:text-zinc-50 text-base leading-tight">{pack.name}</h3>
                            {pack.description && (
                                <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{pack.description}</p>
                            )}
                        </div>
                        {isOwn && (
                            <button
                                onClick={() => onDelete(pack.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-zinc-400 hover:text-rose-500 transition-colors shrink-0"
                                title="Eliminar pack"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Tags */}
                    {pack.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {pack.tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-wide">
                                    <Tag className="w-2.5 h-2.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Preview words */}
                    <div className="flex flex-wrap gap-1">
                        {pack.cards.slice(0, 5).map((c, i) => (
                            <span key={i} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-bold rounded-lg">
                                {c.word}
                            </span>
                        ))}
                        {pack.cardCount > 5 && (
                            <span className="px-2 py-0.5 text-zinc-400 text-[11px] font-bold">
                                +{pack.cardCount - 5} más
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-bold">
                            <span className="flex items-center gap-1">
                                <User2 className="w-3 h-3" />
                                {pack.authorName}
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {pack.cardCount} tarjetas
                            </span>
                            <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {pack.downloadCount}
                            </span>
                        </div>
                        <Button
                            onClick={handleImport}
                            disabled={importing || done}
                            className={`h-8 px-3 rounded-xl text-xs font-black ${done
                                ? 'bg-emerald-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                } border-none`}
                        >
                            {importing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : done ? (
                                '✓ Importado'
                            ) : (
                                <>
                                    <Download className="w-3.5 h-3.5 mr-1" />
                                    Importar
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function Compartir() {
    const { currentUser } = useAuth();
    const [packs, setPacks] = useState<SharedPack[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const loadPacks = useCallback(async () => {
        setLoading(true);
        const data = await fetchPacks({ tag: activeTag ?? undefined, limitCount: 30 });
        setPacks(data);
        setLoading(false);
    }, [activeTag]);

    useEffect(() => { loadPacks(); }, [loadPacks]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleImport = async (packId: string) => {
        try {
            const { importedCount } = await importPack(packId);
            showToast(`✓ ${importedCount} tarjetas importadas correctamente`);
        } catch (err: any) {
            showToast(`Error: ${err.message}`);
        }
    };

    const handleDelete = async (packId: string) => {
        if (!confirm('¿Eliminar este pack? Esta acción no se puede deshacer.')) return;
        try {
            await deletePack(packId);
            setPacks((ps) => ps.filter((p) => p.id !== packId));
            showToast('Pack eliminado.');
        } catch {
            showToast('No se pudo eliminar el pack.');
        }
    };

    const filtered = search
        ? packs.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()) ||
                p.tags.some((t) => t.includes(search.toLowerCase()))
        )
        : packs;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Packs de la Comunidad
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1 font-medium italic">
                        Descubre, importa y comparte conjuntos de tarjetas.
                    </p>
                </div>
                {currentUser && (
                    <Button
                        onClick={() => setShowModal(true)}
                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-5 font-bold border-none shadow-lg shadow-indigo-500/20"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartir pack
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, descripción o tag..."
                    className="w-full h-12 pl-11 pr-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 focus:border-indigo-500 rounded-2xl outline-none font-medium transition-all text-sm"
                />
            </div>

            {/* Tag chips */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all ${!activeTag
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'
                        }`}
                >
                    Todos
                </button>
                {POPULAR_TAGS.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={`px-3 py-1 rounded-full text-xs font-black transition-all ${activeTag === tag
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'
                            }`}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {/* Grid of packs */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-zinc-400">
                    <PackageOpen className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                    <p className="font-bold text-zinc-500">No hay packs aún</p>
                    <p className="text-sm mt-1">¡Sé el primero en compartir uno!</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    <AnimatePresence>
                        {filtered.map((pack) => (
                            <PackCard
                                key={pack.id}
                                pack={pack}
                                onImport={handleImport}
                                onDelete={handleDelete}
                                currentUserId={currentUser?.uid}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Share modal */}
            {showModal && currentUser && (
                <SharePackModal
                    onClose={() => setShowModal(false)}
                    onSuccess={(msg) => {
                        setShowModal(false);
                        showToast(msg);
                        loadPacks();
                    }}
                />
            )}

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold max-w-xs text-center"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
