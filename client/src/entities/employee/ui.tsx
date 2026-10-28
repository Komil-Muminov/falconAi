import { UserOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import { IEmployee } from './model';

interface IProps {
  employee: IEmployee;
  action?: React.ReactNode;
}

export const EmployeeCard: React.FC<IProps> = ({ employee, action }) => {
  return (
    <div className="employee-card__container p-4! bg-white! rounded-xl! border! border-slate-200! shadow-xs! transition-all! duration-200! hover:border-sky-300! hover:shadow-md! flex! items-center! justify-between!">
      <div className="employee-card__content flex! items-center! gap-3!">
        <div className="employee-card__avatar w-10! h-10! rounded-full! bg-sky-100! text-sky-700! flex! items-center! justify-center! text-lg! font-bold!">
          <UserOutlined />
        </div>
        <div className="employee-card__meta">
          <div className="employee-card__name font-semibold! text-slate-800! text-base!">
            {employee.name}
          </div>
          <div className="employee-card__sub flex! items-center! gap-2! mt-1!">
            <span className="employee-card__position text-xs! text-slate-500!">
              {employee.position}
            </span>
            <Tag color="blue" className="employee-card__tag m-0! text-xs!">
              {employee.department}
            </Tag>
          </div>
        </div>
      </div>
      <div className="employee-card__action">{action}</div>
    </div>
  );
};
