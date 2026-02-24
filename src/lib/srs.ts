/**
 * SRS SM-2++ para ICFES-SRS
 * Algoritmo de repetición espaciada mejorado
 */

import type { Card, Settings } from '../types';
import { loadDatabase, saveDatabase } from './storage';
import { AchievementService } from '../services/AchievementService';

export type ReviewQuality = 1 | 2 | 3 | 4 | 5;
// Swipe mapping: Left = 1 (Failure), Right = 5 (Success)
// Classic mapping: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy), 5 (Perfect)

const INITIAL_EASE = 2.5;
const MIN_EASE = 1.3;

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

  if (quality < 3) {
    // Failure or Hard (1-2)
    updated.lapses += (quality === 1 ? 1 : 0);
    updated.repetitions = 0;
    updated.streak = 0;
    updated.state = 'learning';
    updated.interval = 0;

    // Step index for Hard vs Again
    const stepIdx = quality === 1 ? 0 : 1;
    updated.dueDate = now + (settings.learnSteps[stepIdx] || settings.learnSteps[0] || 1) * 60 * 1000;

    if (card.state !== 'new' && card.state !== 'learning') {
      updated.easeFactor = Math.max(MIN_EASE, updated.easeFactor - (quality === 1 ? 0.2 : 0.15));
    }
  } else {
    // Success (3-5)
    if (card.state === 'new' || card.state === 'learning') {
      updated.repetitions += (quality === 5 ? 2 : 1); // Perfect leap

      if (updated.repetitions >= settings.learnSteps.length) {
        // Graduate to review
        updated.state = 'review';
        updated.interval = quality === 5 ? settings.easyInterval : settings.graduatingInterval;
        updated.dueDate = now + updated.interval * 24 * 60 * 60 * 1000;
      } else {
        // Stay in learning, move to next step
        updated.state = 'learning';
        updated.interval = 0;
        const stepIndex = Math.min(updated.repetitions, settings.learnSteps.length - 1);
        updated.dueDate = now + settings.learnSteps[stepIndex] * 60 * 1000;
      }
    } else {
      // review / relearning / mastered
      const easeBonus = quality === 5 ? 0.2 : quality === 4 ? 0.1 : 0;
      updated.easeFactor = Math.max(MIN_EASE, updated.easeFactor + easeBonus);
      updated.repetitions += 1;
      updated.streak += 1;
      updated.state = 'review';

      // Interval growth
      let multiplier = updated.easeFactor;
      if (quality === 5) multiplier *= 1.3; // Extra leap for Perfect
      if (quality === 3) multiplier *= 0.8; // Safer growth for Good

      const interval = (updated.interval || 1) * multiplier;
      updated.interval = Math.max(1, Math.round(interval));
      updated.dueDate = now + updated.interval * 24 * 60 * 60 * 1000;

      if (updated.interval >= (settings.masteredInterval ?? 14)) {
        updated.state = 'mastered';
      }
    }
  }

  return updated;
}

export function getDueCards(
  groupIds: string[] | null,
  limit?: number,
  ignoreLimits = false,
  intensive = false
): Card[] {
  const db = loadDatabase();
  const now = Date.now();
  const settings = db.settings;

  const leechThreshold = settings.leechThreshold ?? 8;

  // Base filtering: skip leeches
  let allCards = Object.values(db.cards).filter(
    (c) => (c.lapses ?? 0) < leechThreshold
  );

  // Group filtering
  if (groupIds && groupIds.length > 0) {
    allCards = allCards.filter((c) =>
      c.groups.some((g) => groupIds.includes(g))
    );
  }

  // Due logic
  let cards: Card[];
  if (intensive) {
    // In intensive mode, we take all cards in the groups
    // but we sort them to show the most "urgent" ones first
    cards = allCards.sort((a, b) => {
      // 1. Truly due cards first
      const aDue = a.dueDate <= now;
      const bDue = b.dueDate <= now;
      if (aDue !== bDue) return aDue ? -1 : 1;

      // 2. Learning state before Review/Mastered
      const score = (s: string) => (s === 'new' ? 0 : s === 'learning' || s === 'relearning' ? 1 : 2);
      if (score(a.state) !== score(b.state)) return score(a.state) - score(b.state);

      // 3. Oldest due date first
      return a.dueDate - b.dueDate;
    });
  } else {
    cards = allCards.filter((c) => c.dueDate <= now);
  }

  const newCards = cards.filter((c) => c.state === 'new');
  const reviewCards = cards.filter((c) => c.state !== 'new');

  const newLimit = (ignoreLimits || intensive)
    ? newCards.length
    : Math.min(settings.newCardsPerDay, newCards.length, limit ?? 999);

  const reviewLimit = (ignoreLimits || intensive)
    ? reviewCards.length
    : Math.min(
      settings.reviewCardsPerDay,
      reviewCards.length,
      (limit ?? 999) - newLimit
    );

  const selected = [
    ...newCards.slice(0, newLimit),
    ...reviewCards.slice(0, reviewLimit),
  ];

  // If not already sorted by intensive logic, sort by dueDate
  if (!intensive) {
    selected.sort((a, b) => a.dueDate - b.dueDate);
  }

  return selected;
}

/**
 * Fast due-card count — O(n) filter, no sorting.
 * Use this for badge counts; use getDueCards only when you need the actual cards.
 */
export function getDueCount(groupIds: string[] | null): number {
  const db = loadDatabase();
  const now = Date.now();
  const leechThreshold = db.settings.leechThreshold ?? 8;
  let count = 0;
  for (const c of Object.values(db.cards)) {
    if ((c.lapses ?? 0) >= leechThreshold) continue;
    if (groupIds && groupIds.length > 0 && !c.groups.some(g => groupIds.includes(g))) continue;
    if (c.dueDate <= now) count++;
  }
  return count;
}

export function saveCard(card: Card): void {
  const db = loadDatabase();
  db.cards[card.id] = card;
  saveDatabase(db);
}

/**
 * Combines saveCard + updateStats in a SINGLE saveDatabase call.
 * Always prefer this inside the study loop to avoid two localStorage writes per review.
 */
export function saveCardAndStats(card: Card, correct: boolean): void {
  const db = loadDatabase();
  db.cards[card.id] = card;
  _applyStatsUpdate(db, correct, card.groups);
  saveDatabase(db);
}

/** @internal — mutates db.stats in-place; callers are responsible for saveDatabase */
function _applyStatsUpdate(db: import('./storage').Database, correct: boolean, groupIds: string[]): void {
  db.stats.totalStudied += 1;

  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  const weekKey = monday.toISOString().slice(0, 10);
  const monthKey = now.toISOString().slice(0, 7);

  if (!db.stats.weeklyPoints) db.stats.weeklyPoints = {};
  if (!db.stats.monthlyPoints) db.stats.monthlyPoints = {};

  function awardPoints(amount: number) {
    db.stats.points += amount;
    db.stats.weeklyPoints![weekKey] = (db.stats.weeklyPoints![weekKey] ?? 0) + amount;
    db.stats.monthlyPoints![monthKey] = (db.stats.monthlyPoints![monthKey] ?? 0) + amount;
  }

  if (correct) {
    db.stats.totalCorrect += 1;
    awardPoints(10);
  }

  // masteredCount: only scan once using the current db.cards (already updated by saveCardAndStats)
  db.stats.masteredCount = Object.values(db.cards).filter(c => c.state === 'mastered').length;

  const today = new Date().setHours(0, 0, 0, 0);
  const last = db.stats.lastStudyDate;
  if (last) {
    const lastDay = new Date(last).setHours(0, 0, 0, 0);
    const diff = today - lastDay;
    if (diff === 86400000) {
      db.stats.streakDays += 1;
      awardPoints(50);
    } else if (diff > 86400000) {
      db.stats.streakDays = 1;
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

  // Check for achievements
  AchievementService.checkAndUnlock();
}

/** Public API — loads + saves. Use saveCardAndStats() in the study loop instead. */
export function updateStats(correct: boolean, groupIds: string[]): void {
  const db = loadDatabase();
  _applyStatsUpdate(db, correct, groupIds);
  saveDatabase(db);
}
