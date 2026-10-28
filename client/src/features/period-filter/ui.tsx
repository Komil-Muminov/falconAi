import { ClearOutlined } from '@ant-design/icons';
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
    <div className="period-filter__container p-4! bg-white! rounded-xl! border! border-slate-200! shadow-xs! flex! flex-col! gap-3!">
      <div className="period-filter__controls flex! flex-wrap! items-center! gap-3!">
        <div className="period-filter__employee-select w-64!">
          <Select
            allowClear
            placeholder="Все сотрудники"
            className="w-full!"
            value={value.employeeId}
            onChange={handleEmployeeChange}
            options={employees.map((emp) => ({
              value: emp.id,
              label: emp.name
            }))}
          />
        </div>

        <div className="period-filter__dates">
          <DatePicker.RangePicker
            value={dateRangeValue}
            onChange={handleRangeChange}
            format="DD.MM.YYYY"
            placeholder={['Начало периода', 'Конец периода']}
          />
        </div>

        <div className="period-filter__presets flex! items-center! gap-1.5!">
          <Button size="small" onClick={() => handlePresetClick('today')}>
            Сегодня
          </Button>
          <Button size="small" onClick={() => handlePresetClick('yesterday')}>
            Вчера
          </Button>
          <Button size="small" onClick={() => handlePresetClick('week')}>
            Неделя
          </Button>
          <Button size="small" onClick={() => handlePresetClick('month')}>
            Месяц
          </Button>
          <Button size="small" onClick={() => handlePresetClick('all')}>
            За всё время
          </Button>
        </div>

        <Button
          icon={<ClearOutlined />}
          onClick={onReset}
          className="period-filter__reset-btn ml-auto!"
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
};
