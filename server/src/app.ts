import cors from 'cors';
import express, { Express } from 'express';
import { employeeRouter } from './modules/employees/index.js';
import { reportRouter } from './modules/reports/index.js';
import { timeEntryRouter } from './modules/time-entries/index.js';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/employees', employeeRouter);
  app.use('/api/time-entries', timeEntryRouter);
  app.use('/api/reports', reportRouter);

  return app;
};
