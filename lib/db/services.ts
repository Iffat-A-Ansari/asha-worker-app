import { getDatabase } from "./index";
import { tasks, deliveries, syncQueue, qrScans, workers } from "./schema";
import { eq, and } from "drizzle-orm";

/**
 * Task Management Services
 */
export const taskService = {
  async createTask(taskData: any, workerId: number) {
    const db = getDatabase();
    const now = Date.now();
    
    const result = await db.insert(tasks).values({
      taskId: taskData.id,
      patientName: taskData.patientName,
      patientId: taskData.patientId,
      medicineName: taskData.medicineName,
      medicineId: taskData.medicineId,
      quantity: taskData.quantity,
      priority: taskData.priority,
      distance: taskData.distance,
      latitude: taskData.latitude,
      longitude: taskData.longitude,
      status: "pending",
      workerId,
      createdAt: now,
      updatedAt: now,
    });

    // Add to sync queue
    await syncQueueService.addToQueue(workerId, "task", taskData.id, "create", taskData);
    
    return result;
  },

  async getTasksByWorker(workerId: number, status?: string) {
    const db = getDatabase();
    
    if (status) {
      return await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.workerId, workerId), eq(tasks.status, status)));
    }
    
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.workerId, workerId));
  },

  async updateTaskStatus(taskId: string, status: string, workerId: number) {
    const db = getDatabase();
    const now = Date.now();

    await db
      .update(tasks)
      .set({ status, updatedAt: now })
      .where(and(eq(tasks.taskId, taskId), eq(tasks.workerId, workerId)));

    // Add to sync queue
    await syncQueueService.addToQueue(workerId, "task", taskId, "update", { status });
  },
};

/**
 * Delivery Management Services
 */
export const deliveryService = {
  async createDelivery(deliveryData: any, workerId: number) {
    const db = getDatabase();
    const now = Date.now();

    const result = await db.insert(deliveries).values({
      deliveryId: deliveryData.id,
      taskId: deliveryData.taskId,
      photoUri: deliveryData.photoUri,
      verificationMethod: deliveryData.verificationMethod,
      verificationData: JSON.stringify(deliveryData.verificationData || {}),
      status: "pending",
      workerId,
      createdAt: now,
      updatedAt: now,
    });

    // Add to sync queue
    await syncQueueService.addToQueue(workerId, "delivery", deliveryData.id, "create", deliveryData);
    
    return result;
  },

  async getDeliveriesByWorker(workerId: number, status?: string) {
    const db = getDatabase();

    if (status) {
      return await db
        .select()
        .from(deliveries)
        .where(and(eq(deliveries.workerId, workerId), eq(deliveries.status, status)));
    }

    return await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.workerId, workerId));
  },

  async updateDeliveryStatus(deliveryId: string, status: string, workerId: number) {
    const db = getDatabase();
    const now = Date.now();

    await db
      .update(deliveries)
      .set({ status, updatedAt: now })
      .where(and(eq(deliveries.deliveryId, deliveryId), eq(deliveries.workerId, workerId)));

    // Add to sync queue
    await syncQueueService.addToQueue(workerId, "delivery", deliveryId, "update", { status });
  },
};

/**
 * Sync Queue Management Services
 */
export const syncQueueService = {
  async addToQueue(workerId: number, entityType: string, entityId: string, action: string, payload: any) {
    const db = getDatabase();
    const now = Date.now();

    return await db.insert(syncQueue).values({
      entityType,
      entityId,
      action,
      payload: JSON.stringify(payload),
      status: "pending",
      retryCount: 0,
      workerId,
      createdAt: now,
      updatedAt: now,
    });
  },

  async getPendingItems(workerId: number) {
    const db = getDatabase();

    return await db
      .select()
      .from(syncQueue)
      .where(and(eq(syncQueue.workerId, workerId), eq(syncQueue.status, "pending")));
  },

  async markAsSynced(queueId: number) {
    const db = getDatabase();

    await db
      .update(syncQueue)
      .set({ status: "synced", updatedAt: Date.now() })
      .where(eq(syncQueue.id, queueId));
  },

  async markAsFailed(queueId: number, error: string) {
    const db = getDatabase();
    const item = (await db.select().from(syncQueue).where(eq(syncQueue.id, queueId)))[0];
    const newRetryCount = (item?.retryCount || 0) + 1;

    await db
      .update(syncQueue)
      .set({
        status: "failed",
        lastError: error,
        retryCount: newRetryCount,
        updatedAt: Date.now(),
      })
      .where(eq(syncQueue.id, queueId));
  },

  async getPendingCount(workerId: number) {
    const db = getDatabase();

    const result = await db
      .select()
      .from(syncQueue)
      .where(and(eq(syncQueue.workerId, workerId), eq(syncQueue.status, "pending")));

    return result.length;
  },
};

/**
 * QR Scan Management Services
 */
export const qrScanService = {
  async recordScan(qrData: string, medicineId: string, workerId: number) {
    const db = getDatabase();
    const now = Date.now();

    const result = await db.insert(qrScans).values({
      scanId: `scan-${now}-${Math.random()}`,
      qrData,
      medicineId,
      timestamp: now,
      workerId,
      status: "pending",
      createdAt: now,
    });

    // Add to sync queue
    await syncQueueService.addToQueue(workerId, "qr_scan", medicineId, "create", {
      qrData,
      medicineId,
      timestamp: now,
    });

    return result;
  },

  async getPendingScans(workerId: number) {
    const db = getDatabase();

    return await db
      .select()
      .from(qrScans)
      .where(and(eq(qrScans.workerId, workerId), eq(qrScans.status, "pending")));
  },

  async markScanAsSynced(scanId: string) {
    const db = getDatabase();

    await db
      .update(qrScans)
      .set({ status: "synced" })
      .where(eq(qrScans.scanId, scanId));
  },
};

/**
 * Worker Management Services
 */
export const workerService = {
  async createWorker(phoneNumber: string, name: string, zone: string, language: string = "en") {
    const db = getDatabase();
    const now = Date.now();

    const result = await db.insert(workers).values({
      phoneNumber,
      name,
      zone,
      language,
      createdAt: now,
    });

    return result;
  },

  async getWorkerByPhone(phoneNumber: string) {
    const db = getDatabase();

    const result = await db
      .select()
      .from(workers)
      .where(eq(workers.phoneNumber, phoneNumber));

    return result[0] || null;
  },

  async updateWorkerLanguage(workerId: number, language: string) {
    const db = getDatabase();

    await db
      .update(workers)
      .set({ language })
      .where(eq(workers.id, workerId));
  },
};
