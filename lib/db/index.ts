import { Platform } from "react-native";
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

/**
 * Initialize the local SQLite database
 * Creates tables if they don't exist
 */
export async function initializeDatabase() {
  if (db) return db;

  try {
    // Skip database initialization on web platform
    if (Platform.OS === "web") {
      console.log("⚠️  SQLite not available on web platform, using mock database");
      return null as any;
    }

    const sqliteDb = openDatabaseSync("asha-worker.db");

    // Initialize tables
    sqliteDb.execSync(`
      CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        zone TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id TEXT UNIQUE NOT NULL,
        patient_name TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        medicine_name TEXT NOT NULL,
        medicine_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        priority TEXT NOT NULL,
        distance REAL,
        latitude REAL,
        longitude REAL,
        status TEXT DEFAULT 'pending',
        worker_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (worker_id) REFERENCES workers(id)
      );

      CREATE TABLE IF NOT EXISTS deliveries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        delivery_id TEXT UNIQUE NOT NULL,
        task_id TEXT NOT NULL,
        photo_uri TEXT,
        verification_method TEXT,
        verification_data TEXT,
        status TEXT DEFAULT 'pending',
        worker_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (worker_id) REFERENCES workers(id)
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        worker_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (worker_id) REFERENCES workers(id)
      );

      CREATE TABLE IF NOT EXISTS qr_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id TEXT UNIQUE NOT NULL,
        qr_data TEXT NOT NULL,
        medicine_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        worker_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at INTEGER NOT NULL,
        FOREIGN KEY (worker_id) REFERENCES workers(id)
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_worker_id ON tasks(worker_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_deliveries_worker_id ON deliveries(worker_id);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
      CREATE INDEX IF NOT EXISTS idx_qr_scans_worker_id ON qr_scans(worker_id);
    `);

    db = drizzle(sqliteDb, { schema });
    console.log("✅ Database initialized successfully");
    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    // Don't throw on web platform
    if (Platform.OS !== "web") {
      throw error;
    }
    return null as any;
  }
}

/**
 * Get the database instance
 */
export function getDatabase() {
  if (Platform.OS === "web") {
    return null as any; // Return null on web platform
  }
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return db;
}

/**
 * Close the database connection
 */
export async function closeDatabase() {
  if (Platform.OS !== "web" && db) {
    db = null;
  }
}
