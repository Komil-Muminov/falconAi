import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import { Card, Table } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { IEmployee } from '@/entities/employee';
import { IEmployeeReportSummary } from '@/entities/report';
import { IPeriodFilterValue, PeriodFilter } from '@/features/period-filter';
import { useGetQuery } from '@/shared/api';
import { ApiRoutes, CacheKeys } from '@/shared/config';
import { formatDurationHuman } from '@/shared/lib';
import { EmptyState, If } from '@/shared/ui';
import { createReportColumns } from './lib';
import { IReportsWidgetProps, TReportFilterState } from './model';

export const ReportsWidget: React.FC<IReportsWidgetProps> = ({ className = '' }) => {
  const [filter, setFilter] = useState<TReportFilterState>({});

  const { data: employees = [] } = useGetQuery<IEmployee[]>({
    key: CacheKeys.EMPLOYEES,
    url: ApiRoutes.EMPLOYEES_SEARCH
  });

  const { data: reports = [], isLoading } = useGetQuery<IEmployeeReportSummary[]>({
    key: [CacheKeys.REPORTS_SUMMARY, filter],
    url: ApiRoutes.REPORTS_SUMMARY,
    params: {
      startDate: filter.startDate,
      endDate: filter.endDate,
      employeeId: filter.employeeId
    }
  });

  const totals = useMemo(() => {
    return reports.reduce(
      (acc, item) => ({
        totalSeconds: acc.totalSeconds + item.totalDurationSeconds,
        totalTasks: acc.totalTasks + item.completedTasksCount,
        activeCount: acc.activeCount + (item.hasActiveTimer ? 1 : 0)
      }),
      { totalSeconds: 0, totalTasks: 0, activeCount: 0 }
    );
  }, [reports]);

  const maxDuration = useMemo(() => {
    return Math.max(...reports.map((r) => r.totalDurationSeconds), 0);
  }, [reports]);

  const columns = useMemo(() => {
    return createReportColumns(maxDuration);
  }, [maxDuration]);

  const handleResetFilter = useCallback(() => {
    setFilter({});
  }, []);

  const isReportEmpty = !isLoading && (reports.length === 0 || totals.totalSeconds === 0);

  return (
    <div className={`reports-widget__container flex! flex-col! gap-6! ${className}`}>
      <div className="reports-widget__header">
        <h2 className="reports-widget__title text-2xl! font-bold! text-slate-800! m-0!">
          Аналитика и учёт рабочего времени
        </h2>
        <p className="reports-widget__subtitle text-sm! text-slate-500! mt-1! mb-0!">
          Сводный отчёт отработанного времени сотрудников за выбранный диапазон
        </p>
      </div>

      <PeriodFilter
        employees={employees}
        value={filter}
        onChange={(val: IPeriodFilterValue) => setFilter(val)}
        onReset={handleResetFilter}
      />

      <div className="reports-widget__kpi-grid grid! grid-cols-1! sm:grid-cols-3! gap-4!">
        <Card className="rounded-xl! border-slate-200! shadow-xs!">
          <div className="flex! items-center! gap-3!">
            <div className="w-10! h-10! rounded-lg! bg-sky-100! text-sky-700! flex! items-center! justify-center! text-lg!">
              <ClockCircleOutlined />
            </div>
            <div>
              <div className="text-xs! text-slate-500! font-medium!">Общее время за период</div>
              <div className="text-xl! font-bold! text-slate-800! mt-0.5!">
                {formatDurationHuman(totals.totalSeconds)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl! border-slate-200! shadow-xs!">
          <div className="flex! items-center! gap-3!">
            <div className="w-10! h-10! rounded-lg! bg-emerald-100! text-emerald-700! flex! items-center! justify-center! text-lg!">
              <CheckCircleOutlined />
            </div>
            <div>
              <div className="text-xs! text-slate-500! font-medium!">Выполнено задач</div>
              <div className="text-xl! font-bold! text-slate-800! mt-0.5!">
                {totals.totalTasks}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl! border-slate-200! shadow-xs!">
          <div className="flex! items-center! gap-3!">
            <div className="w-10! h-10! rounded-lg! bg-amber-100! text-amber-700! flex! items-center! justify-center! text-lg!">
              <FireOutlined />
            </div>
            <div>
              <div className="text-xs! text-slate-500! font-medium!">Активных таймеров сейчас</div>
              <div className="text-xl! font-bold! text-slate-800! mt-0.5!">
                {totals.activeCount}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="reports-widget__table-box bg-white! rounded-xl! border! border-slate-200! shadow-xs! overflow-hidden!">
        <If condition={isReportEmpty}>
          <EmptyState
            title="Пустой отчёт"
            description="За выбранный период времени нет данных об отработанных часах. Попробуйте выбрать другой диапазон дат или сбросить фильтр."
          />
        </If>

        <If condition={!isReportEmpty}>
          <Table
            dataSource={reports}
            columns={columns}
            rowKey="employeeId"
            loading={isLoading}
            pagination={false}
            scroll={{ x: 700 }}
          />
        </If>
      </div>
    </div>
  );
};
