import { Collapse, Form, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";

const PET_POLICY_OPTIONS = [
  {
    value: "not_allowed",
    label: "Pets Are Not Allowed.",
  },
  {
    value: "allowed",
    label: "Pets Are Allowed.",
  },
  {
    value: "allowed_with_restrictions",
    label: "Pets Allowed with Restrictions.",
  },
];

export const PetPolicyCollapseForm = ({
  initialValues,
  onSave,
  onCancel,
  submitting = false,
  defaultOpen = false,
}) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));

  const selectedPolicy = Form.useWatch("pet_policy", form);

  const policyChoice = initialValues?.pet_policy ?? "not_allowed";
  const additionalConditions = initialValues?.additional_conditions ?? "";

  useEffect(() => {
    form.setFieldsValue({
      pet_policy: policyChoice,
      additional_conditions: additionalConditions,
    });
  }, [form, policyChoice, additionalConditions]);

  const handleFinish = (values) => {
    onSave?.({
      pet_policy: values?.pet_policy ?? "not_allowed",
      additional_conditions: values?.additional_conditions ?? "",
    });
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    form.setFieldsValue({
      pet_policy: policyChoice,
      additional_conditions: additionalConditions,
    });
    onCancel?.();
  };

  return (
    <Collapse
      activeKey={isOpen ? ["pet-policy"] : []}
      onChange={(keys) => setIsOpen(Array.isArray(keys) && keys.length > 0)}
      expandIconPlacement="end"
      className="rounded-xl! font-medium! overflow-hidden border border-slate-200 bg-white [&_.ant-collapse-header]:bg-slate-50! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3.5! [&_.ant-collapse-content-box]:p-4!"
      items={[
        {
          key: "pet-policy",
          label: (
            <div className="flex items-center justify-between pr-2">
              <span className="text-base font-bold text-slate-900">
                Edit Pet Policy
              </span>
            </div>
          ),
          children: (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                pet_policy: policyChoice,
                additional_conditions: additionalConditions,
              }}
              onFinish={handleFinish}
              requiredMark={false}
            >
              <Form.Item
                name="pet_policy"
                rules={[
                  { required: true, message: "Please select a pet policy" },
                ]}
                className="mb-5!"
              >
                <Radio.Group className="w-full! flex! flex-col! gap-3!">
                  {PET_POLICY_OPTIONS.map((option) => {
                    const isSelected = selectedPolicy === option.value;
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
