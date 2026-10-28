import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import React, { useCallback } from 'react';
import { ITimerLaunchProps, TTimerLaunchFormState } from './model';
import { RenderTimerFields } from './ui/renderFields';

export const TimerLaunchForm: React.FC<ITimerLaunchProps> = ({
  employees,
  activeEmployeeIds,
  isLoading,
  onStart
}) => {
  const [form] = Form.useForm<TTimerLaunchFormState>();
  const selectedEmployeeId = Form.useWatch('employeeId', form);

  const handleFinish = useCallback(
    (values: TTimerLaunchFormState) => {
      onStart(values);
      form.resetFields(['taskDescription']);
    },
    [onStart, form]
  );

  const isSelectedEmployeeBusy = Boolean(
    selectedEmployeeId && activeEmployeeIds.includes(selectedEmployeeId)
  );

  return (
    <div className="timer-launch__container p-6! bg-white! rounded-2xl! border! border-slate-200/80! shadow-xs!">
      <div className="timer-launch__header flex! items-center! justify-between! mb-5!">
        <div>
          <h3 className="timer-launch__title text-lg! font-bold! text-slate-900! m-0!">
            Быстрый запуск таймера
          </h3>
          <p className="timer-launch__subtitle text-xs! text-slate-500! mt-1! mb-0!">
            Выберите сотрудника, укажите задачу и начните отсчёт рабочего времени
          </p>
        </div>
      </div>

      <Form form={form} onFinish={handleFinish} layout="vertical" className="timer-launch__form">
        <RenderTimerFields
          employees={employees}
          activeEmployeeIds={activeEmployeeIds}
          selectedEmployeeId={selectedEmployeeId}
        />

        <div className="timer-launch__submit-wrapper flex! justify-end! mt-5!">
          <Button
            type="primary"
            htmlType="submit"
            icon={<CaretRightOutlined />}
            size="large"
            loading={isLoading}
            disabled={isSelectedEmployeeBusy || employees.length === 0}
            className="bg-emerald-600! hover:bg-emerald-700! font-semibold! px-7! h-11! shadow-sm!"
          >
            Запустить таймер
          </Button>
        </div>
      </Form>
    </div>
  );
};
