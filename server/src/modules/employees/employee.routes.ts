import { Request, Response, Router } from 'express';
import { employeeService } from './employee.service.js';

export const employeeRouter = Router();

employeeRouter.get('/search', (_req: Request, res: Response): void => {
  try {
    const employees = employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    res.status(500).json({ error: message });
  }
});

employeeRouter.post('/create', (req: Request, res: Response): void => {
  try {
    const { name, position, department } = req.body;
    const employee = employeeService.createEmployee({ name, position, department });
    res.status(201).json(employee);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка создания сотрудника';
    res.status(400).json({ error: message });
  }
});

employeeRouter.delete('/delete/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    employeeService.deleteEmployee(id);
    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления сотрудника';
    res.status(400).json({ error: message });
  }
});
