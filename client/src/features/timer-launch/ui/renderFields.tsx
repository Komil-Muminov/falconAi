import { Alert, Form, Input, Select } from 'antd';
import React from 'react';
import { IEmployee } from '@/entities/employee';
import { If } from '@/shared/ui';

interface IProps {
  employees: IEmployee[];
  activeEmployeeIds: string[];
  selectedEmployeeId?: string;
}

export const RenderTimerFields: React.FC<IProps> = ({
  employees,
  activeEmployeeIds,
  selectedEmployeeId
}) => {
  const isSelectedEmployeeBusy = Boolean(
    selectedEmployeeId && activeEmployeeIds.includes(selectedEmployeeId)
  );

  return (
    <div className="timer-launch__fields grid! grid-cols-1! md:grid-cols-12! gap-4! items-start!">
      <div className="timer-launch__col-employee col-span-12! md:col-span-5!">
        <Form.Item
          name="employeeId"
          label={<span className="font-semibold! text-slate-700!">Сотрудник</span>}
          rules={[{ required: true, message: 'Выберите сотрудника' }]}
          className="m-0!"
        >
          <Select
            placeholder="Выберите сотрудника из списка"
            size="large"
            className="w-full!"
            showSearch
            optionFilterProp="label"
            options={employees.map((emp) => ({
              value: emp.id,
              label: `${emp.name} — ${emp.position}`,
              disabled: activeEmployeeIds.includes(emp.id)
            }))}
          />
        </Form.Item>
      </div>

      <div className="timer-launch__col-task col-span-12! md:col-span-7!">
        <Form.Item
          name="taskDescription"
          label={<span className="font-semibold! text-slate-700!">Описание задачи</span>}
          rules={[{ required: true, message: 'Введите описание задачи' }]}
          className="m-0!"
        >
          <Input
            placeholder="Например: Разработка фичи авторизации или созвон"
            size="large"
            className="w-full!"
          />
        </Form.Item>
      </div>

      <div className="timer-launch__alert-wrapper col-span-12!">
        <If condition={isSelectedEmployeeBusy}>
          <Alert
            type="warning"
            showIcon
            message="Внимание: у сотрудника уже запущен активный таймер. Завершите текущую задачу перед стартом новой."
            className="mt-2! rounded-lg!"
          />
        </If>
      </div>
    </div>
  );
};
