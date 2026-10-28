import { ClockCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { formatDuration } from '@/shared/lib';
import { ITimerActiveCardProps } from './model';

export const TimerActiveCard: React.FC<ITimerActiveCardProps> = ({
  entry,
  isStopping,
  onStop
}) => {
  const calculateElapsed = useCallback((): number => {
    const startMs = new Date(entry.startTime).getTime();
    const nowMs = Date.now();
    return Math.max(0, Math.floor((nowMs - startMs) / 1000));
  }, [entry.startTime]);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(calculateElapsed);

  useEffect(() => {
    setElapsedSeconds(calculateElapsed());
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateElapsed]);

  const handleStop = useCallback(() => {
    onStop(entry.id);
  }, [onStop, entry.id]);

  return (
    <div className="timer-active-card__item p-4! bg-gradient-to-r! from-sky-50! to-indigo-50! border! border-sky-200! rounded-xl! shadow-xs! flex! flex-col! md:flex-row! items-start! md:items-center! justify-between! gap-4!">
      <div className="timer-active-card__info flex! items-start! gap-3!">
        <div className="timer-active-card__icon-box w-10! h-10! rounded-full! bg-sky-600! text-white! flex! items-center! justify-center! text-lg! animate-pulse!">
          <ClockCircleOutlined />
        </div>
        <div className="timer-active-card__meta">
          <div className="timer-active-card__employee-name font-bold! text-slate-800! text-base!">
            {entry.employeeName || 'Сотрудник'}
          </div>
          <div className="timer-active-card__task text-sm! text-slate-600! mt-0.5!">
            {entry.taskDescription}
          </div>
        </div>
      </div>

      <div className="timer-active-card__controls flex! items-center! justify-between! w-full! md:w-auto! gap-4!">
        <div className="timer-active-card__ticker font-mono! text-2xl! font-bold! text-sky-700! bg-white! px-3! py-1! rounded-lg! border! border-sky-200! shadow-xs!">
          {formatDuration(elapsedSeconds)}
        </div>

        <Button
          type="primary"
          danger
          size="large"
          icon={<PauseCircleOutlined />}
          loading={isStopping}
          onClick={handleStop}
          className="timer-active-card__btn-stop font-medium!"
        >
          Остановить
        </Button>
      </div>
    </div>
  );
};
