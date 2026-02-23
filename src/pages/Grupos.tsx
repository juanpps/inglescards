import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, Settings2, Zap, ArrowRight, Share2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getGroups, getGroupMastery } from '../services/groupService';
import { GroupDetailModal } from '../components/groups/GroupDetailModal';
import { CreateGroupModal } from '../components/groups/CreateGroupModal';
import { SharePackModal } from '../components/share/SharePackModal';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Grupos() {
  const { currentUser } = useAuth();
  const [detailGroupId, setDetailGroupId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [shareGroupId, setShareGroupId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const groups = useMemo(() => getGroups(), [refreshKey]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Tus Grupos
          </h1>
          <p className="text-zinc-500 font-medium mt-2 max-w-md italic">
            Domina el vocabulario organizado por temas estratégicos para el examen.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateGroup(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-indigo-500/20 font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Grupo
        </Button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => {
          const mastery = getGroupMastery(group.id);
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className="overflow-hidden group transition-all duration-300 glass shadow-premium border-none rounded-[32px] hover:shadow-2xl hover:-translate-y-2"
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: group.color }}
                />
                <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${group.color}15` }}
                    >
                      <FolderKanban
                        className="w-7 h-7"
                        style={{ color: group.color }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight leading-tight">{group.name}</CardTitle>
                      {group.description && (
                        <p className="text-xs text-zinc-400 font-medium mt-1 line-clamp-1 italic">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm mb-6 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="font-black text-zinc-900 dark:text-zinc-100">{mastery.total}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Tarjetas</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex flex-col items-end">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {mastery.percent}%
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Dominio</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Link to={`/estudiar?groups=${group.id}&mode=intensive`} className="flex-1">
                        <Button
                          variant="primary"
                          className="w-full h-14 bg-amber-400 hover:bg-amber-500 text-zinc-900 font-black rounded-2xl border-none shadow-premium-sm relative overflow-hidden group/btn transition-all"
                        >
                          <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          Intensivo
                        </Button>
                      </Link>
                      <Link to={`/estudiar?groups=${group.id}`} className="flex-1">
                        <Button
                          variant="primary"
                          className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl border-none shadow-premium-sm group/study"
                        >
                          Estudiar
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/study:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        className="flex-1 h-12 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-none text-zinc-600 dark:text-zinc-300 font-bold rounded-xl"
                        onClick={() => setDetailGroupId(group.id)}
                      >
                        <Settings2 className="w-4 h-4 mr-2" />
                        Ajustes
                      </Button>
                      {currentUser && (
                        <Button
                          variant="ghost"
                          className="h-12 w-12 p-0 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 bg-zinc-50 dark:bg-zinc-800/50 text-indigo-500"
                          title="Compartir pack"
                          onClick={() => setShareGroupId(group.id)}
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                      )}
                      <Link to={`/nueva-tarjeta?group=${group.id}`}>
                        <Button variant="ghost" className="h-12 w-12 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-zinc-50 dark:bg-zinc-800/50" title="Añadir tarjeta">
                          <Plus className="w-5 h-5 text-zinc-500" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {groups.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-[40px] border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-transparent">
            <CardContent className="py-20 text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FolderKanban className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No hay grupos aún</h3>
              <p className="text-zinc-500 max-w-xs mx-auto mb-8">
                Crea tu primer grupo temático o importa el paquete de vocabulario inicial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setShowCreateGroup(true)} className="h-12 px-8 rounded-2xl font-black">
                  Crea tu primer grupo
                </Button>
                <Link to="/importar">
                  <Button variant="secondary" className="h-12 px-8 rounded-2xl font-bold bg-white dark:bg-zinc-800 border-none">
                    Importar tarjetas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {detailGroupId && (
        <GroupDetailModal
          groupId={detailGroupId}
          onClose={() => { setDetailGroupId(null); setRefreshKey((k) => k + 1); }}
          onGroupDeleted={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onSuccess={() => { setShowCreateGroup(false); setRefreshKey((k) => k + 1); }}
        />
      )}

      {shareGroupId && currentUser && (
        <SharePackModal
          groupId={shareGroupId}
          onClose={() => setShareGroupId(null)}
          onSuccess={(msg) => { setShareGroupId(null); showToast(msg); }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          {toast}
        </div>
      )}
    </div>
  );
}
