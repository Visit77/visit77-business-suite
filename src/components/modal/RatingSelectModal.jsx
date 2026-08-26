import React, { useEffect, useState } from "react";
import { Modal, Form, Radio, Button } from "antd";
import { ratingOption } from "../../utils/utils";

const RatingSelectModal = ({
  open,
  onClose,
  onSubmit,
  initialSelected = "zero", // Default value
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        rating: initialSelected,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialSelected, form]);

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(values.rating);
      }
      onClose();
    } catch (err) {
      console.error("Failed to submit selected rating:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div className="text-lg font-bold text-slate-800">
          Select Hotel Rating
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-2"
      >
        <Form.Item
          name="rating"
          label={
            <span className="font-medium text-slate-600">Choose Rating</span>
          }
        >
          <Radio.Group className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-h-80 overflow-y-auto p-1">
              {ratingOption.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:border-primary/50 transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-100/50"
                >
                  <Radio value={option.value} />
                  <span className="font-semibold text-sm text-slate-800 ml-2">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </Radio.Group>
        </Form.Item>

        <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
          <Button
            onClick={onClose}
            className="rounded-xl px-5 h-10 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className="bg-primary hover:bg-primary-container rounded-xl px-6 h-10 font-medium"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RatingSelectModal;
