import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, DatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback } from 'react';
import { IPeriodFilterProps } from './model';

export const PeriodFilter: React.FC<IPeriodFilterProps> = ({
  employees,
  value,
  onChange,
  onReset
}) => {
  const handleRangeChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      if (!dates || !dates[0] || !dates[1]) {
        onChange({ ...value, startDate: undefined, endDate: undefined });
        return;
      }
      onChange({
        ...value,
        startDate: dates[0].startOf('day').toISOString(),
        endDate: dates[1].endOf('day').toISOString()
      });
    },
    [onChange, value]
  );

  const handleEmployeeChange = useCallback(
    (empId?: string) => {
      onChange({ ...value, employeeId: empId || undefined });
    },
    [onChange, value]
  );

  const handlePresetClick = useCallback(
    (preset: 'today' | 'yesterday' | 'week' | 'month' | 'all') => {
      const now = dayjs();
      if (preset === 'all') {
        onChange({ ...value, startDate: undefined, endDate: undefined });
        return;
      }
      if (preset === 'today') {
        onChange({
          ...value,
          startDate: now.startOf('day').toISOString(),
          endDate: now.endOf('day').toISOString()
        });
        return;
      }
      if (preset === 'yesterday') {
        const yesterday = now.subtract(1, 'day');
        onChange({
          ...value,
          startDate: yesterday.startOf('day').toISOString(),
          endDate: yesterday.endOf('day').toISOString()
        });
        return;
      }
      if (preset === 'week') {
        onChange({
          ...value,
          startDate: now.startOf('week').toISOString(),
          endDate: now.endOf('week').toISOString()
        });
        return;
      }
      if (preset === 'month') {
        onChange({
          ...value,
          startDate: now.startOf('month').toISOString(),
          endDate: now.endOf('month').toISOString()
        });
      }
    },
    [onChange, value]
  );

  const dateRangeValue: [Dayjs, Dayjs] | null =
    value.startDate && value.endDate ? [dayjs(value.startDate), dayjs(value.endDate)] : null;

  return (
    <div className="period-filter__container p-5! bg-white! rounded-2xl! border! border-slate-200/80! shadow-xs! flex! flex-col! gap-4!">
      <div className="period-filter__row-main flex! flex-col! md:flex-row! md:items-center! justify-between! gap-4!">
        <div className="flex! flex-wrap! items-center! gap-3! flex-1!">
          <div className="w-full! sm:w-64!">
            <Select
              allowClear
              placeholder="Фильтр по сотруднику"
              className="w-full!"
              value={value.employeeId}
              onChange={handleEmployeeChange}
              options={employees.map((emp) => ({
                value: emp.id,
                label: emp.name
              }))}
            />
          </div>

          <div className="w-full! sm:w-auto!">
            <DatePicker.RangePicker
              value={dateRangeValue}
              onChange={handleRangeChange}
              format="DD.MM.YYYY"
              placeholder={['Начало периода', 'Конец периода']}
              className="w-full!"
            />
          </div>
        </div>

        <Button
          icon={<ClearOutlined />}
          onClick={onReset}
          className="period-filter__reset-btn border-slate-300! text-slate-600! hover:text-slate-900! self-start! md:self-auto!"
        >
          Сбросить
        </Button>
      </div>

      <div className="period-filter__row-presets flex! items-center! gap-2! flex-wrap! pt-3! border-t! border-slate-100!">
        <span className="text-xs! font-semibold! text-slate-400! flex! items-center! gap-1! mr-1!">
          <FilterOutlined /> Быстрый выбор:
        </span>
        <Button size="small" onClick={() => handlePresetClick('today')} className="rounded-md!">
          Сегодня
        </Button>
        <Button size="small" onClick={() => handlePresetClick('yesterday')} className="rounded-md!">
          Вчера
        </Button>
        <Button size="small" onClick={() => handlePresetClick('week')} className="rounded-md!">
          Эта неделя
        </Button>
        <Button size="small" onClick={() => handlePresetClick('month')} className="rounded-md!">
          Этот месяц
        </Button>
        <Button size="small" onClick={() => handlePresetClick('all')} className="rounded-md!">
          За всё время
        </Button>
      </div>
    </div>
  );
};
