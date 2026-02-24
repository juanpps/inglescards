/**
 * Persistencia localStorage para ICFES-SRS
 * Clave única: icfes_srs_v1
 */

import type { Card, Group, ImportLog, Settings, Stats } from '../types';
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  STORAGE_SIZE_WARNING_MB,
} from '../types';

export interface Database {
  meta: {
    version: number;
    lastModified: number;
    schemaVersion: string;
    hasSeenTutorial?: boolean;
  };
  cards: Record<string, Card>;
  groups: Record<string, Group>;
  imports: Record<string, ImportLog>;
  settings: Settings;
  stats: Stats;
}

const DEFAULT_DATABASE: Database = {
  meta: {
    version: 1,
    lastModified: Date.now(),
    schemaVersion: '1.0',
  },
  cards: {},
  groups: {},
  imports: {},
  settings: DEFAULT_SETTINGS,
  stats: {
    totalStudied: 0,
    totalCorrect: 0,
    streakDays: 0,
    points: 0,
    masteredCount: 0,
    byGroup: {},
    unlockedAchievements: []
  },
};

let cachedDb: Database | null = null;

export function loadDatabase(): Database {
  if (cachedDb) return cachedDb;

  if (typeof window === 'undefined') return DEFAULT_DATABASE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedDb = { ...DEFAULT_DATABASE };
      return cachedDb;
    }
    const parsed = JSON.parse(raw) as Partial<Database>;
    cachedDb = {
      meta: { ...DEFAULT_DATABASE.meta, ...parsed.meta },
      cards: parsed.cards ?? {},
      groups: parsed.groups ?? {},
      imports: parsed.imports ?? {},
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      stats: {
        ...DEFAULT_DATABASE.stats,
        ...parsed.stats,
        points: parsed.stats?.points ?? 0,
        masteredCount: parsed.stats?.masteredCount ?? 0,
        byGroup: parsed.stats?.byGroup ?? {},
      },
    };
    return cachedDb;
  } catch {
    cachedDb = { ...DEFAULT_DATABASE };
    return cachedDb;
  }
}

import { auth } from './firebase';
import { CloudSyncService } from '../services/CloudSyncService';

let saveTimeout: NodeJS.Timeout | null = null;

export function saveDatabase(db: Database): void {
  cachedDb = db;
  if (typeof window === 'undefined') return;

  // Debounce the heavy disk write and Firebase sync
  if (saveTimeout) clearTimeout(saveTimeout);

  // Inform the UI immediately for responsiveness
  window.dispatchEvent(new CustomEvent('storage-update', { detail: db }));

  saveTimeout = setTimeout(() => {
    db.meta.lastModified = Date.now();
    const json = JSON.stringify(db);
    localStorage.setItem(STORAGE_KEY, json);
    checkStorageSize(json.length);

    // Background upload sync if user is logged in
    const user = auth.currentUser;
    if (user) {
      CloudSyncService.debouncedUpload(user);
    }
  }, 1000); // 1 second debounce for disk writes
}

export function clearDatabaseCache(): void {
  cachedDb = null;
}

/**
 * Force an immediate save of any pending changes.
 */
export function flushSave(): void {
  if (!saveTimeout || !cachedDb) return;
  clearTimeout(saveTimeout);
  saveTimeout = null;

  const db = cachedDb;
  db.meta.lastModified = Date.now();
  const json = JSON.stringify(db);
  localStorage.setItem(STORAGE_KEY, json);
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushSave);
}

export function checkStorageSize(byteLength: number): boolean {
  const mb = byteLength / (1024 * 1024);
  if (mb > STORAGE_SIZE_WARNING_MB) {
    if (typeof window !== 'undefined') {
      console.warn(
        `ICFES-SRS: Base de datos ~${mb.toFixed(1)}MB. Sugerimos migrar a IndexedDB.`
      );
    }
    return false;
  }
  return true;
}

export function getStorageSizeBytes(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? new Blob([raw]).size : 0;
}

export function setHasSeenTutorial(seen: boolean): void {
  const db = loadDatabase();
  db.meta.hasSeenTutorial = seen;
  saveDatabase(db);
}

export function getHasSeenTutorial(): boolean {
  return loadDatabase().meta.hasSeenTutorial === true;
}

export function exportFullBackup(): string {
  const db = loadDatabase();
  return JSON.stringify(db, null, 2);
}

export function exportGroupBackup(groupIds: string[]): string {
  const db = loadDatabase();
  const cards: Record<string, Card> = {};
  const groups: Record<string, Group> = {};
  for (const gid of groupIds) {
    const g = db.groups[gid];
    if (g) {
      groups[gid] = g;
      for (const cid of g.cardIds) {
        if (db.cards[cid]) cards[cid] = db.cards[cid];
      }
    }
  }
  return JSON.stringify(
    { meta: db.meta, cards, groups, exportDate: Date.now() },
    null,
    2
  );
}
