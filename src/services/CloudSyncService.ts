import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { loadDatabase, saveDatabase } from '../lib/storage';
import type { Database } from '../lib/storage';
import type { User } from 'firebase/auth';
import { publishMyStats } from './LeaderboardService';

let syncTimeout: NodeJS.Timeout | null = null;

export const CloudSyncService = {
    /**
     * Pushes the entire local database to Firestore for the given user.
     */
    async uploadSnapshot(user: User) {
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
    async syncFromCloud(user: User) {
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
