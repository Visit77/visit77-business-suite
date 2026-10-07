import React, { useEffect } from "react";
import { Form, Input, Button, TimePicker } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const MealPlanForm = ({ handleFinish, initialValues, isEdit = false }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name || "",
        serviceStartTime: initialValues.serviceStartTime
          ? dayjs(initialValues.serviceStartTime, "hh:mm A")
          : dayjs("06:30 AM", "hh:mm A"),
        serviceEndTime: initialValues.serviceEndTime
          ? dayjs(initialValues.serviceEndTime, "hh:mm A")
          : dayjs("10:00 AM", "hh:mm A"),
        local_base_price: initialValues.local_base_price || 0,
        local_usd_display_price: initialValues.local_usd_display_price || 0,
        foreign_base_price: initialValues.foreign_base_price || 0,
        foreign_usd_display_price: initialValues.foreign_usd_display_price || 0,
        description: initialValues.description || "",
      });
    }
  }, [initialValues, form]);

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-6 font-sans">
      <div className="flex-1 overflow-y-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          {/* Meal Plan Name */}
          <Form.Item
            label={
              <span className="text-neutral-800 font-semibold text-sm">
                Meal Plan Name <span className="text-red-500">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Please enter meal plan name" }]}
            className="mb-5"
          >
            <Input
              placeholder="Type ..."
              className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 focus:border-indigo-500 rounded-xl text-neutral-700 placeholder:text-gray-400 font-medium"
            />
          </Form.Item>

          {/* Service Duration */}
          <div className="mb-6">
            <label className="block text-neutral-800 font-semibold text-sm mb-2">
              Service Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item name="serviceStartTime" className="mb-0">
                <TimePicker
                  use12Hours
                  format="hh:mm A"
                  minuteStep={5}
                  allowClear={false}
                  className="w-full h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl text-neutral-800 font-medium"
                />
              </Form.Item>

              <Form.Item name="serviceEndTime" className="mb-0">
                <TimePicker
                  use12Hours
                  format="hh:mm A"
                  minuteStep={5}
                  allowClear={false}
                  className="w-full h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl text-neutral-800 font-medium"
                />
              </Form.Item>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-neutral-800 mb-3">
              Pricing
            </h2>

            {/* Local */}
            <div className="mb-4">
              <span className="block text-neutral-700 font-medium text-sm mb-2">
                For Local <span className="text-red-500">*</span>
              </span>

              <div className="flex gap-2 mb-3">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  MMK
                </div>
                <Form.Item name="local_base_price" className="flex-1 mb-0">
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>

              <div className="flex gap-2">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  USD
                </div>
                <Form.Item
                  name="local_usd_display_price"
                  className="flex-1 mb-0"
                >
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Foreigner */}
            <div>
              <span className="block text-neutral-700 font-medium text-sm mb-2">
                For Foreigner
              </span>

              <div className="flex gap-2 mb-3">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  MMK
                </div>
                <Form.Item name="foreign_base_price" className="flex-1 mb-0">
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>

              <div className="flex gap-2">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  USD
                </div>
                <Form.Item
                  name="foreign_usd_display_price"
                  className="flex-1 mb-0"
                >
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-neutral-800 mb-2">
              Description
            </h2>
            <Form.Item name="description" className="mb-0">
              <Input.TextArea
                rows={3}
                placeholder="Type ..."
                className="bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl p-3 placeholder:text-gray-400 text-neutral-700 text-sm resize-none"
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2 pb-4">
            <Button
              type="default"
              onClick={() => {
                form.resetFields();
                navigate(-1);
              }}
              className="h-12 bg-[#eeeff4] border-none hover:bg-gray-200 text-neutral-800 font-semibold rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="h-12 bg-[#4338ca] hover:bg-[#3730a3] border-none text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200"
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MealPlanForm;
