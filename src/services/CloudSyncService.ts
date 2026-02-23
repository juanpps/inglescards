import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { loadDatabase, saveDatabase } from '../lib/storage';
import type { Database } from '../lib/storage';
import type { User } from 'firebase/auth';
import { publishMyStats } from './LeaderboardService';

let syncTimeout: NodeJS.Timeout | null = null;
let lastManualSyncTime = 0;
const MANUAL_SYNC_COOLDOWN = 30000; // 30 seconds

export const CloudSyncService = {
    /** Check if a manual sync is allowed based on cooldown */
    canSync(): { allowed: boolean; remaining: number } {
        const now = Date.now();
        const elapsed = now - lastManualSyncTime;
        return {
            allowed: elapsed >= MANUAL_SYNC_COOLDOWN,
            remaining: Math.max(0, Math.ceil((MANUAL_SYNC_COOLDOWN - elapsed) / 1000))
        };
    },

    /**
     * Pushes the entire local database to Firestore for the given user.
     * @param isManual If true, updates the cooldown timer.
     */
    async uploadSnapshot(user: User, isManual = false) {
        if (isManual) {
            const { allowed } = this.canSync();
            if (!allowed) throw new Error('Debes esperar para sincronizar de nuevo.');
            lastManualSyncTime = Date.now();
        }
        const localDb = loadDatabase();
        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...localDb,
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email,
                lastSynced: Date.now()
            });
            // Update public leaderboard (fire & forget)
            publishMyStats(user).catch(() => { });
        } catch (error) {
            console.error('Failed to upload snapshot:', error);
        }
    },

    /**
     * Debounced version of uploadSnapshot to prevent excessive writes.
     * Useful for frequent updates like after every card review.
     */
    debouncedUpload(user: User, delay = 5000) {
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
            this.uploadSnapshot(user);
        }, delay);
    },

    /**
     * Pulls data from Firestore and merges it with local data if necessary.
     */
    async syncFromCloud(user: User, isManual = false) {
        if (isManual) {
            const { allowed } = this.canSync();
            if (!allowed) throw new Error('Debes esperar para sincronizar de nuevo.');
            lastManualSyncTime = Date.now();
        }
        const docRef = doc(db, 'users', user.uid);
        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const cloudDb = docSnap.data() as Database & { lastSynced: number };
                const localDb = loadDatabase();

                if (cloudDb.meta.lastModified > localDb.meta.lastModified) {
                    saveDatabase(cloudDb);
                    return true; // Updated
                }
            }
        } catch (error) {
            console.error('Failed to sync from cloud:', error);
        }
        return false;
    },
};
