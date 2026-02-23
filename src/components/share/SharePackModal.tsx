import { useState } from 'react';
import { X, Tag, ChevronDown, Loader2, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { getGroups } from '../../services/groupService';
import { publishPack } from '../../services/ShareService';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const SUGGESTED_TAGS = ['ICFES', 'verbos', 'gramática', 'vocabulario', 'conectores', 'phrasal', 'adjetivos', 'tiempo'];

interface Props {
    groupId?: string;
    onClose: () => void;
    onSuccess: (message: string) => void;
}

export function SharePackModal({ groupId: preselectedGroupId, onClose, onSuccess }: Props) {
    const { currentUser } = useAuth();
    const groups = getGroups();

    const [groupId, setGroupId] = useState(preselectedGroupId ?? groups[0]?.id ?? '');
    const [name, setName] = useState(() => {
        if (preselectedGroupId) {
            return groups.find((g) => g.id === preselectedGroupId)?.name ?? '';
        }
        return '';
    });
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addTag = (tag: string) => {
        const t = tag.trim().toLowerCase();
        if (t && !tags.includes(t) && tags.length < 6) {
            setTags([...tags, t]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        if (!groupId) { setError('Selecciona un grupo.'); return; }
        if (!name.trim()) { setError('El nombre del pack es requerido.'); return; }

        setLoading(true);
        setError(null);
        try {
            await publishPack(currentUser, { name, description, tags, groupId });
            onSuccess(`✓ Pack "${name}" publicado correctamente`);
        } catch (err: any) {
            setError(err.message ?? 'Error al publicar el pack.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="font-black text-zinc-900 dark:text-zinc-50">Compartir Pack</h2>
                            <p className="text-xs text-zinc-400 font-medium">Publica un grupo para la comunidad</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Group selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Grupo a compartir</label>
                        <div className="relative">
                            <select
                                value={groupId}
                                onChange={(e) => {
                                    setGroupId(e.target.value);
                                    const g = groups.find((g) => g.id === e.target.value);
                                    if (g && !name) setName(g.name);
                                }}
                                className="w-full h-12 pl-4 pr-10 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer"
                            >
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Pack name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Nombre del pack</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={60}
                            placeholder="Ej: Conectores esenciales del ICFES"
                            className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-sm transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Descripción <span className="normal-case font-medium text-zinc-400">(opcional)</span></label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={200}
                            rows={2}
                            placeholder="¿Qué contiene este pack? ¿Para quién es útil?"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-sm transition-all resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Tags <span className="normal-case font-medium">(máx 6)</span></label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((t) => (
                                <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-full">
                                    #{t}
                                    <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 ml-0.5">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                                    placeholder="Escribe un tag..."
                                    maxLength={20}
                                    className="w-full h-10 pl-9 pr-3 bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-medium text-xs transition-all"
                                />
                            </div>
                            <Button type="button" onClick={() => addTag(tagInput)} variant="secondary" className="h-10 px-3 rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-700">
                                Agregar
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                                <button key={t} type="button" onClick={() => addTag(t)}
                                    className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                    +{t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-xl">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black border-none shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Share2 className="w-4 h-4 mr-2" />
                                Publicar Pack
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
