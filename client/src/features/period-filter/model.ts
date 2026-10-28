import { IEmployee } from '@/entities/employee';

export interface IPeriodFilterValue {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export interface IPeriodFilterProps {
  employees: IEmployee[];
  value: IPeriodFilterValue;
  onChange: (newValue: IPeriodFilterValue) => void;
  onReset: () => void;
}
