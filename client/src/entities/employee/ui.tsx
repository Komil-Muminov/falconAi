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
    <div className="employee-card__container p-5! bg-white! rounded-2xl! border! border-slate-200/80! shadow-xs! transition-colors! duration-200! hover:border-sky-300! flex! items-center! justify-between!">
      <div className="employee-card__content flex! items-center! gap-3.5!">
        <div className="employee-card__avatar w-11! h-11! rounded-xl! bg-gradient-to-br! from-sky-500! to-indigo-600! text-white! flex! items-center! justify-center! text-lg! font-bold! shadow-xs!">
          <UserOutlined />
        </div>
        <div className="employee-card__meta">
          <div className="employee-card__name font-bold! text-slate-900! text-base!">
            {employee.name}
          </div>
          <div className="employee-card__sub flex! items-center! gap-2! mt-1!">
            <span className="employee-card__position text-xs! text-slate-500! font-medium!">
              {employee.position}
            </span>
            <Tag color="cyan" className="employee-card__tag m-0! text-xs! font-medium!">
              {employee.department}
            </Tag>
          </div>
        </div>
      </div>
      <div className="employee-card__action">{action}</div>
    </div>
  );
};
