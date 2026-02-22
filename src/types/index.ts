/**
 * Tipos centrales para ICFES-SRS
 */

export type CardState = 'new' | 'learning' | 'review' | 'relearning' | 'mastered';

export interface Card {
  id: string;
  word: string;
  translation: string;
  example?: string;
  definition?: string;
  category?: string;
  groups: string[];

  // SRS fields
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: number;
  lapses: number;
  streak: number;
  state: CardState;
  priority: number;

  createdAt: number;
  updatedAt: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: number;
  cardIds: string[];
}

export interface ImportLog {
  id: string;
  timestamp: number;
  importedCount: number;
  createdGroups: string[];
  cardsAdded: string[];
  cardsUpdated: string[];
  cardsSkipped: string[];
  canRevert: boolean;
  snapshot?: DatabaseSnapshot;
}

export interface DatabaseSnapshot {
  meta: DatabaseMeta;
  cards: Record<string, Card>;
  groups: Record<string, Group>;
  imports: Record<string, ImportLog>;
  settings: Settings;
  stats: Stats;
}

export interface DatabaseMeta {
  version: number;
  lastModified: number;
  schemaVersion: string;
  hasSeenTutorial?: boolean;
}

export interface Settings {
  newCardsPerDay: number;
  reviewCardsPerDay: number;
  learnSteps: number[];
  lapseSteps: number[];
  graduatingInterval: number;
  easyInterval: number;
  newInterval: number;
  leechThreshold: number;
  darkMode: boolean;
}

export interface Stats {
  totalStudied: number;
  totalCorrect: number;
  streakDays: number;
  lastStudyDate?: number;
  byGroup: Record<string, { studied: number; correct: number }>;
}

export const DEFAULT_SETTINGS: Settings = {
  newCardsPerDay: 20,
  reviewCardsPerDay: 200,
  learnSteps: [1, 10],
  lapseSteps: [10],
  graduatingInterval: 1,
  easyInterval: 4,
  newInterval: 1,
  leechThreshold: 8,
  darkMode: false,
};

export const STORAGE_KEY = 'icfes_srs_v1';
export const STORAGE_SIZE_WARNING_MB = 4;
