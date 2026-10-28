import { IEmployee } from '@/entities/employee';
import { ICreateManualEntryDto } from '@/entities/time-entry';
import type { Dayjs } from 'dayjs';

export interface ITimeEntryManualProps {
  isOpen: boolean;
  employees: IEmployee[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (dto: ICreateManualEntryDto) => void;
}

export interface IManualEntryFormValues {
  employeeId: string;
  taskDescription: string;
  timeRange: [Dayjs, Dayjs];
}
