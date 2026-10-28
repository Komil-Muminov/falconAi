import { Button, Form, Modal } from 'antd';
import React, { useCallback } from 'react';
import { IManualEntryFormValues, ITimeEntryManualProps } from './model';
import { RenderManualFields } from './ui/renderFields';

export const TimeEntryManualModal: React.FC<ITimeEntryManualProps> = ({
  isOpen,
  employees,
  isSubmitting,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm<IManualEntryFormValues>();

  const handleFinish = useCallback(
    (values: IManualEntryFormValues) => {
      const [start, end] = values.timeRange;
      onSubmit({
        employeeId: values.employeeId,
        taskDescription: values.taskDescription,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      });
      form.resetFields();
    },
    [onSubmit, form]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  return (
    <Modal
      title="Ручное добавление рабочего времени"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
      className="manual-entry-modal__container"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="manual-entry-modal__form mt-4!"
      >
        <RenderManualFields employees={employees} />
        <div className="manual-entry-modal__actions flex! justify-end! gap-3! mt-6!">
          <Button onClick={handleCancel}>Отмена</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-sky-600! hover:bg-sky-700!"
          >
            Сохранить запись
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
