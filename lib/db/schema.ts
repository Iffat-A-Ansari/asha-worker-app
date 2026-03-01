import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";

/**
 * Database Schema for ASHA Worker App
 * Stores tasks, deliveries, and sync queue for offline-first functionality
 */

export const workers = sqliteTable("workers", {
  id: integer("id").primaryKey(),
  phoneNumber: text("phone_number").unique().notNull(),
  name: text("name").notNull(),
  zone: text("zone").notNull(),
  language: text("language").default("en"),
  createdAt: integer("created_at").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  taskId: text("task_id").unique().notNull(),
  patientName: text("patient_name").notNull(),
  patientId: text("patient_id").notNull(),
  medicineName: text("medicine_name").notNull(),
  medicineId: text("medicine_id").notNull(),
  quantity: integer("quantity").notNull(),
  priority: text("priority").notNull(), // "urgent", "pending", "ready"
  distance: real("distance"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  status: text("status").default("pending"), // "pending", "completed", "failed"
  workerId: integer("worker_id").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const deliveries = sqliteTable("deliveries", {
  id: integer("id").primaryKey(),
  deliveryId: text("delivery_id").unique().notNull(),
  taskId: text("task_id").notNull(),
  photoUri: text("photo_uri"),
  verificationMethod: text("verification_method"), // "thumbprint", "signature", "otp"
  verificationData: text("verification_data"), // JSON string
  status: text("status").default("pending"), // "pending", "completed", "synced"
  workerId: integer("worker_id").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const syncQueue = sqliteTable("sync_queue", {
  id: integer("id").primaryKey(),
  entityType: text("entity_type").notNull(), // "delivery", "task", "worker"
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(), // "create", "update", "delete"
  payload: text("payload").notNull(), // JSON string
  status: text("status").default("pending"), // "pending", "syncing", "synced", "failed"
  retryCount: integer("retry_count").default(0),
  lastError: text("last_error"),
  workerId: integer("worker_id").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const qrScans = sqliteTable("qr_scans", {
  id: integer("id").primaryKey(),
  scanId: text("scan_id").unique().notNull(),
  qrData: text("qr_data").notNull(),
  medicineId: text("medicine_id").notNull(),
  timestamp: integer("timestamp").notNull(),
  workerId: integer("worker_id").notNull(),
  status: text("status").default("pending"), // "pending", "synced"
  createdAt: integer("created_at").notNull(),
});
