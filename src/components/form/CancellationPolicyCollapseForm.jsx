import { Collapse, Form, Input, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";

const CANCELLATION_TYPE_OPTIONS = [
  {
    value: "non_refundable",
    label: "Non Refundable",
  },
  {
    value: "full_refund",
    label: "Free Cancellation (Full Refund)",
  },
  {
    value: "partial_refund",
    label: "Refund",
  },
];

const REFUND_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  value: i * 10,
  label: `${i * 10}%`,
}));

const HOUR_OPTIONS = [
  { value: 6, label: "6h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
  { value: 48, label: "48h" },
  { value: 72, label: "72h" },
  { value: 96, label: "96h" },
  { value: 120, label: "120h" },
];

export const CancellationPolicyCollapseForm = ({
  initialValues,
  onSave,
  onCancel,
  submitting = false,
  defaultOpen = false,
}) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));

  const selectedType = Form.useWatch("type", form);

  const normalizedInitialValues = {
    type: initialValues?.type ?? "non_refundable",
    lessRefund: initialValues?.lessRefund ?? 0,
    lessHours: initialValues?.lessHours ?? 24,
    moreRefund: initialValues?.moreRefund ?? 0,
    moreHours: initialValues?.moreHours ?? 24,
    description: initialValues?.description ?? "",
  };

  useEffect(() => {
    form.setFieldsValue(normalizedInitialValues);
  }, [
    form,
    normalizedInitialValues.type,
    normalizedInitialValues.lessRefund,
    normalizedInitialValues.lessHours,
    normalizedInitialValues.moreRefund,
    normalizedInitialValues.moreHours,
    normalizedInitialValues.description,
  ]);

  const handleFinish = (values) => {
    onSave?.({
      type: values?.type ?? "non_refundable",
      lessRefund: Number(values?.lessRefund ?? 0),
      lessHours: Number(values?.lessHours ?? 24),
      moreRefund: Number(values?.moreRefund ?? 0),
      moreHours: Number(values?.moreHours ?? 24),
      description: values?.description ?? "",
    });
  };

  const handleCancel = (e) => {
    e?.stopPropagation();
    form.setFieldsValue(normalizedInitialValues);
    setIsOpen(false);
    onCancel?.();
  };

  const isPartial = selectedType === "partial_refund";

  return (
    <Collapse
      activeKey={isOpen ? ["cancellation-policy"] : []}
      onChange={(keys) => setIsOpen(Array.isArray(keys) && keys.length > 0)}
      expandIconPlacement="end"
      className="rounded-xl! font-medium! overflow-hidden border border-slate-200 bg-white [&_.ant-collapse-header]:bg-slate-50! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3.5! [&_.ant-collapse-content-box]:p-4!"
      items={[
        {
          key: "cancellation-policy",
          label: (
            <div className="flex items-center justify-between pr-2">
              <span className="text-base font-bold text-slate-900">
                Edit Cancellation Policy
              </span>
            </div>
          ),
          children: (
            <Form
              form={form}
              layout="vertical"
              initialValues={normalizedInitialValues}
              onFinish={handleFinish}
              requiredMark={false}
            >
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please select a cancellation policy",
                  },
                ]}
                className="mb-5!"
              >
                <Radio.Group className="w-full! flex! flex-col! gap-3!">
                  {CANCELLATION_TYPE_OPTIONS.map((option) => {
                    const isSelected = selectedType === option.value;
                    return (
                      <div
                        key={option.value}
                        className={`rounded-xl! border! transition-colors! ${
                          isSelected
                            ? "border-[1.5px] border-blue-900 bg-white"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <Radio
                          value={option.value}
                          className="w-full! m-0! px-4! py-3.5! flex! items-center! [&_.ant-radio]:mr-3!"
                        >
                          <span className="text-sm font-semibold text-slate-900">
                            {option.label}
                          </span>
                        </Radio>

                        {option.value === "partial_refund" && (
                          <div className="px-4 pb-4 pt-1 ml-7 space-y-3.5 border-t border-slate-100">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-sm font-medium text-slate-700 w-14">
                                Refund
                              </span>
                              <Form.Item name="lessRefund" noStyle>
                                <Select
                                  options={REFUND_OPTIONS}
                                  disabled={!isPartial}
                                  className="w-24!"
                                />
                              </Form.Item>
                              <span className="text-sm text-slate-600">
                                Less than
                              </span>
                              <Form.Item name="lessHours" noStyle>
                                <Select
                                  options={HOUR_OPTIONS}
                                  disabled={!isPartial}
                                  className="w-24!"
                                />
                              </Form.Item>
                              <span className="text-sm font-medium text-slate-600">
                                before check-in
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-sm font-medium text-slate-700 w-14">
                                Refund
                              </span>
                              <Form.Item name="moreRefund" noStyle>
                                <Select
                                  options={REFUND_OPTIONS}
                                  disabled={!isPartial}
                                  className="w-24!"
                                />
                              </Form.Item>
                              <span className="text-sm font-medium text-slate-600">
                                More than
                              </span>
                              <Form.Item name="moreHours" noStyle>
                                <Select
                                  options={HOUR_OPTIONS}
                                  disabled={true}
                                  className="w-24!"
                                />
                              </Form.Item>
                              <span className="text-sm font-medium text-slate-600">
                                before check-in
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <span className="text-sm font-bold text-slate-900">
                    Cancellation Description
                  </span>
                }
                className="mb-6!"
              >
                <Input.TextArea
                  rows={4}
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
