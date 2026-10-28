import { Request, Response, Router } from 'express';
import { reportService } from './report.service.js';

export const reportRouter = Router();

reportRouter.get('/summary', (req: Request, res: Response): void => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const filter = {
      startDate: typeof startDate === 'string' && startDate ? startDate : undefined,
      endDate: typeof endDate === 'string' && endDate ? endDate : undefined,
      employeeId: typeof employeeId === 'string' && employeeId ? employeeId : undefined
    };
    const summary = reportService.getSummaryReport(filter);
    res.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при формировании отчета';
    res.status(500).json({ error: message });
  }
});
