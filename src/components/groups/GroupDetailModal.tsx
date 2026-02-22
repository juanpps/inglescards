import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, BookOpen, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getGroup, getGroupMastery, removeCardFromGroup, addCardToGroup, updateGroup, deleteGroup } from '../../services/groupService';
import { loadDatabase } from '../../lib/storage';
import { CardFormModal } from '../cards/CardFormModal';

interface GroupDetailModalProps {
  groupId: string;
  onClose: () => void;
  onGroupDeleted?: () => void;
}

export function GroupDetailModal({ groupId, onClose, onGroupDeleted }: GroupDetailModalProps) {
  const [, setRefreshKey] = useState(0);
  const group = getGroup(groupId);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState<{
    id: string;
    word: string;
    translation: string;
    example?: string;
    category?: string;
    groups: string[];
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddExisting, setShowAddExisting] = useState(false);
  const [editGroupName, setEditGroupName] = useState(group?.name ?? '');
  const [editGroupDesc, setEditGroupDesc] = useState(group?.description ?? '');

  useEffect(() => {
    if (group) {
      setEditGroupName(group.name);
      setEditGroupDesc(group.description ?? '');
    }
  }, [groupId, group?.name, group?.description]);

  const db = loadDatabase();
  const allCards = Object.values(db.cards);
  const groupCards = group
    ? group.cardIds
        .map((cid) => db.cards[cid])
        .filter(Boolean)
        .sort((a, b) => a.word.localeCompare(b.word))
    : [];
  const cardsNotInGroup = allCards.filter(
    (c) => !group?.cardIds.includes(c.id) && (!searchQuery ||
      c.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.translation.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 20);
  const mastery = group ? getGroupMastery(groupId) : { total: 0, mastered: 0, percent: 0 };

  if (!group) return null;

  const handleSaveGroup = () => {
    updateGroup(groupId, { name: editGroupName.trim(), description: editGroupDesc.trim() || undefined });
  };

  const handleRemoveFromGroup = (cardId: string) => {
    if (confirm('¿Quitar esta tarjeta del grupo?')) {
      removeCardFromGroup(cardId, groupId);
      setRefreshKey((k) => k + 1);
    }
  };

  const handleAddExisting = (cardId: string) => {
    addCardToGroup(cardId, groupId);
    setRefreshKey((k) => k + 1);
    setShowAddExisting(false);
    setSearchQuery('');
  };

  const handleDeleteGroup = () => {
    if (confirm('¿Eliminar este grupo? Las tarjetas no se borrarán, solo se quitarán del grupo.')) {
      deleteGroup(groupId);
      onClose();
      onGroupDeleted?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl">
        <CardHeader className="flex flex-row items-start justify-between border-b shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: `${group.color}20` }}
            >
              <FolderKanban className="w-5 h-5" style={{ color: group.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <Input
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                onBlur={handleSaveGroup}
                className="font-semibold border-0 p-0 h-auto focus:ring-0"
              />
              <Input
                value={editGroupDesc}
                onChange={(e) => setEditGroupDesc(e.target.value)}
                onBlur={handleSaveGroup}
                placeholder="Descripción"
                className="text-sm text-zinc-500 border-0 p-0 h-auto focus:ring-0 mt-0.5"
              />
              <p className="text-xs text-zinc-400 mt-1">
                {mastery.total} tarjetas • {mastery.percent}% dominio
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500 hover:text-rose-600"
              onClick={handleDeleteGroup}
            >
              Eliminar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              size="sm"
              onClick={() => { setEditingCard(null); setShowCardForm(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva tarjeta
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddExisting(!showAddExisting)}
            >
              <Search className="w-4 h-4 mr-2" />
              Añadir existente
            </Button>
            <Link to={`/estudiar?groups=${groupId}`}>
              <Button variant="secondary" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Estudiar
              </Button>
            </Link>
          </div>

          {showAddExisting && (
            <div className="mb-4 p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <Input
                placeholder="Buscar por palabra o traducción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
              />
              <div className="max-h-40 overflow-auto space-y-1">
                {cardsNotInGroup.length === 0 ? (
                  <p className="text-sm text-zinc-500">No hay tarjetas disponibles</p>
                ) : (
                  cardsNotInGroup.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <span className="text-sm">{c.word} → {c.translation}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleAddExisting(c.id)}>
                        Añadir
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Tarjetas del grupo ({groupCards.length})
            </h4>
            {groupCards.length === 0 ? (
              <p className="text-sm text-zinc-500">No hay tarjetas. Añade algunas arriba.</p>
            ) : (
              <div className="space-y-2">
                {groupCards.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-700"
                  >
                    <div>
                      <p className="font-medium">{c.word}</p>
                      <p className="text-sm text-zinc-500">{c.translation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingCard({
                            id: c.id,
                            word: c.word,
                            translation: c.translation,
                            example: c.example,
                            category: c.category,
                            groups: c.groups,
                          });
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-500 hover:text-rose-600"
                        onClick={() => handleRemoveFromGroup(c.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showCardForm && (
        <CardFormModal
          initialGroupId={groupId}
          onClose={() => setShowCardForm(false)}
          onSuccess={() => { setShowCardForm(false); setRefreshKey((k) => k + 1); }}
        />
      )}

      {editingCard && (
        <CardFormModal
          editCard={editingCard}
          onClose={() => setEditingCard(null)}
          onSuccess={() => { setEditingCard(null); setRefreshKey((k) => k + 1); }}
        />
      )}
    </div>
  );
}
