import React, { useEffect } from "react";
import { Modal, Radio, Input, Form, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ChargeTaxModal = ({
  visible,
  onClose,
  onSave,
  title,
  initialData,
  charge_type,
  charge_kind,
}) => {
  const [form] = Form.useForm();
  const chargeType = Form.useWatch("mode", form);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          mode: initialData.mode || "included",
          value: initialData.value || "0",
        });
      } else {
        form.setFieldsValue({
          mode: "included",
          value: "0",
          calculation_basis: "per_booking_per_night",
        });
      }
    }
  }, [initialData, visible, form]);

  const handleFinish = (values) => {
    onSave({ ...values, charge_type, charge_kind });
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      className="top-auto bottom-0 m-0 p-0 max-w-full sm:max-w-md sm:relative sm:bottom-auto"
      title={title}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item name="mode" className="mb-4">
          <Radio.Group className="w-full space-y-4 flex flex-col">
            <Radio value="included" className="text-base font-medium">
              Included
            </Radio>

            <div>
              <Radio value="percentage" className="text-base font-medium mb-2">
                Percentage on Subtotal
              </Radio>
              {chargeType === "percentage" && (
                <div className="ml-7 mt-2">
                  <Form.Item name="value" noStyle>
                    <Input
                      suffix="%"
                      className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800 font-semibold"
                    />
                  </Form.Item>
                </div>
              )}
            </div>

            <div>
              <Radio value="fixed" className="text-base font-medium mb-2">
                Fix Amount
              </Radio>

              {chargeType === "fixed" && (
                <div className="ml-7 mt-3 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium!">
                      MMK
                    </span>
                    <Form.Item name="value" noStyle>
                      <Input className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800 font-semibold" />
                    </Form.Item>
                  </div>

                  {/* Calculation Basis Radio/Checkbox Options */}
                  <Form.Item name="calculation_basis" className="pt-2 mb-0">
                    <Radio.Group className="space-y-3 flex flex-col">
                      <Radio
                        value="per_booking_per_night"
                        className="font-medium text-gray-700"
                      >
                        Per Booking / Night
                      </Radio>
                      <Radio
                        value="per_guest_per_night"
                        className="font-medium text-gray-700"
                      >
                        Per Guest / Night
                      </Radio>
                      <Radio
                        value="per_room_per_night"
                        className="font-medium text-gray-700"
                      >
                        Per Room / Night
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}
            </div>
          </Radio.Group>
        </Form.Item>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <Button
            onClick={onClose}
            className="h-12 rounded-xl bg-gray-100 border-0 text-gray-700 font-semibold hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="h-12 rounded-xl bg-[#4f46e5] hover:bg-[#3730a3] text-white font-semibold"
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChargeTaxModal;
