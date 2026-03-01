import { useEffect } from "react";
import {
  initializePushNotifications,
  registerBackgroundSyncTask,
  sendTaskAlert,
} from "@/lib/notifications";

/**
 * Hook to initialize push notifications and background sync
 * Call this in your root layout or app component
 */
export function useNotificationsSetup() {
  useEffect(() => {
    (async () => {
      try {
        // Initialize push notifications
        const notificationSetup = await initializePushNotifications();
        
        if (notificationSetup) {
          console.log("✅ Notifications initialized");
          
          // Register background sync task
          await registerBackgroundSyncTask();
          
          // Cleanup on unmount
          return () => {
            notificationSetup.unsubscribe();
          };
        }
      } catch (error) {
        console.error("Failed to setup notifications:", error);
      }
    })();
  }, []);
}

/**
 * Simulate task alerts for demo purposes
 */
export function useDemoTaskAlerts() {
  useEffect(() => {
    // Send a demo notification after 5 seconds
    const timer = setTimeout(() => {
      sendTaskAlert("TASK-001", "Ram Lal", 8.5);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
}
