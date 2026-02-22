/**
 * SRS SM-2++ para ICFES-SRS
 * Algoritmo de repetición espaciada mejorado
 */

import type { Card, Settings } from '../types';
import { loadDatabase, saveDatabase } from './storage';

export type ReviewQuality = 1 | 2 | 3 | 4 | 5; // Again=1, Hard=2, Good=3, Easy=4, Easy+=5

const INITIAL_EASE = 2.5;
const MIN_EASE = 1.3;
const EASE_BONUS = 0.15;

export function createNewCard(
  word: string,
  translation: string,
  options: Partial<Pick<Card, 'example' | 'definition' | 'category' | 'groups'>> = {}
): Card {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    word: word.trim(),
    translation: translation.trim(),
    example: options.example?.trim(),
    definition: options.definition?.trim(),
    category: options.category,
    groups: options.groups ?? [],

    easeFactor: INITIAL_EASE,
    interval: 0,
    repetitions: 0,
    dueDate: now,
    lapses: 0,
    streak: 0,
    state: 'new',
    priority: 1,

    createdAt: now,
    updatedAt: now,
  };
}

export function processReview(
  card: Card,
  quality: ReviewQuality,
  settings: Settings
): Card {
  const now = Date.now();
  const updated = { ...card, updatedAt: now };

  if (quality <= 2) {
    // Again / Hard - lapse o reintento
    if (card.state === 'new' || card.state === 'learning') {
      updated.state = 'learning';
      updated.interval = 0;
      updated.repetitions = 0;
      const stepMin = quality === 1
        ? settings.learnSteps[0]
        : (settings.learnSteps[1] ?? settings.learnSteps[0] * 2);
      updated.dueDate = now + stepMin * 60 * 1000;
    } else {
      updated.lapses += 1;
      updated.state = 'relearning';
      updated.easeFactor = Math.max(
        MIN_EASE,
        updated.easeFactor - 0.2
      );
      updated.interval = Math.max(1, Math.floor(updated.interval * 0.5));
      updated.repetitions = 0;
      updated.streak = 0;
      updated.dueDate = now + (settings.lapseSteps[0] ?? 10) * 60 * 1000;
    }
  } else {
    // Good / Easy / Easy+ - progreso
    if (card.state === 'new' || card.state === 'learning') {
      if (quality >= 4) {
        updated.state = 'review';
        const days = quality === 5 ? Math.max(settings.easyInterval, 7) : settings.easyInterval;
        updated.interval = days;
        updated.repetitions = 1;
        updated.dueDate = now + days * 24 * 60 * 60 * 1000;
      } else {
        updated.state = 'learning';
        updated.repetitions += 1;
        const stepIndex = Math.min(
          updated.repetitions - 1,
          settings.learnSteps.length - 1
        );
        updated.dueDate =
          now + (settings.learnSteps[stepIndex] ?? 10) * 60 * 1000;
      }
    } else {
      // review / relearning
      const bonus = quality >= 4 ? EASE_BONUS : 0;
      const qOffset = Math.min(5 - quality, 4);
      const adjustment = Math.max(-0.2, 0.1 - qOffset * (0.08 + qOffset * 0.02));
      updated.easeFactor = Math.max(
        MIN_EASE,
        updated.easeFactor + adjustment + bonus
      );
      updated.repetitions += 1;
      updated.streak += 1;
      updated.state = 'review';

      let interval: number;
      if (quality >= 4) {
        const mult = quality === 5 ? 1.5 : 1;
        interval = (updated.interval || settings.newInterval) * updated.easeFactor * mult;
      } else {
        interval = (updated.interval || 1) * 1.2;
      }
      updated.interval = Math.max(1, Math.round(interval));
      updated.dueDate =
        now + updated.interval * 24 * 60 * 60 * 1000;

      if (updated.interval >= 21) {
        updated.state = 'mastered';
      }
    }
  }

  return updated;
}

export function getDueCards(
  groupIds: string[] | null,
  limit?: number
): Card[] {
  const db = loadDatabase();
  const now = Date.now();
  const settings = db.settings;

  const leechThreshold = settings.leechThreshold ?? 8;
  let cards = Object.values(db.cards).filter(
    (c) => c.dueDate <= now && (c.lapses ?? 0) < leechThreshold
  );

  if (groupIds && groupIds.length > 0) {
    cards = cards.filter((c) =>
      c.groups.some((g) => groupIds.includes(g))
    );
  }

  const newCards = cards.filter((c) => c.state === 'new');
  const reviewCards = cards.filter((c) => c.state !== 'new');

  const newLimit = Math.min(
    settings.newCardsPerDay,
    newCards.length,
    limit ?? 999
  );
  const reviewLimit = Math.min(
    settings.reviewCardsPerDay,
    reviewCards.length,
    (limit ?? 999) - newLimit
  );

  const selected = [
    ...newCards.slice(0, newLimit),
    ...reviewCards.slice(0, reviewLimit),
  ].sort((a, b) => a.dueDate - b.dueDate);

  return selected;
}

export function getDueCount(groupIds: string[] | null): number {
  return getDueCards(groupIds).length;
}

export function saveCard(card: Card): void {
  const db = loadDatabase();
  db.cards[card.id] = card;
  saveDatabase(db);
}

export function updateStats(correct: boolean, groupIds: string[]): void {
  const db = loadDatabase();
  db.stats.totalStudied += 1;
  if (correct) db.stats.totalCorrect += 1;

  const today = new Date().setHours(0, 0, 0, 0);
  const last = db.stats.lastStudyDate;
  if (last) {
    const lastDay = new Date(last).setHours(0, 0, 0, 0);
    if (today - lastDay > 86400000) {
      db.stats.streakDays = last && today - lastDay === 86400000 ? db.stats.streakDays + 1 : 1;
    }
  } else {
    db.stats.streakDays = 1;
  }
  db.stats.lastStudyDate = Date.now();

  for (const gid of groupIds) {
    if (!db.stats.byGroup[gid]) {
      db.stats.byGroup[gid] = { studied: 0, correct: 0 };
    }
    db.stats.byGroup[gid].studied += 1;
    if (correct) db.stats.byGroup[gid].correct += 1;
  }
  saveDatabase(db);
}
