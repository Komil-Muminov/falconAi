import { ICreateEmployeeDto } from '@/entities/employee';

export interface IEmployeeCreateProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (dto: ICreateEmployeeDto) => void;
}

export type TEmployeeFormState = ICreateEmployeeDto;
