import { reportDb } from './report.db.js';
import { IEmployeeReportSummary, IReportFilter } from './types.js';

export const reportService = {
  getSummaryReport: (filter: IReportFilter): IEmployeeReportSummary[] => {
    return reportDb.getSummary(filter);
  }
};
