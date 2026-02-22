import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, BookOpen, Plus, Settings2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getGroups, getGroupMastery } from '../services/groupService';
import { GroupDetailModal } from '../components/groups/GroupDetailModal';
import { CreateGroupModal } from '../components/groups/CreateGroupModal';

export function Grupos() {
  const [detailGroupId, setDetailGroupId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const groups = useMemo(() => getGroups(), [refreshKey]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Grupos
          </h1>
          <p className="text-zinc-500 mt-1">
            Organiza tus tarjetas en grupos personalizados
          </p>
        </div>
        <Button onClick={() => setShowCreateGroup(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Crear grupo
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => {
          const mastery = getGroupMastery(group.id);
          return (
            <Card
              key={group.id}
              className="overflow-hidden transition-all duration-300 glass shadow-premium border-none rounded-3xl hover:-translate-y-1"
            >
              <div
                className="h-2"
                style={{ backgroundColor: group.color }}
              />
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-2xl shadow-sm"
                    style={{ backgroundColor: `${group.color}15` }}
                  >
                    <FolderKanban
                      className="w-6 h-6"
                      style={{ color: group.color }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                    {group.description && (
                      <p className="text-sm text-zinc-500 mt-0.5 line-clamp-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-5">
                  <span className="text-zinc-500 font-medium">{mastery.total} tarjetas</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {mastery.percent}%
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-tighter text-zinc-400">Dominio</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Link to={`/estudiar?groups=${group.id}`}>
                    <Button variant="primary" size="lg" className="w-full h-12 bg-indigo-600 text-white font-bold border-none shadow-md">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Estudiar
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 h-11 bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-600 dark:text-zinc-300"
                      onClick={() => setDetailGroupId(group.id)}
                    >
                      <Settings2 className="w-4 h-4 mr-2" />
                      Gestionar
                    </Button>
                    <Link to={`/nueva-tarjeta?group=${group.id}`}>
                      <Button variant="ghost" size="sm" className="h-11 w-11 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Añadir tarjeta">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {groups.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600" />
            <p className="mt-4 text-zinc-500">
              No hay grupos. Crea uno o importa tarjetas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button onClick={() => setShowCreateGroup(true)}>
                Crear grupo
              </Button>
              <Link to="/importar">
                <Button variant="secondary">Importar tarjetas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
