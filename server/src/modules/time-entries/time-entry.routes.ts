import { Request, Response, Router } from 'express';
import { timeEntryService } from './time-entry.service.js';

export const timeEntryRouter = Router();

timeEntryRouter.get('/search', (req: Request, res: Response): void => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const filter = {
      employeeId: typeof employeeId === 'string' && employeeId ? employeeId : undefined,
      startDate: typeof startDate === 'string' && startDate ? startDate : undefined,
      endDate: typeof endDate === 'string' && endDate ? endDate : undefined
    };
    const entries = timeEntryService.searchEntries(filter);
    res.json(entries);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при поиске записей';
    res.status(500).json({ error: message });
  }
});

timeEntryRouter.get('/active', (_req: Request, res: Response): void => {
  try {
    const activeTimers = timeEntryService.getActiveTimers();
    res.json(activeTimers);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при получении таймеров';
    res.status(500).json({ error: message });
  }
});

timeEntryRouter.post('/start', (req: Request, res: Response): void => {
  try {
    const { employeeId, taskDescription } = req.body;
    const entry = timeEntryService.startTimer({ employeeId, taskDescription });
    res.status(201).json(entry);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка запуска таймера';
    res.status(400).json({ error: message });
  }
});

timeEntryRouter.patch('/stop/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const entry = timeEntryService.stopTimer(id);
    res.json(entry);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка остановки таймера';
    res.status(400).json({ error: message });
  }
});

timeEntryRouter.post('/manual-create', (req: Request, res: Response): void => {
  try {
    const { employeeId, taskDescription, startTime, endTime } = req.body;
    const entry = timeEntryService.createManualEntry({
      employeeId,
      taskDescription,
      startTime,
      endTime
    });
    res.status(201).json(entry);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка добавления записи';
    res.status(400).json({ error: message });
  }
});

timeEntryRouter.delete('/delete/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    timeEntryService.deleteEntry(id);
    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления записи';
    res.status(400).json({ error: message });
  }
});
