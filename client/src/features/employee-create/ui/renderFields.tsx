import { Form, Input } from 'antd';
import React from 'react';

export const RenderEmployeeFields: React.FC = () => {
  return (
    <div className="employee-form__fields flex! flex-col! gap-3!">
      <Form.Item
        name="name"
        label="ФИО сотрудника"
        rules={[{ required: true, message: 'Введите ФИО сотрудника' }]}
      >
        <Input placeholder="Например: Иван Иванов" size="large" />
      </Form.Item>

      <Form.Item
        name="position"
        label="Должность"
        rules={[{ required: true, message: 'Введите должность' }]}
      >
        <Input placeholder="Например: Frontend Разработчик" size="large" />
      </Form.Item>

      <Form.Item
        name="department"
        label="Отдел / Команда"
        rules={[{ required: true, message: 'Введите отдел' }]}
      >
        <Input placeholder="Например: IT департамент" size="large" />
      </Form.Item>
    </div>
  );
};
