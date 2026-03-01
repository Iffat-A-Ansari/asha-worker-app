import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Push Notification Channels for Android
 * iOS uses silent notifications by default
 */
export const NOTIFICATION_CHANNELS = {
  TASK_ALERTS: {
    id: "task-alerts",
    name: "Task Alerts",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#0891b2",
  },
  DELIVERY_REMINDERS: {
    id: "delivery-reminders",
    name: "Delivery Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    vibrationPattern: [0, 200],
    lightColor: "#0891b2",
  },
  SYNC_UPDATES: {
    id: "sync-updates",
    name: "Sync Updates",
    importance: Notifications.AndroidImportance.LOW,
    sound: "default",
    vibrationPattern: [0, 100],
    lightColor: "#0891b2",
  },
};

/**
 * Initialize push notification channels for Android
 */
export async function initializePushChannels() {
  if (Platform.OS !== "android") return;

  try {
    // Create notification channels
    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNELS.TASK_ALERTS.id,
      {
        name: NOTIFICATION_CHANNELS.TASK_ALERTS.name,
        importance: NOTIFICATION_CHANNELS.TASK_ALERTS.importance,
        vibrationPattern: NOTIFICATION_CHANNELS.TASK_ALERTS.vibrationPattern,
        lightColor: NOTIFICATION_CHANNELS.TASK_ALERTS.lightColor,
        sound: NOTIFICATION_CHANNELS.TASK_ALERTS.sound,
        enableVibrate: true,
        enableLights: true,
      }
    );

    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.id,
      {
        name: NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.name,
        importance: NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.importance,
        vibrationPattern: NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.vibrationPattern,
        lightColor: NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.lightColor,
        sound: NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.sound,
        enableVibrate: true,
        enableLights: true,
      }
    );

    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_CHANNELS.SYNC_UPDATES.id,
      {
        name: NOTIFICATION_CHANNELS.SYNC_UPDATES.name,
        importance: NOTIFICATION_CHANNELS.SYNC_UPDATES.importance,
        vibrationPattern: NOTIFICATION_CHANNELS.SYNC_UPDATES.vibrationPattern,
        lightColor: NOTIFICATION_CHANNELS.SYNC_UPDATES.lightColor,
        sound: NOTIFICATION_CHANNELS.SYNC_UPDATES.sound,
        enableVibrate: true,
      }
    );

    console.log("✅ Push notification channels initialized");
  } catch (error) {
    console.error("❌ Failed to initialize notification channels:", error);
  }
}

/**
 * Get push notification token for the device
 * This token is used to send push notifications to this specific device
 */
export async function getPushToken(): Promise<string | null> {
  try {
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("⚠️  Notification permissions not granted");
      return null;
    }

    // Get the push token
    const token = await Notifications.getExpoPushTokenAsync();
    console.log("✅ Push token obtained:", token.data);
    return token.data;
  } catch (error) {
    console.error("❌ Failed to get push token:", error);
    return null;
  }
}

/**
 * Send a local notification (for testing)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  channelId: string = NOTIFICATION_CHANNELS.TASK_ALERTS.id,
  data?: Record<string, any>
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
      trigger: null, // Send immediately
      ...(Platform.OS === "android" && { channelId }),
    });

    console.log("✅ Local notification scheduled:", title);
  } catch (error) {
    console.error("❌ Failed to send local notification:", error);
  }
}

/**
 * Notification payload types
 */
export interface TaskAlertPayload {
  type: "task_alert";
  taskId: string;
  patientName: string;
  medicine: string;
  priority: "urgent" | "pending" | "ready";
  distance: number;
}

export interface DeliveryReminderPayload {
  type: "delivery_reminder";
  taskId: string;
  patientName: string;
  timeRemaining: number; // minutes
}

export interface SyncUpdatePayload {
  type: "sync_update";
  status: "started" | "completed" | "failed";
  itemsCount: number;
  failedCount?: number;
}

export type NotificationPayload =
  | TaskAlertPayload
  | DeliveryReminderPayload
  | SyncUpdatePayload;

/**
 * Format notification based on payload type
 */
export function formatNotification(payload: NotificationPayload) {
  switch (payload.type) {
    case "task_alert":
      return {
        title: `New ${payload.priority.toUpperCase()} Task`,
        body: `${payload.patientName} - ${payload.medicine} (${payload.distance}km away)`,
        channelId: NOTIFICATION_CHANNELS.TASK_ALERTS.id,
      };

    case "delivery_reminder":
      return {
        title: "Delivery Reminder",
        body: `Complete delivery for ${payload.patientName} - ${payload.timeRemaining}min remaining`,
        channelId: NOTIFICATION_CHANNELS.DELIVERY_REMINDERS.id,
      };

    case "sync_update":
      if (payload.status === "completed") {
        return {
          title: "Sync Complete",
          body: `Successfully synced ${payload.itemsCount} items`,
          channelId: NOTIFICATION_CHANNELS.SYNC_UPDATES.id,
        };
      } else if (payload.status === "failed") {
        return {
          title: "Sync Failed",
          body: `Failed to sync ${payload.failedCount || 0} items. Will retry automatically.`,
          channelId: NOTIFICATION_CHANNELS.SYNC_UPDATES.id,
        };
      }
      return {
        title: "Syncing Data",
        body: `Syncing ${payload.itemsCount} items...`,
        channelId: NOTIFICATION_CHANNELS.SYNC_UPDATES.id,
      };

    default:
      return {
        title: "ASHA Worker",
        body: "New notification",
        channelId: NOTIFICATION_CHANNELS.TASK_ALERTS.id,
      };
  }
}

/**
 * Setup notification response handler
 */
export function setupNotificationResponseHandler(
  onNotificationResponse: (notification: Notifications.Notification) => void
) {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("📬 Notification response received:", response.notification);
      onNotificationResponse(response.notification);
    }
  );

  return subscription as Notifications.EventSubscription;
}

/**
 * Setup foreground notification handler
 */
export function setupForegroundNotificationHandler(
  onNotificationReceived: (notification: Notifications.Notification) => void
) {
  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("📨 Notification received in foreground:", notification);
      onNotificationReceived(notification);
    }
  );

  return subscription;
}

/**
 * Cleanup notification listeners
 */
export function removeNotificationListeners(
  responseSubscription?: Notifications.EventSubscription,
  foregroundSubscription?: Notifications.EventSubscription
) {
  if (responseSubscription) {
    responseSubscription.remove();
  }
  if (foregroundSubscription) {
    foregroundSubscription.remove();
  }
}
