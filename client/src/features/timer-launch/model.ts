import { IEmployee } from '@/entities/employee';
import { IStartTimerDto } from '@/entities/time-entry';

export interface ITimerLaunchProps {
  employees: IEmployee[];
  activeEmployeeIds: string[];
  isLoading: boolean;
  onStart: (dto: IStartTimerDto) => void;
}

export type TTimerLaunchFormState = IStartTimerDto;
