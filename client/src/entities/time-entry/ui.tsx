import { Badge } from 'antd';
import React from 'react';
import { TTimeEntryStatus } from './model';

interface IProps {
  status: TTimeEntryStatus;
}

export const StatusBadge: React.FC<IProps> = ({ status }) => {
  return (
    <div className="status-badge__wrapper inline-flex! items-center!">
      {status === 'running' ? (
        <Badge
          status="processing"
          text={<span className="status-badge__text font-medium! text-emerald-600!">Активен</span>}
        />
      ) : (
        <Badge
          status="default"
          text={<span className="status-badge__text text-slate-500!">Завершён</span>}
        />
      )}
    </div>
  );
};
