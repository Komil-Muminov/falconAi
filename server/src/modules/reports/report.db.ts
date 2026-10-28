import { db } from '../../shared/db/connection.js';
import { IEmployeeReportSummary, IReportFilter } from './types.js';

interface IReportDbRow {
  employee_id: string;
  employee_name: string;
  position: string;
  department: string;
  total_duration_seconds: number | null;
  completed_tasks_count: number;
  has_active_timer: number;
}

export const reportDb = {
  getSummary: (filter: IReportFilter): IEmployeeReportSummary[] => {
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filter.employeeId) {
      conditions.push('e.id = ?');
      params.push(filter.employeeId);
    }

    const timeConditions: string[] = ["t.status = 'completed'"];
    const timeParams: (string | number)[] = [];

    if (filter.startDate) {
      timeConditions.push('t.start_time >= ?');
      timeParams.push(filter.startDate);
    }
    if (filter.endDate) {
      timeConditions.push('t.start_time <= ?');
      timeParams.push(filter.endDate);
    }

    const timeWhere = timeConditions.join(' AND ');

    const employeeWhere = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        e.id as employee_id,
        e.name as employee_name,
        e.position,
        e.department,
        COALESCE(
          (SELECT SUM(t.duration_seconds) FROM time_entries t WHERE t.employee_id = e.id AND ${timeWhere}),
          0
        ) as total_duration_seconds,
        COALESCE(
          (SELECT COUNT(t.id) FROM time_entries t WHERE t.employee_id = e.id AND ${timeWhere}),
          0
        ) as completed_tasks_count,
        COALESCE(
          (SELECT COUNT(t.id) FROM time_entries t WHERE t.employee_id = e.id AND t.status = 'running'),
          0
        ) as has_active_timer
      FROM employees e
      ${employeeWhere}
      ORDER BY total_duration_seconds DESC, e.name ASC
    `;

    const allParams = [...timeParams, ...timeParams, ...params];
    const stmt = db.prepare(query);
    const rows = stmt.all(...allParams) as IReportDbRow[];

    return rows.map((row) => ({
      employeeId: row.employee_id,
      employeeName: row.employee_name,
      position: row.position,
      department: row.department,
      totalDurationSeconds: Number(row.total_duration_seconds || 0),
      completedTasksCount: Number(row.completed_tasks_count || 0),
      hasActiveTimer: Boolean(row.has_active_timer > 0)
    }));
  }
};
