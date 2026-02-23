/**
 * LeaderboardService — manages the public leaderboard collection in Firestore.
 *
 * Firestore schema: leaderboard/{uid}
 * {
 *   displayName, photoURL, points, streakDays, masteredCount,
 *   weeklyPoints, monthlyPoints, updatedAt
 * }
 */

import {
    collection,
    doc,
    getDocs,
    query,
    orderBy,
    limit,
    setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { loadDatabase } from '../lib/storage';

export type LeaderboardFilter = 'all' | 'weekly' | 'monthly';

export interface LeaderboardEntry {
    uid: string;
    displayName: string;
    photoURL: string | null;
    points: number;
    streakDays: number;
    masteredCount: number;
    weeklyPoints: number;
    monthlyPoints: number;
    updatedAt: number;
}

const LEADERBOARD_COL = 'leaderboard';

/** Get the monday-anchored week number for weekly scoring */
function getWeekKey(): string {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    return monday.toISOString().slice(0, 10); // e.g. "2026-02-17"
}

/** Get YYYY-MM for monthly scoring */
function getMonthKey(): string {
    return new Date().toISOString().slice(0, 7); // e.g. "2026-02"
}

// --- Smart Throttling for Writing ---
const PUBLISH_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
const POINTS_THRESHOLD = 50; // Minimum 50 pts change to force update early
let lastPublishedAt = 0;
let lastPublishedPoints = -1;

/**
 * Publish the current user's stats to the public leaderboard.
 * Throttled to avoid saturating Firestore during intense study sessions.
 */
export async function publishMyStats(user: User): Promise<void> {
    const localDb = loadDatabase();
    const stats = localDb.stats;
    const currentPoints = stats.points ?? 0;
    const now = Date.now();

    // Skip if last publish was very recent AND points haven't changed much
    if (
        lastPublishedPoints !== -1 &&
        now - lastPublishedAt < PUBLISH_THROTTLE_MS &&
        Math.abs(currentPoints - lastPublishedPoints) < POINTS_THRESHOLD
    ) {
        return;
    }

    try {
        await setDoc(doc(db, LEADERBOARD_COL, user.uid), {
            displayName: user.displayName ?? user.email ?? 'Estudiante',
            photoURL: user.photoURL ?? null,
            points: currentPoints,
            streakDays: stats.streakDays ?? 0,
            masteredCount: stats.masteredCount ?? 0,
            weeklyPoints: stats.weeklyPoints?.[getWeekKey()] ?? 0,
            monthlyPoints: stats.monthlyPoints?.[getMonthKey()] ?? 0,
            updatedAt: now,
        });
        lastPublishedAt = now;
        lastPublishedPoints = currentPoints;
    } catch (err) {
        console.error('[LeaderboardService] publishMyStats error', err);
    }
}

// --- Caching for Reading ---
interface LeaderboardCache {
    data: LeaderboardEntry[];
    timestamp: number;
}
const fetchCache: Record<string, LeaderboardCache> = {};
const CACHE_TTL = 30 * 1000; // 30 seconds

/** Fetch top users from the leaderboard sorted by the given filter */
export async function fetchLeaderboard(
    filter: LeaderboardFilter = 'all',
    count = 20
): Promise<LeaderboardEntry[]> {
    const cacheKey = `${filter}_${count}`;
    const now = Date.now();

    if (fetchCache[cacheKey] && now - fetchCache[cacheKey].timestamp < CACHE_TTL) {
        return fetchCache[cacheKey].data;
    }

    const orderField =
        filter === 'weekly'
            ? 'weeklyPoints'
            : filter === 'monthly'
                ? 'monthlyPoints'
                : 'points';

    const q = query(
        collection(db, LEADERBOARD_COL),
        orderBy(orderField, 'desc'),
        limit(count)
    );

    try {
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
            uid: d.id,
            ...(d.data() as Omit<LeaderboardEntry, 'uid'>),
        }));

        // Update cache
        fetchCache[cacheKey] = { data, timestamp: now };
        return data;
    } catch (err) {
        console.error('[LeaderboardService] fetchLeaderboard error', err);
        return [];
    }
}

/** Utility to clear cache (e.g. for forced refreshes) */
export function clearLeaderboardCache() {
    for (const key in fetchCache) delete fetchCache[key];
}

/** Map points → tier */
export function getPointsTier(points: number): {
    label: string;
    color: string;
    emoji: string;
} {
    if (points >= 5000) return { label: 'Diamante', color: '#67e8f9', emoji: '💎' };
    if (points >= 2000) return { label: 'Oro', color: '#fbbf24', emoji: '🥇' };
    if (points >= 500) return { label: 'Plata', color: '#94a3b8', emoji: '🥈' };
    return { label: 'Bronce', color: '#a16207', emoji: '🥉' };
}
