import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { envConfig } from '../config/env.js';

const resolvedDbPath = path.resolve(process.cwd(), envConfig.databasePath);
const dbDir = path.dirname(resolvedDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(resolvedDbPath);

export const initDatabase = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS time_entries (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      task_description TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      duration_seconds INTEGER DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('running', 'completed')),
      created_at TEXT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_time_entries_employee_id ON time_entries(employee_id);
    CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);
    CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(start_time);
  `);
};
