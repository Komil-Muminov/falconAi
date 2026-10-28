import { randomUUID } from 'node:crypto';
import { employeeDb } from '../employees/employee.db.js';
import { timeEntryDb } from './time-entry.db.js';
import { ICreateManualEntryDto, IStartTimerDto, ITimeEntry, ITimeEntryFilter } from './types.js';

export const timeEntryService = {
  startTimer: (dto: IStartTimerDto): ITimeEntry => {
    if (!dto.employeeId || dto.employeeId.trim().length === 0) {
      throw new Error('Идентификатор сотрудника обязателен');
    }

    if (!dto.taskDescription || dto.taskDescription.trim().length === 0) {
      throw new Error('Описание задачи обязательно');
    }

    const employee = employeeDb.findById(dto.employeeId);
    if (!employee) {
      throw new Error('Указанный сотрудник не существует');
    }

    const existingRunning = timeEntryDb.findRunningByEmployeeId(dto.employeeId);
    if (existingRunning) {
      throw new Error(
        `У сотрудника "${employee.name}" уже запущен таймер по задаче: "${existingRunning.taskDescription}". Завершите текущий таймер перед запуском нового.`
      );
    }

    const now = new Date().toISOString();
    const newEntry: ITimeEntry = {
      id: randomUUID(),
      employeeId: dto.employeeId,
      employeeName: employee.name,
      taskDescription: dto.taskDescription.trim(),
      startTime: now,
      endTime: null,
      durationSeconds: 0,
      status: 'running',
      createdAt: now
    };

    return timeEntryDb.create(newEntry);
  },

  stopTimer: (id: string): ITimeEntry => {
    const entry = timeEntryDb.findById(id);
    if (!entry) {
      throw new Error('Запись таймера не найдена');
    }

    if (entry.status !== 'running') {
      throw new Error('Этот таймер уже был остановлен ранее');
    }

    const endTime = new Date().toISOString();
    const startMs = new Date(entry.startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const durationSeconds = Math.max(0, Math.round((endMs - startMs) / 1000));

    const updated = timeEntryDb.stop(id, endTime, durationSeconds);
    if (!updated) {
      throw new Error('Не удалось обновить статус таймера');
    }

    const completed = timeEntryDb.findById(id);
    if (!completed) {
      throw new Error('Не удалось получить завершенную запись таймера');
    }

    return completed;
  },

  createManualEntry: (dto: ICreateManualEntryDto): ITimeEntry => {
    if (!dto.employeeId || !dto.taskDescription || !dto.startTime || !dto.endTime) {
      throw new Error('Все поля обязательны для заполнения');
    }

    const employee = employeeDb.findById(dto.employeeId);
    if (!employee) {
      throw new Error('Указанный сотрудник не существует');
    }

    const startMs = new Date(dto.startTime).getTime();
    const endMs = new Date(dto.endTime).getTime();

    if (isNaN(startMs) || isNaN(endMs)) {
      throw new Error('Некорректный формат времени');
    }

    if (endMs <= startMs) {
      throw new Error('Время окончания должно быть позже времени начала');
    }

    const durationSeconds = Math.round((endMs - startMs) / 1000);
    const now = new Date().toISOString();

    const entry: ITimeEntry = {
      id: randomUUID(),
      employeeId: dto.employeeId,
      employeeName: employee.name,
      taskDescription: dto.taskDescription.trim(),
      startTime: new Date(startMs).toISOString(),
      endTime: new Date(endMs).toISOString(),
      durationSeconds,
      status: 'completed',
      createdAt: now
    };

    return timeEntryDb.create(entry);
  },

  getActiveTimers: (): ITimeEntry[] => {
    return timeEntryDb.findAllRunning();
  },

  searchEntries: (filter: ITimeEntryFilter): ITimeEntry[] => {
    return timeEntryDb.search(filter);
  },

  deleteEntry: (id: string): void => {
    const deleted = timeEntryDb.delete(id);
    if (!deleted) {
      throw new Error('Запись не найдена для удаления');
    }
  }
};
