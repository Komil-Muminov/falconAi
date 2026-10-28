import { Badge, Progress, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import { IEmployeeReportSummary } from '@/entities/report';
import { formatDurationHuman } from '@/shared/lib';

export const createReportColumns = (
  maxDuration: number
): ColumnsType<IEmployeeReportSummary> => [
  {
    title: 'Сотрудник',
    dataIndex: 'employeeName',
    key: 'employeeName',
    render: (name: string, record: IEmployeeReportSummary) => (
      <div>
        <div className="font-semibold! text-slate-800! text-sm!">{name}</div>
        <div className="text-xs! text-slate-500! mt-0.5!">{record.position}</div>
      </div>
    )
  },
  {
    title: 'Отдел',
    dataIndex: 'department',
    key: 'department',
    render: (dep: string) => (
      <Tag color="blue" className="m-0! text-xs!">
        {dep}
      </Tag>
    )
  },
  {
    title: 'Общее рабочее время',
    dataIndex: 'totalDurationSeconds',
    key: 'totalDurationSeconds',
    sorter: (a, b) => a.totalDurationSeconds - b.totalDurationSeconds,
    defaultSortOrder: 'descend',
    render: (seconds: number) => (
      <span className="font-mono! font-bold! text-sky-700! text-sm!">
        {formatDurationHuman(seconds)}
      </span>
    )
  },
  {
    title: 'Доля рабочего времени',
    key: 'progress',
    render: (_: unknown, record: IEmployeeReportSummary) => {
      const percent =
        maxDuration > 0
          ? Math.round((record.totalDurationSeconds / maxDuration) * 100)
          : 0;
      return (
        <div className="w-32!">
          <Progress percent={percent} size="small" status="active" strokeColor="#0284c7" />
        </div>
      );
    }
  },
  {
    title: 'Задач выполнено',
    dataIndex: 'completedTasksCount',
    key: 'completedTasksCount',
    align: 'center',
    sorter: (a, b) => a.completedTasksCount - b.completedTasksCount,
    render: (count: number) => (
      <Tag color="cyan" className="font-semibold! text-xs!">
        {count}
      </Tag>
    )
  },
  {
    title: 'Статус таймера',
    dataIndex: 'hasActiveTimer',
    key: 'hasActiveTimer',
    render: (hasActive: boolean) => (
      hasActive ? (
        <Badge status="processing" text={<span className="text-emerald-600! font-medium! text-xs!">Работает</span>} />
      ) : (
        <Badge status="default" text={<span className="text-slate-400! text-xs!">Не активен</span>} />
      )
    )
  }
];
