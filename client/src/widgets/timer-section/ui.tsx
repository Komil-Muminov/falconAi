import { App } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { IEmployee } from '@/entities/employee';
import { IStartTimerDto, ITimeEntry } from '@/entities/time-entry';
import { TimerActiveCard } from '@/features/timer-active-card';
import { TimerLaunchForm } from '@/features/timer-launch';
import { useGetQuery, useMutationQuery } from '@/shared/api';
import { ApiRoutes, CacheKeys } from '@/shared/config';
import { If } from '@/shared/ui';
import { ITimerSectionProps } from './model';

export const TimerSectionWidget: React.FC<ITimerSectionProps> = ({ className = '' }) => {
  const { message } = App.useApp();

  const { data: employees = [] } = useGetQuery<IEmployee[]>({
    key: CacheKeys.EMPLOYEES,
    url: ApiRoutes.EMPLOYEES_SEARCH
  });

  const { data: activeTimers = [] } = useGetQuery<ITimeEntry[]>({
    key: CacheKeys.ACTIVE_TIMERS,
    url: ApiRoutes.TIME_ENTRIES_ACTIVE,
    refetchInterval: 5000
  });

  const { mutate: startTimer, isPending: isStarting } = useMutationQuery<ITimeEntry, IStartTimerDto>({
    url: ApiRoutes.TIME_ENTRIES_START,
    method: 'POST',
    invalidateKeys: [CacheKeys.ACTIVE_TIMERS, CacheKeys.TIME_ENTRIES, CacheKeys.REPORTS_SUMMARY],
    onSuccess: () => {
      message.success('Таймер успешно запущен!');
    },
    onError: (err) => {
      message.error(err.message || 'Ошибка запуска таймера');
    }
  });

  const { mutate: stopTimer, isPending: isStopping } = useMutationQuery<ITimeEntry, string>({
    url: (id) => ApiRoutes.TIME_ENTRIES_STOP(id),
    method: 'PATCH',
    invalidateKeys: [CacheKeys.ACTIVE_TIMERS, CacheKeys.TIME_ENTRIES, CacheKeys.REPORTS_SUMMARY],
    onSuccess: (data) => {
      message.success(`Таймер остановлен! Задача: "${data.taskDescription}"`);
    },
    onError: (err) => {
      message.error(err.message || 'Ошибка остановки таймера');
    }
  });

  const activeEmployeeIds = useMemo(() => {
    return activeTimers.map((t) => t.employeeId);
  }, [activeTimers]);

  const handleStart = useCallback(
    (dto: IStartTimerDto) => {
      startTimer(dto);
    },
    [startTimer]
  );

  const handleStop = useCallback(
    (id: string) => {
      stopTimer(id);
    },
    [stopTimer]
  );

  return (
    <section className={`timer-section__container flex! flex-col! gap-6! ${className}`}>
      <TimerLaunchForm
        employees={employees}
        activeEmployeeIds={activeEmployeeIds}
        isLoading={isStarting}
        onStart={handleStart}
      />

      <If condition={activeTimers.length > 0}>
        <div className="timer-section__active-block p-5! bg-white! rounded-xl! border! border-sky-100! shadow-xs!">
          <div className="timer-section__active-header flex! items-center! justify-between! mb-3!">
            <h4 className="timer-section__active-title text-base! font-bold! text-slate-800! m-0!">
              Активные таймеры прямо сейчас ({activeTimers.length})
            </h4>
            <span className="timer-section__active-badge text-xs! font-medium! text-emerald-600! bg-emerald-50! px-2! py-0.5! rounded-full! border! border-emerald-200!">
              в процессе
            </span>
          </div>

          <div className="timer-section__active-list flex! flex-col! gap-3!">
            {activeTimers.map((entry) => (
              <TimerActiveCard
                key={entry.id}
                entry={entry}
                isStopping={isStopping}
                onStop={handleStop}
              />
            ))}
          </div>
        </div>
      </If>
    </section>
  );
};
