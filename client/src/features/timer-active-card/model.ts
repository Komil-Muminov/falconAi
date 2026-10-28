import { ITimeEntry } from '@/entities/time-entry';

export interface ITimerActiveCardProps {
  entry: ITimeEntry;
  isStopping: boolean;
  onStop: (id: string) => void;
}
