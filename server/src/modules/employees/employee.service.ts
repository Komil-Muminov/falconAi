import { randomUUID } from 'node:crypto';
import { employeeDb } from './employee.db.js';
import { ICreateEmployeeDto, IEmployee } from './types.js';

export const employeeService = {
  createEmployee: (dto: ICreateEmployeeDto): IEmployee => {
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Имя сотрудника обязательно');
    }
    if (!dto.position || dto.position.trim().length === 0) {
      throw new Error('Должность сотрудника обязательна');
    }
    if (!dto.department || dto.department.trim().length === 0) {
      throw new Error('Отдел сотрудника обязателен');
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    return employeeDb.create(id, dto, createdAt);
  },

  getAllEmployees: (): IEmployee[] => {
    return employeeDb.findAll();
  },

  getEmployeeById: (id: string): IEmployee => {
    const employee = employeeDb.findById(id);
    if (!employee) {
      throw new Error('Сотрудник не найден');
    }
    return employee;
  },

  deleteEmployee: (id: string): void => {
    const deleted = employeeDb.delete(id);
    if (!deleted) {
      throw new Error('Сотрудник не найден для удаления');
    }
  }
};
