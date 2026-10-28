export interface IEmployeeReportSummary {
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  totalDurationSeconds: number;
  completedTasksCount: number;
  hasActiveTimer: boolean;
}

export interface IReportFilter {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}
