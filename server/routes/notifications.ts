import { Router, Request, Response } from "express";
import * as Notifications from "expo-server-sdk";

const router = Router();
const expoNotifications = new Notifications.Expo();

// In-memory store for worker push tokens (replace with database in production)
const workerTokens: Record<number, string> = {};

/**
 * Register push token for a worker
 * POST /api/notifications/register-token
 */
router.post("/register-token", (req: Request, res: Response) => {
  try {
    const { workerId, pushToken } = req.body;

    if (!workerId || !pushToken) {
      return res.status(400).json({ error: "Missing workerId or pushToken" });
    }

    // Validate push token format (basic validation)
    if (!pushToken || typeof pushToken !== "string" || pushToken.length < 10) {
      return res.status(400).json({ error: "Invalid push token format" });
    }

    // Store push token (in production, save to database)
    workerTokens[workerId] = pushToken;

    console.log(`✅ Push token registered for worker ${workerId}`);

    res.json({
      success: true,
      message: "Push token registered successfully",
      workerId,
    });
  } catch (error) {
    console.error("❌ Failed to register push token:", error);
    res.status(500).json({ error: "Failed to register push token" });
  }
});

/**
 * Send task alert notification
 * POST /api/notifications/send-task-alert
 */
router.post("/send-task-alert", async (req: Request, res: Response) => {
  try {
    const { workerId, taskId, patientName, medicineName, priority, distance } =
      req.body;

    if (!workerId || !taskId) {
      return res.status(400).json({ error: "Missing workerId or taskId" });
    }

    const pushToken = workerTokens[workerId];

    if (!pushToken) {
      return res.status(404).json({ error: "Worker push token not found" });
    }

    // Prepare notification message
    const message = {
      to: pushToken,
      sound: "default" as const,
      title: `New ${(priority || "pending").toUpperCase()} Task`,
      body: `${patientName || "Patient"} - ${medicineName || "Medicine"}${distance ? ` (${distance}km away)` : ""}`,
      data: {
        type: "task_alert",
        taskId: taskId.toString(),
        patientName: patientName || "",
        medicine: medicineName || "",
        priority: priority || "pending",
        distance: distance || 0,
      },
      badge: 1,
      ttl: 86400, // 24 hours
    };

    // Send notification
    const tickets = await expoNotifications.sendPushNotificationsAsync([
      message,
    ]);

    console.log("✅ Task alert notification sent:", tickets);

    res.json({
      success: true,
      message: "Task alert notification sent",
      tickets,
    });
  } catch (error) {
    console.error("❌ Failed to send task alert:", error);
    res.status(500).json({ error: "Failed to send task alert" });
  }
});

/**
 * Send delivery reminder notification
 * POST /api/notifications/send-delivery-reminder
 */
router.post(
  "/send-delivery-reminder",
  async (req: Request, res: Response) => {
    try {
      const { workerId, taskId, patientName, timeRemaining } = req.body;

      if (!workerId || !taskId) {
        return res.status(400).json({ error: "Missing workerId or taskId" });
      }

      const pushToken = workerTokens[workerId];

      if (!pushToken) {
        return res.status(404).json({ error: "Worker push token not found" });
      }

      // Prepare notification message
      const message = {
        to: pushToken,
        sound: "default" as const,
        title: "Delivery Reminder",
        body: `Complete delivery for ${patientName || "Patient"} - ${timeRemaining || 60}min remaining`,
        data: {
          type: "delivery_reminder",
          taskId: taskId.toString(),
          patientName: patientName || "",
          timeRemaining: timeRemaining || 60,
        },
        badge: 1,
        ttl: 3600, // 1 hour
      };

      // Send notification
      const tickets = await expoNotifications.sendPushNotificationsAsync([
        message,
      ]);

      console.log("✅ Delivery reminder notification sent:", tickets);

      res.json({
        success: true,
        message: "Delivery reminder notification sent",
        tickets,
      });
    } catch (error) {
      console.error("❌ Failed to send delivery reminder:", error);
      res.status(500).json({ error: "Failed to send delivery reminder" });
    }
  }
);

/**
 * Send sync update notification
 * POST /api/notifications/send-sync-update
 */
router.post("/send-sync-update", async (req: Request, res: Response) => {
  try {
    const { workerId, status, itemsCount, failedCount } = req.body;

    if (!workerId || !status) {
      return res.status(400).json({ error: "Missing workerId or status" });
    }

    const pushToken = workerTokens[workerId];

    if (!pushToken) {
      return res.status(404).json({ error: "Worker push token not found" });
    }

    let title = "Sync Update";
    let body = "Syncing data...";

    if (status === "completed") {
      title = "Sync Complete";
      body = `Successfully synced ${itemsCount || 0} items`;
    } else if (status === "failed") {
      title = "Sync Failed";
      body = `Failed to sync ${failedCount || 0} items. Will retry automatically.`;
    }

    // Prepare notification message
    const message = {
      to: pushToken,
      sound: "default" as const,
      title,
      body,
      data: {
        type: "sync_update",
        status,
        itemsCount: itemsCount || 0,
        failedCount: failedCount || 0,
      },
      badge: 1,
      ttl: 3600, // 1 hour
    };

    // Send notification
    const tickets = await expoNotifications.sendPushNotificationsAsync([
      message,
    ]);

    console.log("✅ Sync update notification sent:", tickets);

    res.json({
      success: true,
      message: "Sync update notification sent",
      tickets,
    });
  } catch (error) {
    console.error("❌ Failed to send sync update:", error);
    res.status(500).json({ error: "Failed to send sync update" });
  }
});

/**
 * Send bulk notifications to multiple workers
 * POST /api/notifications/send-bulk
 */
router.post("/send-bulk", async (req: Request, res: Response) => {
  try {
    const { workerIds, title, body, data } = req.body;

    if (!workerIds || !Array.isArray(workerIds) || !title || !body) {
      return res.status(400).json({
        error: "Missing required fields: workerIds (array), title, body",
      });
    }

    // Get push tokens for all workers
    const messages = workerIds
      .map((id: number) => workerTokens[id])
      .filter((token: string | undefined) => token && typeof token === "string" && token.length > 10)
      .map((token: string) => ({
        to: token,
        sound: "default" as const,
        title,
        body,
        data: data || {},
        badge: 1,
        ttl: 86400, // 24 hours
      }));

    if (messages.length === 0) {
      return res.status(404).json({ error: "No workers with valid push tokens" });
    }

    // Send notifications in chunks (Expo API has rate limits)
    const chunks = [];
    for (let i = 0; i < messages.length; i += 100) {
      chunks.push(messages.slice(i, i + 100));
    }

    const allTickets = [];
    for (const chunk of chunks) {
      const tickets = await expoNotifications.sendPushNotificationsAsync(chunk);
      allTickets.push(...tickets);
    }

    console.log("✅ Bulk notifications sent:", allTickets.length);

    res.json({
      success: true,
      message: `Bulk notifications sent to ${messages.length} workers`,
      ticketsCount: allTickets.length,
    });
  } catch (error) {
    console.error("❌ Failed to send bulk notifications:", error);
    res.status(500).json({ error: "Failed to send bulk notifications" });
  }
});

/**
 * Get notification receipt status
 * POST /api/notifications/receipt
 */
router.post("/receipt", async (req: Request, res: Response) => {
  try {
    const { tickets } = req.body;

    if (!tickets || !Array.isArray(tickets)) {
      return res.status(400).json({ error: "Missing tickets array" });
    }

    // Check receipt status for each ticket
    const receiptIds = tickets
      .map((t: any) => t.id)
      .filter((id: string) => id);

    if (receiptIds.length === 0) {
      return res.json({ receipts: {} });
    }

    const receipts = await expoNotifications.getPushNotificationReceiptsAsync(
      receiptIds
    );

    console.log("✅ Receipt status retrieved:", receipts);

    res.json({
      success: true,
      receipts,
    });
  } catch (error) {
    console.error("❌ Failed to get receipt status:", error);
    res.status(500).json({ error: "Failed to get receipt status" });
  }
});

/**
 * Get all registered worker tokens (for debugging)
 * GET /api/notifications/tokens
 */
router.get("/tokens", (req: Request, res: Response) => {
  res.json({
    success: true,
    tokens: workerTokens,
    count: Object.keys(workerTokens).length,
  });
});

export default router;
