import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import { ITimeEntry, StatusBadge } from '@/entities/time-entry';
import { formatDateTime, formatDurationHuman } from '@/shared/lib';
import { Tooltip } from '@/shared/ui';

interface ICreateColumnsParams {
  onDelete: (id: string) => void;
}

export const createTimeEntryColumns = ({
  onDelete
}: ICreateColumnsParams): ColumnsType<ITimeEntry> => [
  {
    title: 'Сотрудник',
    dataIndex: 'employeeName',
    key: 'employeeName',
    render: (name: string) => (
      <span className="font-semibold! text-slate-800!">{name || '—'}</span>
    )
  },
  {
    title: 'Описание задачи',
    dataIndex: 'taskDescription',
    key: 'taskDescription',
    render: (desc: string) => (
      <span className="text-slate-700! font-normal!">{desc}</span>
    )
  },
  {
    title: 'Начало',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (val: string) => (
      <span className="text-slate-500! text-xs! font-mono!">{formatDateTime(val)}</span>
    )
  },
  {
    title: 'Окончание',
    dataIndex: 'endTime',
    key: 'endTime',
    render: (val: string | null) => (
      <span className="text-slate-500! text-xs! font-mono!">{formatDateTime(val)}</span>
    )
  },
  {
    title: 'Длительность',
    dataIndex: 'durationSeconds',
    key: 'durationSeconds',
    render: (seconds: number, record: ITimeEntry) => (
      <span className="font-mono! font-bold! text-slate-700!">
        {record.status === 'running' ? 'идёт отсчет...' : formatDurationHuman(seconds)}
      </span>
    )
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: ITimeEntry['status']) => <StatusBadge status={status} />
  },
  {
    title: 'Действия',
    key: 'actions',
    align: 'right',
    render: (_: unknown, record: ITimeEntry) => (
      <Popconfirm
        title="Удалить запись?"
        description="Вы уверены, что хотите удалить эту запись о времени?"
        onConfirm={() => onDelete(record.id)}
        okText="Да"
        cancelText="Нет"
      >
        <Tooltip title="Удалить запись">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            className="hover:bg-red-50!"
          />
        </Tooltip>
      </Popconfirm>
    )
  }
];
