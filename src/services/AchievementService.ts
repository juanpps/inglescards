import { ACHIEVEMENTS } from '../types/achievements';
import { loadDatabase, saveDatabase } from '../lib/storage';

export const AchievementService = {
    /**
     * Checks all achievements and unlocks new ones if requirements are met.
     * Returns the list of newly unlocked achievements.
     */
    checkAndUnlock(): string[] {
        const db = loadDatabase();
        const unlocked = db.stats.unlockedAchievements || [];
        const newlyUnlocked: string[] = [];

        const allCards = Object.values(db.cards);

        for (const ach of ACHIEVEMENTS) {
            // Skip if already unlocked
            if (unlocked.includes(ach.id)) continue;

            // Check requirement
            try {
                if (ach.requirement(db.stats, allCards)) {
                    newlyUnlocked.push(ach.id);
                    unlocked.push(ach.id);
                }
            } catch (err) {
                console.error(`Error checking achievement ${ach.id}:`, err);
            }
        }

        if (newlyUnlocked.length > 0) {
            db.stats.unlockedAchievements = unlocked;
            saveDatabase(db);

            // Dispatch event for UI notification
            newlyUnlocked.forEach(id => {
                const achievement = ACHIEVEMENTS.find(a => a.id === id);
                if (achievement) {
                    window.dispatchEvent(new CustomEvent('achievement-unlocked', {
                        detail: achievement
                    }));
                }
            });
        }

        return newlyUnlocked;
    }
};
