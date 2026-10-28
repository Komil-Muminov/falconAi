import { db } from '../../shared/db/connection.js';
import { ICreateEmployeeDto, IEmployee, IEmployeeDbRow } from './types.js';

const mapRowToEmployee = (row: IEmployeeDbRow): IEmployee => ({
  id: row.id,
  name: row.name,
  position: row.position,
  department: row.department,
  createdAt: row.created_at
});

export const employeeDb = {
  create: (id: string, dto: ICreateEmployeeDto, createdAt: string): IEmployee => {
    const stmt = db.prepare(`
      INSERT INTO employees (id, name, position, department, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, dto.name.trim(), dto.position.trim(), dto.department.trim(), createdAt);
    return {
      id,
      name: dto.name.trim(),
      position: dto.position.trim(),
      department: dto.department.trim(),
      createdAt
    };
  },

  findAll: (): IEmployee[] => {
    const stmt = db.prepare(`
      SELECT id, name, position, department, created_at
      FROM employees
      ORDER BY created_at DESC
    `);
    const rows = stmt.all() as IEmployeeDbRow[];
    return rows.map(mapRowToEmployee);
  },

  findById: (id: string): IEmployee | null => {
    const stmt = db.prepare(`
      SELECT id, name, position, department, created_at
      FROM employees
      WHERE id = ?
    `);
    const row = stmt.get(id) as IEmployeeDbRow | undefined;
    if (!row) {
      return null;
    }
    return mapRowToEmployee(row);
  },

  delete: (id: string): boolean => {
    const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};
