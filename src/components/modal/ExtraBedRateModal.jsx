import React, { useEffect } from "react";
import { Form, Modal, InputNumber, Button, Divider } from "antd";

const hasValue = (val) => val !== null && val !== undefined && val !== "";

const ExtraBedRateModal = ({
  opened,
  onClose,
  initialData = null,
  onSubmit,
  isLoading = false,
}) => {
  const [form] = Form.useForm();

  const isEditMode = Boolean(
    hasValue(initialData?.extra_bed_local_base_price) ||
    hasValue(initialData?.extra_bed_local_usd_price) ||
    hasValue(initialData?.extra_bed_foreign_base_price) ||
    hasValue(initialData?.extra_bed_foreign_usd_price),
  );

  const localBasePrice = Form.useWatch("extra_bed_local_base_price", form);
  const localUsdPrice = Form.useWatch("extra_bed_local_usd_price", form);

  const hasRequiredLocalRate =
    hasValue(localBasePrice) || hasValue(localUsdPrice);

  useEffect(() => {
    if (!opened) return;

    if (initialData) {
      form.setFieldsValue({
        extra_bed_local_base_price:
          initialData?.extra_bed_local_base_price ?? null,
        extra_bed_local_usd_price:
          initialData?.extra_bed_local_usd_price ?? null,
        extra_bed_foreign_base_price:
          initialData?.extra_bed_foreign_base_price ?? null,
        extra_bed_foreign_usd_price:
          initialData?.extra_bed_foreign_usd_price ?? null,
      });
    } else {
      form.resetFields();
    }
  }, [opened, initialData, form]);

  const handleClose = () => {
    if (isLoading) return;
    form.resetFields();
    onClose?.();
  };

  const handleFinish = (values) => {
    const roomTypeId = initialData?.room_type_id ?? initialData?.id ?? null;

    const payload = {
      ...(roomTypeId ? { id: roomTypeId, room_type_id: roomTypeId } : {}),
      extra_bed_local_base_price: hasValue(values.extra_bed_local_base_price)
        ? Number(values.extra_bed_local_base_price)
        : null,
      extra_bed_local_usd_price: hasValue(values.extra_bed_local_usd_price)
        ? Number(values.extra_bed_local_usd_price)
        : null,
      extra_bed_foreign_base_price: hasValue(
        values.extra_bed_foreign_base_price,
      )
        ? Number(values.extra_bed_foreign_base_price)
        : null,
      extra_bed_foreign_usd_price: hasValue(values.extra_bed_foreign_usd_price)
        ? Number(values.extra_bed_foreign_usd_price)
        : null,
    };

    onSubmit?.(payload, isEditMode ? "update" : "create");
  };

  const renderNumberInput = (placeholder = "Type ...") => (
    <InputNumber
      placeholder={placeholder}
      controls={false}
      min={0}
      formatter={(value) =>
        hasValue(value) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
      }
      parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
      className="w-full! h-12 flex items-center rounded-xl border-slate-300 text-base hover:border-slate-500 focus-within:border-blue-600"
    />
  );

  return (
    <Modal
      open={opened}
      onCancel={handleClose}
      title={
        <span className="text-lg font-bold text-slate-800">
          {isEditMode ? "Edit Extra Bed Rate" : "Add Extra Bed Rate"}
        </span>
      }
      centered
      width={460}
      maskClosable={!isLoading}
      keyboard={!isLoading}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-2 space-y-4"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
          {/* For Local * */}
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">
              For Local <span className="text-rose-500">*</span>
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item
                  name="extra_bed_local_base_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="w-24 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  USD
                </div>
                <Form.Item
                  name="extra_bed_local_usd_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
          </div>

          <Divider className="my-3 border-slate-200" />

          {/* For Foreigner */}
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">
              For Foreigner
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="w-24 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item
                  name="extra_bed_foreign_base_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="w-24 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  USD
                </div>
                <Form.Item
                  name="extra_bed_foreign_usd_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="pt-1">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={!hasRequiredLocalRate}
            className={`w-full! h-12 rounded-xl border-none font-semibold text-base ${
              hasRequiredLocalRate
                ? "bg-indigo-600! hover:bg-indigo-700! text-white!"
                : "bg-slate-300! text-white! cursor-not-allowed"
            }`}
          >
            Confirm
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ExtraBedRateModal;
