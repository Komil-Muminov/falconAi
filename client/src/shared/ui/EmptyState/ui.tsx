import { Empty } from 'antd';
import React from 'react';

interface IProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<IProps> = ({
  title = 'Нет данных',
  description = 'За выбранный период записи отсутствуют',
  action
}) => {
  return (
    <div className="empty-state__container flex! flex-col! items-center! justify-center! p-8! text-center! bg-white! rounded-xl! border! border-slate-200!">
      <Empty
        description={
          <div className="empty-state__description mt-2!">
            <div className="empty-state__title font-semibold! text-slate-700! text-base!">
              {title}
            </div>
            <div className="empty-state__text text-slate-500! text-sm! mt-1!">
              {description}
            </div>
          </div>
        }
      >
        {action}
      </Empty>
    </div>
  );
};
