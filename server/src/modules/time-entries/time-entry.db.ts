import { db } from '../../shared/db/connection.js';
import { ITimeEntry, ITimeEntryDbRow, ITimeEntryFilter } from './types.js';

const mapRowToTimeEntry = (row: ITimeEntryDbRow): ITimeEntry => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  taskDescription: row.task_description,
  startTime: row.start_time,
  endTime: row.end_time,
  durationSeconds: row.duration_seconds,
  status: row.status,
  createdAt: row.created_at
});

export const timeEntryDb = {
  create: (entry: ITimeEntry): ITimeEntry => {
    const stmt = db.prepare(`
      INSERT INTO time_entries (
        id, employee_id, task_description, start_time, end_time, duration_seconds, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      entry.id,
      entry.employeeId,
      entry.taskDescription,
      entry.startTime,
      entry.endTime,
      entry.durationSeconds,
      entry.status,
      entry.createdAt
    );
    return entry;
  },

  findRunningByEmployeeId: (employeeId: string): ITimeEntry | null => {
    const stmt = db.prepare(`
      SELECT t.*, e.name as employee_name
      FROM time_entries t
      LEFT JOIN employees e ON t.employee_id = e.id
      WHERE t.employee_id = ? AND t.status = 'running'
      LIMIT 1
    `);
    const row = stmt.get(employeeId) as ITimeEntryDbRow | undefined;
    if (!row) {
      return null;
    }
    return mapRowToTimeEntry(row);
  },

  findAllRunning: (): ITimeEntry[] => {
    const stmt = db.prepare(`
      SELECT t.*, e.name as employee_name
      FROM time_entries t
      LEFT JOIN employees e ON t.employee_id = e.id
      WHERE t.status = 'running'
      ORDER BY t.start_time DESC
    `);
    const rows = stmt.all() as ITimeEntryDbRow[];
    return rows.map(mapRowToTimeEntry);
  },

  findById: (id: string): ITimeEntry | null => {
    const stmt = db.prepare(`
      SELECT t.*, e.name as employee_name
      FROM time_entries t
      LEFT JOIN employees e ON t.employee_id = e.id
      WHERE t.id = ?
    `);
    const row = stmt.get(id) as ITimeEntryDbRow | undefined;
    if (!row) {
      return null;
    }
    return mapRowToTimeEntry(row);
  },

  stop: (id: string, endTime: string, durationSeconds: number): boolean => {
    const stmt = db.prepare(`
      UPDATE time_entries
      SET end_time = ?, duration_seconds = ?, status = 'completed'
      WHERE id = ? AND status = 'running'
    `);
    const result = stmt.run(endTime, durationSeconds, id);
    return result.changes > 0;
  },

  search: (filter: ITimeEntryFilter): ITimeEntry[] => {
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filter.employeeId) {
      conditions.push('t.employee_id = ?');
      params.push(filter.employeeId);
    }
    if (filter.startDate) {
      conditions.push('t.start_time >= ?');
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      conditions.push('t.start_time <= ?');
      params.push(filter.endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const stmt = db.prepare(`
      SELECT t.*, e.name as employee_name
      FROM time_entries t
      LEFT JOIN employees e ON t.employee_id = e.id
      ${whereClause}
      ORDER BY t.start_time DESC
    `);

    const rows = stmt.all(...params) as ITimeEntryDbRow[];
    return rows.map(mapRowToTimeEntry);
  },

  delete: (id: string): boolean => {
    const stmt = db.prepare('DELETE FROM time_entries WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};
