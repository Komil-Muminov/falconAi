import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Table } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { IEmployee } from '@/entities/employee';
import { ICreateManualEntryDto, ITimeEntry } from '@/entities/time-entry';
import { IPeriodFilterValue, PeriodFilter } from '@/features/period-filter';
import { TimeEntryManualModal } from '@/features/time-entry-manual';
import { useGetQuery, useMutationQuery } from '@/shared/api';
import { ApiRoutes, CacheKeys } from '@/shared/config';
import { EmptyState, If } from '@/shared/ui';
import { createTimeEntryColumns } from './lib';
import { ITimeEntriesWidgetProps, TEntriesFilterState } from './model';

export const TimeEntriesWidget: React.FC<ITimeEntriesWidgetProps> = ({ className = '' }) => {
  const { message } = App.useApp();
  const [filter, setFilter] = useState<TEntriesFilterState>({});
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const { data: employees = [] } = useGetQuery<IEmployee[]>({
    key: CacheKeys.EMPLOYEES,
    url: ApiRoutes.EMPLOYEES_SEARCH
  });

  const { data: entries = [], isLoading } = useGetQuery<ITimeEntry[]>({
    key: [CacheKeys.TIME_ENTRIES, filter],
    url: ApiRoutes.TIME_ENTRIES_SEARCH,
    params: {
      employeeId: filter.employeeId,
      startDate: filter.startDate,
      endDate: filter.endDate
    }
  });

  const { mutate: createManual, isPending: isCreatingManual } = useMutationQuery<
    ITimeEntry,
    ICreateManualEntryDto
  >({
    url: ApiRoutes.TIME_ENTRIES_MANUAL_CREATE,
    method: 'POST',
    invalidateKeys: [CacheKeys.TIME_ENTRIES, CacheKeys.REPORTS_SUMMARY],
    onSuccess: () => {
      message.success('Запись времени успешно сохранена');
      setIsManualModalOpen(false);
    },
    onError: (err) => {
      message.error(err.message || 'Ошибка сохранения записи');
    }
  });

  const { mutate: deleteEntry } = useMutationQuery<void, string>({
    url: (id) => ApiRoutes.TIME_ENTRIES_DELETE(id),
    method: 'DELETE',
    invalidateKeys: [CacheKeys.TIME_ENTRIES, CacheKeys.ACTIVE_TIMERS, CacheKeys.REPORTS_SUMMARY],
    onSuccess: () => {
      message.success('Запись успешно удалена');
    },
    onError: (err) => {
      message.error(err.message || 'Ошибка удаления записи');
    }
  });

  const handleDelete = useCallback(
    (id: string) => {
      deleteEntry(id);
    },
    [deleteEntry]
  );

  const handleResetFilter = useCallback(() => {
    setFilter({});
  }, []);

  const columns = useMemo(() => {
    return createTimeEntryColumns({ onDelete: handleDelete });
  }, [handleDelete]);

  return (
    <div className={`time-entries-widget__wrapper flex! flex-col! gap-5! ${className}`}>
      <div className="time-entries-widget__top-bar flex! flex-col! sm:flex-row! sm:items-center! justify-between! gap-4!">
        <div>
          <div className="flex! items-center! gap-2!">
            <h3 className="time-entries-widget__title text-lg! font-bold! text-slate-900! m-0!">
              История и журнал записей времени
            </h3>
            <span className="text-xs! font-bold! text-sky-700! bg-sky-100! px-2.5! py-0.5! rounded-full!">
              {entries.length}
            </span>
          </div>
          <p className="time-entries-widget__sub text-xs! text-slate-500! mt-1! mb-0!">
            Просмотр зафиксированных сессий сотрудников с фильтрацией по дате
          </p>
        </div>

        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={() => setIsManualModalOpen(true)}
          disabled={employees.length === 0}
          className="border-sky-300! text-sky-700! hover:bg-sky-50! font-medium! shadow-2xs!"
        >
          Внести вручную
        </Button>
      </div>

      <PeriodFilter
        employees={employees}
        value={filter}
        onChange={(val: IPeriodFilterValue) => setFilter(val)}
        onReset={handleResetFilter}
      />

      <div className="time-entries-widget__table-box bg-white! rounded-2xl! border! border-slate-200/80! shadow-xs! overflow-hidden!">
        <If condition={!isLoading && entries.length === 0}>
          <EmptyState
            title="Записи не найдены"
            description="За выбранный период или сотрудника нет зафиксированных записей времени"
          />
        </If>

        <If condition={isLoading || entries.length > 0}>
          <Table
            dataSource={entries}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 8, showSizeChanger: true }}
            className="time-entries-widget__table"
            scroll={{ x: 700 }}
          />
        </If>
      </div>

      <TimeEntryManualModal
        isOpen={isManualModalOpen}
        employees={employees}
        isSubmitting={isCreatingManual}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={createManual}
      />
    </div>
  );
};
