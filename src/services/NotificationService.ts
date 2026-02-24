export const NotificationService = {
    /**
     * Request permission for notifications.
     */
    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.log('Este navegador no soporta notificaciones de escritorio');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    /**
     * Show a notification immediately.
     */
    async showNotification(title: string, body: string, icon = '/icons/icon-192x192.png') {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) return;

        // Try using ServiceWorker registration if available (better for PWA)
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification(title, {
                body,
                icon,
                badge: '/icons/icon-192x192.png',
                vibrate: [200, 100, 200],
            } as any);
        } else {
            // Fallback to standard Notification
            new Notification(title, { body, icon });
        }
    },

    /**
     * Sets up a local check to remind the user to study if they haven't today.
     * This runs when the app starts.
     */
    scheduleDailyReminder(lastStudyDate?: number) {
        if (!lastStudyDate) return;

        const now = new Date();
        const last = new Date(lastStudyDate);

        // If today is NOT the same as last study date
        if (now.toDateString() !== last.toDateString()) {
            // Already should notify or remind
            console.log("Recordatorio: No has estudiado hoy.");
        }
    }
};
