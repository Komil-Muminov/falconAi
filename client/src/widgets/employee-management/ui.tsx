import { DeleteOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { App, Button, Popconfirm, Spin } from 'antd';
import React, { useCallback, useState } from 'react';
import { EmployeeCard, ICreateEmployeeDto, IEmployee } from '@/entities/employee';
import { EmployeeCreateModal } from '@/features/employee-create';
import { useGetQuery, useMutationQuery } from '@/shared/api';
import { ApiRoutes, CacheKeys } from '@/shared/config';
import { EmptyState, If, Tooltip } from '@/shared/ui';
import { IEmployeeManagementProps } from './model';

export const EmployeeManagementWidget: React.FC<IEmployeeManagementProps> = ({
  className = ''
}) => {
  const { message } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: employees = [], isLoading } = useGetQuery<IEmployee[]>({
    key: CacheKeys.EMPLOYEES,
    url: ApiRoutes.EMPLOYEES_SEARCH
  });

  const { mutate: createEmployee, isPending: isCreating } = useMutationQuery<
    IEmployee,
    ICreateEmployeeDto
  >({
    url: ApiRoutes.EMPLOYEES_CREATE,
    method: 'POST',
    invalidateKeys: [CacheKeys.EMPLOYEES, CacheKeys.REPORTS_SUMMARY],
    onSuccess: (data) => {
      message.success(`Сотрудник ${data.name} успешно добавлен!`);
      setIsModalOpen(false);
    },
    onError: (err) => {
      message.error(err.message || 'Ошибка добавления сотрудника');
    }
  });

  const { mutate: deleteEmployee } = useMutationQuery<void, string>({
    url: (id) => ApiRoutes.EMPLOYEES_DELETE(id),
    method: 'DELETE',
    invalidateKeys: [
      CacheKeys.EMPLOYEES,
      CacheKeys.ACTIVE_TIMERS,
      CacheKeys.TIME_ENTRIES,
      CacheKeys.REPORTS_SUMMARY
    ],
    onSuccess: () => {
      message.success('Сотрудник удален');
    },
    onError: (err) => {
      message.error(err.message || 'Ошибка удаления сотрудника');
    }
  });

  const handleDelete = useCallback(
    (id: string) => {
      deleteEmployee(id);
    },
    [deleteEmployee]
  );

  return (
    <div className={`employee-management__container flex! flex-col! gap-6! ${className}`}>
      <div className="employee-management__header flex! flex-col! sm:flex-row! sm:items-center! justify-between! gap-4!">
        <div>
          <div className="flex! items-center! gap-2!">
            <h2 className="employee-management__title text-2xl! font-bold! text-slate-900! m-0!">
              Сотрудники компании
            </h2>
            <span className="text-xs! font-bold! text-sky-700! bg-sky-100! px-2.5! py-0.5! rounded-full!">
              {employees.length}
            </span>
          </div>
          <p className="employee-management__subtitle text-sm! text-slate-500! mt-1! mb-0!">
            Управление персоналом, должностями и закреплёнными отделами
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600! hover:bg-sky-700! font-semibold! px-5! h-11! shadow-sm!"
        >
          Добавить сотрудника
        </Button>
      </div>

      <If condition={isLoading}>
        <div className="employee-management__loader flex! justify-center! py-16!">
          <Spin size="large" />
        </div>
      </If>

      <If condition={!isLoading && employees.length === 0}>
        <EmptyState
          title="Сотрудников пока нет"
          description="Добавьте первого сотрудника, чтобы начать отслеживание рабочего времени"
          action={
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-600! mt-3!"
            >
              Добавить первого сотрудника
            </Button>
          }
        />
      </If>

      <If condition={!isLoading && employees.length > 0}>
        <div className="employee-management__grid grid! grid-cols-1! md:grid-cols-2! lg:grid-cols-3! gap-4!">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              action={
                <Popconfirm
                  title="Удалить сотрудника?"
                  description="Все связанные записи времени будут также удалены."
                  onConfirm={() => handleDelete(emp.id)}
                  okText="Удалить"
                  cancelText="Отмена"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Удалить сотрудника">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className="hover:bg-red-50!"
                    />
                  </Tooltip>
                </Popconfirm>
              }
            />
          ))}
        </div>
      </If>

      <EmployeeCreateModal
        isOpen={isModalOpen}
        isSubmitting={isCreating}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createEmployee}
      />
    </div>
  );
};
