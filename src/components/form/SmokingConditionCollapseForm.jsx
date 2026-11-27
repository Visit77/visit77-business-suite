import { Collapse, Form, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";

const SMOKING_CONDITION_OPTIONS = [
  {
    value: "non_smoking_property",
    label: "Non-Smoking Property",
  },
  {
    value: "designated_smoking_areas",
    label: "Designated Smoking Areas",
  },
  {
    value: "smoking_room_available",
    label: "Smoking Room Available",
  },
  {
    value: "designated_rooms_and_areas",
    label: "Smoking Permitted in Designated Rooms and Areas",
  },
];

export const SmokingConditionCollapseForm = ({
  initialValues,
  onSave,
  onCancel,
  submitting = false,
  defaultOpen = false,
}) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));

  const selectedCondition = Form.useWatch("smoking_condition", form);

  const conditionChoice =
    initialValues?.smoking_condition ?? "non_smoking_property";
  const additionalConditions = initialValues?.additional_conditions ?? "";

  useEffect(() => {
    form.setFieldsValue({
      smoking_condition: conditionChoice,
      additional_conditions: additionalConditions,
    });
  }, [form, conditionChoice, additionalConditions]);

  const handleFinish = (values) => {
    onSave?.({
      smoking_condition: values?.smoking_condition ?? "non_smoking_property",
      additional_conditions: values?.additional_conditions ?? "",
    });
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    form.setFieldsValue({
      smoking_condition: conditionChoice,
      additional_conditions: additionalConditions,
    });
    onCancel?.();
  };

  return (
    <Collapse
      activeKey={isOpen ? ["smoking-condition"] : []}
      onChange={(keys) => setIsOpen(Array.isArray(keys) && keys.length > 0)}
      expandIconPlacement="end"
      className="rounded-xl! font-medium! overflow-hidden border border-slate-200 bg-white [&_.ant-collapse-header]:bg-slate-50! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3.5! [&_.ant-collapse-content-box]:p-4!"
      items={[
        {
          key: "smoking-condition",
          label: (
            <div className="flex items-center justify-between pr-2">
              <span className="text-base font-bold text-slate-900">
                Edit Smoking Condition
              </span>
            </div>
          ),
          children: (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                smoking_condition: conditionChoice,
                additional_conditions: additionalConditions,
              }}
              onFinish={handleFinish}
              requiredMark={false}
            >
              <Form.Item
                name="smoking_condition"
                rules={[
                  {
                    required: true,
                    message: "Please select a smoking condition",
                  },
                ]}
                className="mb-5!"
              >
                <Radio.Group className="w-full! flex! flex-col! gap-3!">
                  {SMOKING_CONDITION_OPTIONS.map((option) => {
                    const isSelected = selectedCondition === option.value;
                    return (
                      <Radio
                        key={option.value}
                        value={option.value}
                        className={`w-full! m-0! px-4! py-3.5! rounded-xl! border! transition-colors! flex! items-center! [&_.ant-radio]:mr-3! ${
                          isSelected
                            ? "border-[1.5px] border-blue-900 bg-white text-slate-900"
                            : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-sm font-semibold text-slate-900">
                          {option.label}
                        </span>
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="additional_conditions"
                label={
                  <span className="text-sm font-bold text-slate-900">
                    Additional Conditions
                  </span>
                }
                className="mb-6!"
              >
                <Input.TextArea
                  rows={5}
                  placeholder="Type Here ..."
                  className="rounded-xl! border-slate-200! px-3.5! py-3! text-sm! text-slate-800! placeholder:text-slate-400! focus:border-blue-900!"
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="w-full rounded-xl bg-neutral-200 hover:bg-neutral-300 disabled:opacity-60 py-3 px-4 text-sm font-semibold text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-900 hover:bg-blue-950 disabled:bg-blue-400 py-3 px-4 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          ),
        },
      ]}
    />
  );
};
