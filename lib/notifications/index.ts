import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

/**
 * Push Notifications Service
 * Handles task alerts and delivery reminders
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Initialize push notifications
 */
export async function initializePushNotifications() {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== "granted") {
      console.warn("Notification permissions not granted");
      return null;
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync();
    console.log("✅ Push token obtained:", token.data);

    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      handleNotificationReceived(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationResponse(response);
    });

    return {
      token: token.data,
      unsubscribe: () => {
        notificationListener.remove();
        responseListener.remove();
      },
    };
  } catch (error) {
    console.error("Failed to initialize push notifications:", error);
    return null;
  }
}

/**
 * Handle incoming notifications
 */
function handleNotificationReceived(notification: Notifications.Notification) {
  console.log("📬 Notification received:", notification.request.content.title);
  
  const data = notification.request.content.data;
  
  // Handle different notification types
  if (data.type === "new_task") {
    console.log("🆕 New task assigned:", data.taskId);
  } else if (data.type === "task_reminder") {
    console.log("⏰ Task reminder:", data.taskId);
  } else if (data.type === "sync_complete") {
    console.log("✅ Sync completed");
  }
}

/**
 * Handle notification responses (when user taps notification)
 */
function handleNotificationResponse(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data;
  console.log("👆 Notification tapped:", data);
  
  // Navigate to relevant screen based on notification type
  if (data.type === "new_task") {
    // Navigate to tasks screen
  } else if (data.type === "task_reminder") {
    // Navigate to task detail
  }
}

/**
 * Send a local notification
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  delay: number = 5000
) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: "default",
        badge: 1,
      },
      trigger: {
        seconds: Math.ceil(delay / 1000),
      } as any,
    });
    console.log("📤 Notification scheduled:", title);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

/**
 * Send a task alert notification
 */
export async function sendTaskAlert(taskId: string, patientName: string, distance: number) {
  await sendLocalNotification(
    "New Task Assigned",
    `Deliver medicine to ${patientName} (${distance.toFixed(1)}km away)`,
    { type: "new_task", taskId },
    3000
  );
}

/**
 * Send a delivery reminder notification
 */
export async function sendDeliveryReminder(taskId: string, patientName: string) {
  await sendLocalNotification(
    "Delivery Reminder",
    `Don't forget to deliver to ${patientName}`,
    { type: "task_reminder", taskId },
    5000
  );
}

/**
 * Send a sync completion notification
 */
export async function sendSyncCompleteNotification(itemCount: number) {
  await sendLocalNotification(
    "Sync Complete",
    `${itemCount} items synced successfully`,
    { type: "sync_complete" },
    2000
  );
}

/**
 * Background sync task
 * Runs periodically to sync pending deliveries
 */
const BACKGROUND_SYNC_TASK = "background-sync-task";

export async function registerBackgroundSyncTask() {
  try {
    await TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
      try {
        console.log("🔄 Running background sync task...");
        
        // Simulate sync operation
        // In production, this would call your sync service
        // const pendingItems = await syncQueueService.getPendingItems();
        // if (pendingItems.length > 0) {
        //   await performSync(pendingItems);
        //   await sendSyncCompleteNotification(pendingItems.length);
        // }
        
        return "success";
      } catch (error) {
        console.error("Background sync failed:", error);
        return "failed";
      }
    });

    console.log("✅ Background sync task defined");
  } catch (error) {
    console.error("Failed to register background sync task:", error);
  }
}

/**
 * Unregister background sync task
 */
export async function unregisterBackgroundSyncTask() {
  try {
    await TaskManager.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
    console.log("✅ Background sync task unregistered");
  } catch (error) {
    console.error("Failed to unregister background sync task:", error);
  }
}
