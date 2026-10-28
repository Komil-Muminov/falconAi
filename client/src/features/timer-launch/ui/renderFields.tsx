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
    <div className="timer-launch__fields grid! grid-cols-1! md:grid-cols-12! gap-3! items-start!">
      <div className="timer-launch__col-employee col-span-12! md:col-span-4!">
        <Form.Item
          name="employeeId"
          rules={[{ required: true, message: 'Выберите сотрудника' }]}
          className="m-0!"
        >
          <Select
            placeholder="Выберите сотрудника"
            size="large"
            className="w-full!"
            showSearch
            optionFilterProp="label"
            options={employees.map((emp) => ({
              value: emp.id,
              label: `${emp.name} (${emp.position})`,
              disabled: activeEmployeeIds.includes(emp.id)
            }))}
          />
        </Form.Item>
      </div>

      <div className="timer-launch__col-task col-span-12! md:col-span-8!">
        <Form.Item
          name="taskDescription"
          rules={[{ required: true, message: 'Введите описание задачи' }]}
          className="m-0!"
        >
          <Input
            placeholder="Какую задачу вы сейчас выполняете?"
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
            message="Внимание: у этого сотрудника уже есть запущенный таймер. Повторный запуск заблокирован до остановки текущего таймера."
            className="mt-2!"
          />
        </If>
      </div>
    </div>
  );
};
