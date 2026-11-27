import { Checkbox, Form, Input, Radio, Select } from "antd";
import React, { useEffect } from "react";

const CHARGE_TYPE_OPTIONS = [
  { value: "free", label: "Free of Charge" },
  { value: "half_adult_rate", label: "50% of Adult Rate" },
  { value: "same_as_adult", label: "100% of Adult Rate" },
];

const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

export const ChildPolicyForm = ({
  initialValues,
  onSave,
  onCancel,
  submitting = false,
}) => {
  const [form] = Form.useForm();

  const underEnabled = Form.useWatch(["under_rule", "enabled"], form);
  const betweenEnabled = Form.useWatch(["between_rule", "enabled"], form);
  const aboveEnabled = Form.useWatch(["above_rule", "enabled"], form);

  const normalizedInitialValues = {
    under_rule: {
      enabled: initialValues?.under_rule?.enabled ?? true,
      age_to: initialValues?.under_rule?.age_to ?? 4,
      charge_type: initialValues?.under_rule?.charge_type ?? "free",
    },
    between_rule: {
      enabled: initialValues?.between_rule?.enabled ?? true,
      age_from: initialValues?.between_rule?.age_from ?? 5,
      age_to: initialValues?.between_rule?.age_to ?? 13,
      charge_type:
        initialValues?.between_rule?.charge_type ?? "half_adult_rate",
    },
    above_rule: {
      enabled: initialValues?.above_rule?.enabled ?? true,
      age_from: initialValues?.above_rule?.age_from ?? 14,
      charge_type: initialValues?.above_rule?.charge_type ?? "same_as_adult",
    },
    additional_conditions: initialValues?.additional_conditions ?? "",
  };

  useEffect(() => {
    form.setFieldsValue(normalizedInitialValues);
  }, [
    form,
    initialValues?.under_rule?.enabled,
    initialValues?.under_rule?.age_to,
    initialValues?.under_rule?.charge_type,
    initialValues?.between_rule?.enabled,
    initialValues?.between_rule?.age_from,
    initialValues?.between_rule?.age_to,
    initialValues?.between_rule?.charge_type,
    initialValues?.above_rule?.enabled,
    initialValues?.above_rule?.age_from,
    initialValues?.above_rule?.charge_type,
    initialValues?.additional_conditions,
  ]);

  const handleFinish = (values) => {
    const rules = [];

    if (values?.under_rule?.enabled) {
      rules.push({
        age_from: 0,
        age_to: Number(values.under_rule.age_to),
        charge_type: values.under_rule.charge_type,
      });
    }

    if (values?.between_rule?.enabled) {
      rules.push({
        age_from: Number(values.between_rule.age_from),
        age_to: Number(values.between_rule.age_to),
        charge_type: values.between_rule.charge_type,
      });
    }

    if (values?.above_rule?.enabled) {
      rules.push({
        age_from: Number(values.above_rule.age_from),
        age_to: null,
        charge_type: values.above_rule.charge_type,
      });
    }

    onSave?.({
      rules,
      additional_conditions: values?.additional_conditions?.trim() ?? "",
    });
  };

  const handleCancel = () => {
    form.setFieldsValue(normalizedInitialValues);
    onCancel?.();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={normalizedInitialValues}
      onFinish={handleFinish}
      requiredMark={false}
    >
      {/* Rule 1: Under X year(s) old */}
      <div className="border-b border-slate-100 pb-5 mb-5">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <Form.Item
            name={["under_rule", "enabled"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox />
          </Form.Item>
          <span className="text-sm font-semibold text-slate-900">Under</span>
          <Form.Item name={["under_rule", "age_to"]} noStyle>
            <Select
              disabled={!underEnabled}
              options={AGE_OPTIONS}
              className="w-20!"
            />
          </Form.Item>
          <span className="text-sm font-semibold text-slate-900">
            year(s) old
          </span>
        </div>

        <Form.Item name={["under_rule", "charge_type"]} className="mb-0!">
          <Radio.Group
            disabled={!underEnabled}
            className="w-full! rounded-xl bg-slate-50/90 p-3.5 flex! flex-col! gap-3!"
          >
            {CHARGE_TYPE_OPTIONS.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                className="m-0! text-sm! font-semibold! text-slate-800!"
              >
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Rule 2: Between X to Y year(s) old */}
      <div className="border-b border-slate-100 pb-5 mb-5">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <Form.Item
            name={["between_rule", "enabled"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox />
          </Form.Item>
          <span className="text-sm font-semibold text-slate-900">Between</span>
          <Form.Item name={["between_rule", "age_from"]} noStyle>
            <Select
              disabled={!betweenEnabled}
              options={AGE_OPTIONS}
              className="w-20!"
            />
          </Form.Item>
          <span className="text-sm font-semibold text-slate-900">to</span>
          <Form.Item name={["between_rule", "age_to"]} noStyle>
            <Select
              disabled={!betweenEnabled}
              options={AGE_OPTIONS}
              className="w-20!"
            />
          </Form.Item>
          <span className="text-sm font-semibold text-slate-900">
            year(s) old
          </span>
        </div>

        <Form.Item name={["between_rule", "charge_type"]} className="mb-0!">
          <Radio.Group
            disabled={!betweenEnabled}
            className="w-full! rounded-xl bg-slate-50/90 p-3.5 flex! flex-col! gap-3!"
          >
            {CHARGE_TYPE_OPTIONS.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                className="m-0! text-sm! font-semibold! text-slate-800!"
              >
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Rule 3: X year(s) and above */}
      <div className="border-b border-slate-100 pb-5 mb-5">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <Form.Item
            name={["above_rule", "enabled"]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox />
          </Form.Item>
          <Form.Item name={["above_rule", "age_from"]} noStyle>
            <Select
              disabled={!aboveEnabled}
              options={AGE_OPTIONS}
              className="w-20!"
            />
          </Form.Item>
          <span className="text-sm font-semibold text-slate-900">
            year(s) and above
          </span>
        </div>

        <Form.Item name={["above_rule", "charge_type"]} className="mb-0!">
          <Radio.Group
            disabled={!aboveEnabled}
            className="w-full! rounded-xl bg-slate-50/90 p-3.5 flex! flex-col! gap-3!"
          >
            {CHARGE_TYPE_OPTIONS.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                className="m-0! text-sm! font-semibold! text-slate-800!"
              >
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Additional Conditions */}
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
          rows={4}
          placeholder="Type Here ..."
          className="rounded-xl! border-slate-200! bg-slate-50/80! px-3.5! py-3! text-sm! text-slate-800! placeholder:text-slate-400! focus:border-blue-900!"
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
  );
};
