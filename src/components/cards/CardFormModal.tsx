import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { createNewCard, saveCard } from '../../lib/srs';
import { getGroups, addCardToGroup, removeCardFromGroup } from '../../services/groupService';
import { loadDatabase, saveDatabase } from '../../lib/storage';
import { cn } from '../../lib/utils';

interface CardFormModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialGroupId?: string;
  editCard?: {
    id: string;
    word: string;
    translation: string;
    example?: string;
    definition?: string;
    category?: string;
    groups: string[];
  };
}

export function CardFormModal({
  onClose,
  onSuccess,
  initialGroupId,
  editCard,
}: CardFormModalProps) {
  const [word, setWord] = useState(editCard?.word ?? '');
  const [translation, setTranslation] = useState(editCard?.translation ?? '');
  const [example, setExample] = useState(editCard?.example ?? '');
  const [definition, setDefinition] = useState(editCard?.definition ?? '');
  const [category, setCategory] = useState(editCard?.category ?? '');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    editCard?.groups ?? (initialGroupId ? [initialGroupId] : [])
  );
  const [groups, setGroups] = useState<ReturnType<typeof getGroups>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGroups(getGroups());
  }, []);

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((g) => g !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!word.trim() || !translation.trim()) {
      setError('Palabra y traducción son obligatorios');
      return;
    }

    try {
      if (editCard) {
        const db = loadDatabase();
        const card = db.cards[editCard.id];
        if (!card) return;

        const currentGroups = new Set(card.groups);
        const newGroups = new Set(selectedGroupIds);

        for (const gid of currentGroups) {
          if (!newGroups.has(gid)) removeCardFromGroup(card.id, gid);
        }
        for (const gid of newGroups) {
          if (!currentGroups.has(gid)) addCardToGroup(card.id, gid);
        }

        const db2 = loadDatabase();
        const c = db2.cards[editCard.id];
        if (c) {
          c.groups = selectedGroupIds;
          c.word = word.trim();
          c.translation = translation.trim();
          c.example = example.trim() || undefined;
          c.definition = definition.trim() || undefined;
          c.category = category.trim() || undefined;
          c.updatedAt = Date.now();
          saveDatabase(db2);
        }
      } else {
        const card = createNewCard(word.trim(), translation.trim(), {
          example: example.trim() || undefined,
          definition: definition.trim() || undefined,
          category: category.trim() || undefined,
          groups: selectedGroupIds,
        });
        saveCard(card);
        for (const gid of selectedGroupIds) {
          addCardToGroup(card.id, gid);
        }
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <Card className="w-full max-w-lg max-h-[95vh] overflow-auto flex flex-col rounded-t-2xl sm:rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b shrink-0">
          <CardTitle>{editCard ? 'Editar tarjeta' : 'Nueva tarjeta'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Palabra (inglés) *</label>
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. however"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Traducción *</label>
              <Input
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="e.g. sin embargo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ejemplo (opcional)</label>
              <Input
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="e.g. However, she stayed."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Para qué sirve / Definición (opcional)</label>
              <Input
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                placeholder="e.g. Estar a cargo de algo o alguien"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoría (opcional)</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. connector"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Grupos</label>
              {groups.length === 0 ? (
                <p className="text-sm text-zinc-500">No hay grupos. Crea uno primero.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGroup(g.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        selectedGroupIds.includes(g.id)
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                      )}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {editCard ? 'Guardar' : 'Crear tarjeta'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
