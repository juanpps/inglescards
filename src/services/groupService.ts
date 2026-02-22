/**
 * Servicio de grupos para ICFES-SRS
 */

import type { Group } from '../types';
import { loadDatabase, saveDatabase } from '../lib/storage';

const DEFAULT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6',
];

export function createGroup(
  name: string,
  options: Partial<Pick<Group, 'description' | 'color' | 'icon'>> = {}
): Group {
  const db = loadDatabase();
  const id = crypto.randomUUID();
  const color = options.color ?? DEFAULT_COLORS[Object.keys(db.groups).length % DEFAULT_COLORS.length];
  const group: Group = {
    id,
    name: name.trim(),
    description: options.description?.trim(),
    color,
    icon: options.icon ?? 'folder',
    createdAt: Date.now(),
    cardIds: [],
  };
  db.groups[id] = group;
  saveDatabase(db);
  return group;
}

export function getGroups(): Group[] {
  const db = loadDatabase();
  return Object.values(db.groups).sort((a, b) => a.createdAt - b.createdAt);
}

export function getGroup(id: string): Group | null {
  const db = loadDatabase();
  return db.groups[id] ?? null;
}

export function updateGroup(
  id: string,
  updates: Partial<Pick<Group, 'name' | 'description' | 'color' | 'icon'>>
): Group | null {
  const db = loadDatabase();
  const g = db.groups[id];
  if (!g) return null;
  Object.assign(g, updates);
  saveDatabase(db);
  return g;
}

export function deleteGroup(id: string): void {
  const db = loadDatabase();
  const g = db.groups[id];
  if (!g) return;
  for (const cid of g.cardIds) {
    const card = db.cards[cid];
    if (card) {
      card.groups = card.groups.filter((gid) => gid !== id);
      if (card.groups.length === 0) {
        delete db.cards[cid];
      } else {
        db.cards[cid] = card;
      }
    }
  }
  delete db.groups[id];
  saveDatabase(db);
}

export function addCardToGroup(cardId: string, groupId: string): boolean {
  const db = loadDatabase();
  const card = db.cards[cardId];
  const group = db.groups[groupId];
  if (!card || !group) return false;
  if (card.groups.includes(groupId)) return true;
  card.groups = [...card.groups, groupId];
  card.updatedAt = Date.now();
  if (!group.cardIds.includes(cardId)) {
    group.cardIds = [...group.cardIds, cardId];
  }
  db.cards[cardId] = card;
  db.groups[groupId] = group;
  saveDatabase(db);
  return true;
}

export function removeCardFromGroup(cardId: string, groupId: string): boolean {
  const db = loadDatabase();
  const card = db.cards[cardId];
  const group = db.groups[groupId];
  if (!card || !group) return false;
  card.groups = card.groups.filter((g) => g !== groupId);
  card.updatedAt = Date.now();
  group.cardIds = group.cardIds.filter((c) => c !== cardId);
  db.cards[cardId] = card;
  db.groups[groupId] = group;
  saveDatabase(db);
  return true;
}

export function getOrCreateGroupByName(name: string): Group {
  const db = loadDatabase();
  const normalized = name.trim().toLowerCase();
  const existing = Object.values(db.groups).find(
    (g) => g.name.trim().toLowerCase() === normalized
  );
  if (existing) return existing;
  return createGroup(name);
}

export function getGroupMastery(groupId: string): {
  total: number;
  mastered: number;
  percent: number;
} {
  const db = loadDatabase();
  const group = db.groups[groupId];
  if (!group) return { total: 0, mastered: 0, percent: 0 };
  let mastered = 0;
  for (const cid of group.cardIds) {
    const c = db.cards[cid];
    if (c?.state === 'mastered') mastered++;
  }
  const total = group.cardIds.length;
  return {
    total,
    mastered,
    percent: total > 0 ? Math.round((mastered / total) * 100) : 0,
  };
}
