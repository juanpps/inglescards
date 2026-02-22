/**
 * Pipeline de importación avanzado
 * parse → normalize → map → validate → dedupe → preview → resolve → commit
 */

import type { Card, ImportLog } from '../types';
import type { ParsedRow, ParseResult } from '../lib/importWorker';
import { createNewCard } from '../lib/srs';
import {
  loadDatabase,
  saveDatabase,
  type Database,
} from '../lib/storage';
import { normalizeText } from '../lib/utils';
import { getOrCreateGroupByName } from './groupService';

export type ImportRowStatus = 'NEW' | 'DUP' | 'CONFLICT';

export interface ImportRow {
  id: string;
  raw: ParsedRow;
  status: ImportRowStatus;
  existingCard?: Card;
  normalizedKey: string;
}

const COLUMN_MAP: Record<string, string[]> = {
  word: ['word', 'palabra', 'term', 'front'],
  translation: ['translation', 'traduccion', 'meaning', 'back', 'def'],
  example: ['example', 'ejemplo', 'sentence', 'phrase'],
  definition: ['definition', 'definicion', 'desc', 'description', 'meaning_extra'],
  category: ['category', 'categoria', 'tag'],
  difficulty: ['difficulty', 'dificultad'],
  group: ['group', 'grupo', 'deck'],
  groups: ['groups', 'grupos', 'decks'],
  source: ['source', 'origen'],
};

function mapColumns(row: ParsedRow): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [canonical, aliases] of Object.entries(COLUMN_MAP)) {
    for (const alias of aliases) {
      const key = Object.keys(row).find(
        (k) => k.toLowerCase().trim() === alias.toLowerCase()
      );
      if (key && row[key]) {
        out[canonical] = String(row[key]).trim();
        break;
      }
    }
  }
  return out;
}

function getGroupNames(row: Record<string, string>): string[] {
  const g = row.group || row.groups;
  if (!g) return [];
  return g
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeImportRows(parseResult: ParseResult): ImportRow[] {
  const db = loadDatabase();
  const keyToCard = new Map<string, Card>();
  for (const c of Object.values(db.cards)) {
    const k = normalizeKey(c.word, c.translation);
    if (!keyToCard.has(k)) keyToCard.set(k, c);
  }

  const rows: ImportRow[] = [];
  for (const raw of parseResult.rows) {
    const mapped = mapColumns(raw);
    const word = mapped.word || raw.word || raw.palabra || '';
    const translation = mapped.translation || raw.translation || raw.traduccion || '';
    if (!word || !translation) continue;

    const normalizedKey = normalizeKey(word, translation);
    const existing = keyToCard.get(normalizedKey);

    let status: ImportRowStatus = 'NEW';
    if (existing) {
      const hasChanges =
        (mapped.example && mapped.example !== existing.example) ||
        (mapped.definition && mapped.definition !== existing.definition) ||
        (mapped.category && mapped.category !== existing.category) ||
        getGroupNames(mapped).some((g) => !existing.groups.includes(g));
      status = hasChanges ? 'CONFLICT' : 'DUP';
    }

    rows.push({
      id: crypto.randomUUID(),
      raw: { ...raw, ...mapped, word, translation },
      status,
      existingCard: existing,
      normalizedKey,
    });
  }
  return rows;
}

function normalizeKey(word: string, translation: string): string {
  return `${normalizeText(word)}::${normalizeText(translation)}`;
}

export function commitImport(
  rows: ImportRow[],
  conflictResolution: Record<string, 'keep' | 'overwrite' | 'merge'> = {}
): ImportLog {
  let db = loadDatabase();
  const snapshot = JSON.parse(JSON.stringify(db)) as Database;
  const createdGroups: string[] = [];
  const cardsAdded: string[] = [];
  const cardsUpdated: string[] = [];
  const cardsSkipped: string[] = [];

  for (const row of rows) {
    const mapped = mapColumns(row.raw);
    const word = mapped.word || row.raw.word || '';
    const translation = mapped.translation || row.raw.translation || '';
    const groupNames = getGroupNames(mapped);
    const groups: string[] = [];

    for (const name of groupNames) {
      const g = getOrCreateGroupByName(name);
      if (!db.groups[g.id]) {
        db.groups[g.id] = { ...g };
      }
      if (!groups.includes(g.id)) groups.push(g.id);
      if (!createdGroups.includes(g.id) && !snapshot.groups[g.id]) {
        createdGroups.push(g.id);
      }
    }

    if (row.status === 'DUP') {
      cardsSkipped.push(row.id);
      continue;
    }

    if (row.status === 'CONFLICT' && row.existingCard) {
      const resolution = conflictResolution[row.id] ?? 'keep';
      if (resolution === 'keep') {
        cardsSkipped.push(row.id);
        continue;
      }
      const card = row.existingCard;
      if (resolution === 'overwrite') {
        card.example = mapped.example || card.example;
        card.definition = mapped.definition || card.definition;
        card.category = mapped.category || card.category;
        card.groups = [...new Set([...card.groups, ...groups])];
        card.updatedAt = Date.now();
        db.cards[card.id] = card;
        cardsUpdated.push(card.id);
      } else if (resolution === 'merge') {
        card.example = mapped.example || card.example;
        card.definition = mapped.definition || card.definition;
        card.category = mapped.category || card.category;
        card.groups = [...new Set([...card.groups, ...groups])];
        card.updatedAt = Date.now();
        db.cards[card.id] = card;
        cardsUpdated.push(card.id);
      }
      continue;
    }

    const card = createNewCard(word, translation, {
      example: mapped.example,
      definition: mapped.definition,
      category: mapped.category,
      groups,
    });
    db.cards[card.id] = card;
    cardsAdded.push(card.id);

    for (const gid of groups) {
      const g = db.groups[gid];
      if (g && !g.cardIds.includes(card.id)) {
        g.cardIds.push(card.id);
      }
    }
  }

  const log: ImportLog = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    importedCount: cardsAdded.length + cardsUpdated.length,
    createdGroups,
    cardsAdded,
    cardsUpdated,
    cardsSkipped,
    canRevert: true,
    snapshot,
  };
  db.imports[log.id] = log;
  saveDatabase(db);
  return log;
}

export function revertImport(logId: string): boolean {
  const db = loadDatabase();
  const log = db.imports[logId];
  if (!log?.canRevert || !log.snapshot) return false;
  const restored = log.snapshot as Database;
  db.cards = restored.cards;
  db.groups = restored.groups;
  delete db.imports[logId];
  saveDatabase(db);
  return true;
}
