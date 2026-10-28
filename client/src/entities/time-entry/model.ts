export type TTimeEntryStatus = 'running' | 'completed';

export interface ITimeEntry {
  id: string;
  employeeId: string;
  employeeName?: string;
  taskDescription: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number;
  status: TTimeEntryStatus;
  createdAt: string;
}

export interface IStartTimerDto {
  employeeId: string;
  taskDescription: string;
}

export interface ICreateManualEntryDto {
  employeeId: string;
  taskDescription: string;
  startTime: string;
  endTime: string;
}

export interface ITimeEntryFilter {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}
