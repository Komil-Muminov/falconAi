import { randomUUID } from 'node:crypto';
import { employeeDb } from '../../modules/employees/employee.db.js';
import { timeEntryDb } from '../../modules/time-entries/time-entry.db.js';

export const seedMockDataIfEmpty = (): void => {
  const existingEmployees = employeeDb.findAll();
  if (existingEmployees.length > 0) {
    return;
  }

  const emp1 = employeeDb.create(
    randomUUID(),
    {
      name: 'Алексей Смирнов',
      position: 'Senior Frontend Developer',
      department: 'Отдел разработки'
    },
    new Date(Date.now() - 30 * 86400000).toISOString()
  );

  const emp2 = employeeDb.create(
    randomUUID(),
    {
      name: 'Екатерина Васильева',
      position: 'UI/UX Designer',
      department: 'Отдел дизайна'
    },
    new Date(Date.now() - 25 * 86400000).toISOString()
  );

  const emp3 = employeeDb.create(
    randomUUID(),
    {
      name: 'Дмитрий Кузнецов',
      position: 'Backend Tech Lead',
      department: 'Отдел разработки'
    },
    new Date(Date.now() - 20 * 86400000).toISOString()
  );

  const now = Date.now();
  const pastEntries = [
    {
      empId: emp1.id,
      name: emp1.name,
      task: 'Разработка компонентов дизайн-системы и карточек',
      startOffsetMinutes: 300,
      durationMinutes: 125
    },
    {
      empId: emp1.id,
      name: emp1.name,
      task: 'Оптимизация производительности рендеринга таблиц',
      startOffsetMinutes: 140,
      durationMinutes: 80
    },
    {
      empId: emp2.id,
      name: emp2.name,
      task: 'Проектирование интерактивного интерфейса таймера и отчетов',
      startOffsetMinutes: 280,
      durationMinutes: 160
    },
    {
      empId: emp3.id,
      name: emp3.name,
      task: 'Проектирование схемы SQLite и сервисной архитектуры',
      startOffsetMinutes: 240,
      durationMinutes: 195
    }
  ];

  for (const item of pastEntries) {
    const startTime = new Date(now - item.startOffsetMinutes * 60000).toISOString();
    const endTime = new Date(
      now - (item.startOffsetMinutes - item.durationMinutes) * 60000
    ).toISOString();

    timeEntryDb.create({
      id: randomUUID(),
      employeeId: item.empId,
      employeeName: item.name,
      taskDescription: item.task,
      startTime,
      endTime,
      durationSeconds: item.durationMinutes * 60,
      status: 'completed',
      createdAt: startTime
    });
  }
};
