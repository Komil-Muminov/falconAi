import { DatePicker, Form, Input, Select } from 'antd';
import React from 'react';
import { IEmployee } from '@/entities/employee';

interface IProps {
  employees: IEmployee[];
}

export const RenderManualFields: React.FC<IProps> = ({ employees }) => {
  return (
    <div className="manual-entry__fields flex! flex-col! gap-3!">
      <Form.Item
        name="employeeId"
        label="Сотрудник"
        rules={[{ required: true, message: 'Выберите сотрудника' }]}
      >
        <Select
          placeholder="Выберите сотрудника"
          size="large"
          options={employees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} (${emp.position})`
          }))}
        />
      </Form.Item>

      <Form.Item
        name="taskDescription"
        label="Описание задачи"
        rules={[{ required: true, message: 'Укажите задачу' }]}
      >
        <Input placeholder="Например: Рефакторинг модуля авторизации" size="large" />
      </Form.Item>

      <Form.Item
        name="timeRange"
        label="Период работы (Начало — Окончание)"
        rules={[{ required: true, message: 'Укажите время начала и окончания' }]}
      >
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm' }}
          format="DD.MM.YYYY HH:mm"
          size="large"
          className="w-full!"
        />
      </Form.Item>
    </div>
  );
};
