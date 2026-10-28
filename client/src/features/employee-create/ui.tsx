import { Button, Form, Modal } from 'antd';
import React, { useCallback } from 'react';
import { IEmployeeCreateProps, TEmployeeFormState } from './model';
import { RenderEmployeeFields } from './ui/renderFields';

export const EmployeeCreateModal: React.FC<IEmployeeCreateProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm<TEmployeeFormState>();

  const handleFinish = useCallback(
    (values: TEmployeeFormState) => {
      onSubmit(values);
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
      title="Добавление нового сотрудника"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
      className="employee-modal__wrapper"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="employee-modal__form mt-4!"
      >
        <RenderEmployeeFields />
        <div className="employee-modal__actions flex! justify-end! gap-3! mt-6!">
          <Button onClick={handleCancel}>Отмена</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-sky-600! hover:bg-sky-700!"
          >
            Добавить
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
