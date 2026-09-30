import React from "react";
import { Form, Input, Button, TimePicker, message } from "antd";

import dayjs from "dayjs";
import { ArrowLeft } from "@hugeicons/core-free-icons";

const MealPlanForm = () => {
  const [form] = Form.useForm();

  // Handle Form Submission
  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      serviceStartTime: values.serviceStartTime
        ? values.serviceStartTime.format("hh:mm A")
        : null,
      serviceEndTime: values.serviceEndTime
        ? values.serviceEndTime.format("hh:mm A")
        : null,
    };
    console.log("Meal Plan Form Data:", formattedValues);
    message.success("Meal Plan created successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-6 font-sans">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            mealPlanName: "Deluxe King",
            serviceStartTime: dayjs("06:30 AM", "hh:mm A"),
            serviceEndTime: dayjs("10:00 AM", "hh:mm A"),
            localMmk: "",
            localUsd: "",
            foreignerMmk: "",
            foreignerUsd: "",
            description: "Breakfast buffet for 2 guests included.",
          }}
          requiredMark={false}
        >
          {/* Meal Plan Name */}
          <Form.Item
            label={
              <span className="text-neutral-800 font-semibold text-sm">
                Meal Plan Name <span className="text-red-500">*</span>
              </span>
            }
            name="mealPlanName"
            rules={[{ required: true, message: "Please enter meal plan name" }]}
            className="mb-5"
          >
            <Input
              placeholder="Deluxe King"
              className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 focus:border-indigo-500 rounded-xl text-neutral-700 placeholder:text-gray-400 font-medium"
            />
          </Form.Item>

          {/* Service Duration with Ant Design TimePicker */}
          <div className="mb-6">
            <label className="block text-neutral-800 font-semibold text-sm mb-2">
              Service Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Start Time Picker */}
              <Form.Item name="serviceStartTime" className="mb-0">
                <TimePicker
                  use12Hours
                  format="hh:mm A"
                  minuteStep={5}
                  allowClear={false}
                  className="w-full h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl text-neutral-800 font-medium"
                  popupClassName="custom-timepicker-popup"
                />
              </Form.Item>

              {/* End Time Picker */}
              <Form.Item name="serviceEndTime" className="mb-0">
                <TimePicker
                  use12Hours
                  format="hh:mm A"
                  minuteStep={5}
                  allowClear={false}
                  className="w-full h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl text-neutral-800 font-medium"
                  popupClassName="custom-timepicker-popup"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-bold text-neutral-800 mb-3">
              Pricing
            </h2>

            {/* For Local */}
            <div className="mb-4">
              <span className="block text-neutral-700 font-medium text-sm mb-2">
                For Local <span className="text-red-500">*</span>
              </span>

              {/* MMK Local */}
              <div className="flex gap-2 mb-3">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  MMK
                </div>
                <Form.Item name="localMmk" className="flex-1 mb-0">
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>

              {/* USD Local */}
              <div className="flex gap-2">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  USD
                </div>
                <Form.Item name="localUsd" className="flex-1 mb-0">
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>
            </div>

            {/* For Foreigner */}
            <div>
              <span className="block text-neutral-700 font-medium text-sm mb-2">
                For Foreigner
              </span>

              {/* MMK Foreigner */}
              <div className="flex gap-2 mb-3">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  MMK
                </div>
                <Form.Item name="foreignerMmk" className="flex-1 mb-0">
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>

              {/* USD Foreigner */}
              <div className="flex gap-2">
                <div className="w-20 h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-neutral-700 font-bold text-xs shadow-sm">
                  USD
                </div>
                <Form.Item name="foreignerUsd" className="flex-1 mb-0">
                  <Input
                    placeholder="Type ..."
                    className="h-12 bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl placeholder:text-gray-400 text-neutral-700"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Section: Description */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-neutral-800 mb-2">
              Description
            </h2>
            <Form.Item name="description" className="mb-0">
              <Input.TextArea
                rows={2}
                placeholder="Breakfast buffet for 2 guests included."
                className="bg-[#f4f6fb] border-gray-300 hover:border-indigo-400 rounded-xl p-3 placeholder:text-gray-400 text-neutral-700 text-sm resize-none"
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2 pb-4">
            <Button
              type="default"
              onClick={() => form.resetFields()}
              className="h-12 bg-[#eeeff4] border-none hover:bg-gray-200 text-neutral-800 font-semibold rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="h-12 bg-[#4338ca] hover:bg-[#3730a3] border-none text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MealPlanForm;
