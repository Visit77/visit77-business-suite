import React, { useEffect } from "react";
import { Modal, Input, Radio, Form, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const OtherChargeModal = ({ visible, onClose, onSave, title, initialData }) => {
  const [form] = Form.useForm();
  const chargeType = Form.useWatch("mode", form);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        // Edit ပြုလုပ်ချိန်တွင် တည်ရှိပြီးသား အချက်အလက်များ ဖြည့်ပေးမည်
        form.setFieldsValue({
          title: initialData.title || "",
          mode: initialData.mode || "percentage",
          value: initialData.value || "0",
          calculation_basis:
            initialData.calculation_basis || "per_booking_per_night",
        });
      } else {
        // အသစ်ထည့်ချိန်တွင် Reset လုပ်မည်
        form.resetFields();
        form.setFieldsValue({
          mode: "percentage",
          value: "0",
          calculation_basis: "per_booking_per_night",
        });
      }
    }
  }, [visible, initialData, form]);

  const handleFinish = (values) => {
    onSave(values);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      className="top-auto bottom-0 m-0 p-0 max-w-full sm:max-w-md"
      title={title}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

      <Form form={form} onFinish={handleFinish} layout="vertical">
        {/* Title Input */}
        <Form.Item
          name="title"
          label={
            <span className="text-sm font-semibold text-gray-700">Title</span>
          }
          rules={[{ required: true, message: "Please input the charge name!" }]}
          className="mb-4"
        >
          <Input
            placeholder="Charge Name"
            className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800"
          />
        </Form.Item>

        <Form.Item name="mode" className="mb-4">
          <Radio.Group className="w-full space-y-4 flex flex-col">
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
                    <span className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 text-sm">
                      MMK
                    </span>
                    <Form.Item name="value" noStyle>
                      <Input className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800 font-semibold" />
                    </Form.Item>
                  </div>

                  <Form.Item name="calculation_basis" className="pt-2 mb-0">
                    <Radio.Group className="space-y-3 flex! flex-col!">
                      <Radio
                        value="per_booking_per_night"
                        className="font-medium text-gray-700 mt-3!"
                      >
                        Per Booking / Night
                      </Radio>
                      <Radio
                        value="per_guest_per_night"
                        className="font-medium text-gray-700 mt-3!"
                      >
                        Per Guest / Night
                      </Radio>
                      <Radio
                        value="per_room_per_night"
                        className="font-medium text-gray-700 mt-3!"
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

        {/* Modal Actions */}
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

export default OtherChargeModal;
