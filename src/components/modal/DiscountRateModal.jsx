import React, { useEffect } from "react";
import {
  Form,
  Modal,
  InputNumber,
  DatePicker,
  Button,
  Divider,
  Radio,
} from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const hasValue = (val) => val !== null && val !== undefined && val !== "";

const calculateDiscountPercent = (regularPrice, discountPrice) => {
  if (!hasValue(regularPrice) || !hasValue(discountPrice)) return null;
  const reg = Number(regularPrice);
  const disc = Number(discountPrice);
  if (Number.isNaN(reg) || Number.isNaN(disc) || reg <= 0 || disc >= reg) {
    return null;
  }
  const percent = Math.floor(((reg - disc) / reg) * 100);
  return percent > 0 ? percent : null;
};

const DiscountRoomRateModal = ({
  opened,
  onClose,
  initialData = null,
  onSubmit,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const isEditMode = Boolean(initialData?.discount_id);

  const scheduleType = Form.useWatch("schedule_type", form) || "manual";
  const dateRange = Form.useWatch("date_range", form);

  const regularLocalBase = Form.useWatch("local_base_price", form);
  const regularLocalUsd = Form.useWatch("local_usd_price", form);
  const regularForeignBase = Form.useWatch("foreign_base_price", form);
  const regularForeignUsd = Form.useWatch("foreign_usd_price", form);

  const discountLocalBase = Form.useWatch("discount_local_base_price", form);
  const discountLocalUsd = Form.useWatch("discount_local_usd_price", form);
  const discountForeignBase = Form.useWatch(
    "discount_foreign_base_price",
    form,
  );
  const discountForeignUsd = Form.useWatch("discount_foreign_usd_price", form);

  const localBaseOff = calculateDiscountPercent(
    regularLocalBase,
    discountLocalBase,
  );
  const localUsdOff = calculateDiscountPercent(
    regularLocalUsd,
    discountLocalUsd,
  );
  const foreignBaseOff = calculateDiscountPercent(
    regularForeignBase,
    discountForeignBase,
  );
  const foreignUsdOff = calculateDiscountPercent(
    regularForeignUsd,
    discountForeignUsd,
  );

  const hasAnyDiscountPrice =
    hasValue(discountLocalBase) ||
    hasValue(discountLocalUsd) ||
    hasValue(discountForeignBase) ||
    hasValue(discountForeignUsd);

  const hasScheduleDateRange =
    scheduleType !== "scheduled" ||
    (Array.isArray(dateRange) &&
      Boolean(dateRange[0]) &&
      Boolean(dateRange[1]));

  const isFormReady = hasAnyDiscountPrice && hasScheduleDateRange;

  useEffect(() => {
    if (!opened) return;

    if (initialData) {
      const rawStart = initialData?.start_date ?? null;
      const rawEnd = initialData?.end_date ?? null;
      const inferredScheduleType =
        initialData?.schedule_type ||
        (rawStart && rawEnd ? "scheduled" : "manual");

      form.setFieldsValue({
        local_base_price: initialData?.local_base_price ?? null,
        local_usd_price: initialData?.local_usd_price ?? null,
        foreign_base_price: initialData?.foreign_base_price ?? null,
        foreign_usd_price: initialData?.foreign_usd_price ?? null,
        discount_local_base_price:
          initialData?.discount_local_base_price ?? null,
        discount_local_usd_price: initialData?.discount_local_usd_price ?? null,
        discount_foreign_base_price:
          initialData?.discount_foreign_base_price ?? null,
        discount_foreign_usd_price:
          initialData?.discount_foreign_usd_price ?? null,
        schedule_type: inferredScheduleType,
        date_range:
          rawStart && rawEnd ? [dayjs(rawStart), dayjs(rawEnd)] : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ schedule_type: "manual" });
    }
  }, [opened, initialData, form]);

  const handleClose = () => {
    if (isLoading) return;
    form.resetFields();
    onClose?.();
  };

  const handleFinish = (values) => {
    const isScheduled = values.schedule_type === "scheduled";
    const startDate =
      isScheduled && values.date_range?.[0]
        ? dayjs(values.date_range[0]).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
    const endDate =
      isScheduled && values.date_range?.[1]
        ? dayjs(values.date_range[1]).format("YYYY-MM-DD")
        : null;

    const roomTypeId = initialData?.room_type_id ?? initialData?.id ?? null;

    const payload = {
      ...(roomTypeId ? { id: roomTypeId, room_type_id: roomTypeId } : {}),
      ...(initialData?.discount_id
        ? { discount_id: initialData.discount_id }
        : {}),
      timing_mode: values.schedule_type || "manual",
      start_date: startDate,
      end_date: endDate,

      local_base_price: values.discount_local_base_price,
      local_usd_price: values.discount_local_usd_price,
      foreign_base_price: values.discount_foreign_base_price,
      foreign_usd_price: values.discount_foreign_usd_price,
    };

    onSubmit?.(payload, isEditMode ? "update" : "create");
  };

  const renderNumberInput = (placeholder, disabled = false) => (
    <InputNumber
      placeholder={placeholder}
      disabled={disabled}
      controls={false}
      min={0}
      formatter={(value) =>
        hasValue(value) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
      }
      parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
      className="w-full! h-11 flex items-center rounded-xl border-slate-300 text-base hover:border-slate-500 focus-within:border-blue-600"
    />
  );

  const renderDiscountOffText = (percent) => {
    if (!percent) return null;
    return (
      <p className="text-sm font-semibold text-rose-500 mt-2">
        Discount {percent}% Off
      </p>
    );
  };

  return (
    <Modal
      open={opened}
      onCancel={handleClose}
      title={
        <span className="text-lg font-bold text-slate-800">
          {isEditMode ? "Edit Discount Price" : "Set Discount Price"}
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
        initialValues={{ schedule_type: "manual" }}
        className="pt-2 space-y-4"
      >
        {/* Price Sections Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
          {/* 1. For Local (MMK) */}
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">
              For Local (MMK)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Regular Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item name="local_base_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Discount Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item
                  name="discount_local_base_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
            {renderDiscountOffText(localBaseOff)}
          </div>

          <Divider className="my-3 border-slate-200" />

          {/* 2. For Local (USD) */}
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">
              For Local (USD)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Regular Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  USD
                </div>
                <Form.Item name="local_usd_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Discount Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  USD
                </div>
                <Form.Item
                  name="discount_local_usd_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
            {renderDiscountOffText(localUsdOff)}
          </div>

          <Divider className="my-3 border-slate-200" />

          {/* 3. For Foreigner (MMK) */}
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">
              For Foreigner (MMK)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Regular Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item name="foreign_base_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Discount Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item
                  name="discount_foreign_base_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
            {renderDiscountOffText(foreignBaseOff)}
          </div>

          <Divider className="my-3 border-slate-200" />

          {/* 4. For Foreigner (USD) */}
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-3">
              For Foreigner (USD)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Regular Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  USD
                </div>
                <Form.Item name="foreign_usd_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Discount Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white shrink-0">
                  USD
                </div>
                <Form.Item
                  name="discount_foreign_usd_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
            {renderDiscountOffText(foreignUsdOff)}
          </div>
        </div>

        {/* Schedule Mode Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <Form.Item name="schedule_type" className="mb-0!">
            <Radio.Group className="flex flex-col space-y-3">
              <Radio
                value="manual"
                className="text-sm font-medium text-slate-800"
              >
                Start discount now, end manually
              </Radio>
              <Radio
                value="scheduled"
                className="text-sm font-medium text-slate-800"
              >
                Schedule discount
              </Radio>
            </Radio.Group>
          </Form.Item>

          {scheduleType === "scheduled" && (
            <div className="pt-1">
              <Form.Item
                name="date_range"
                className="mb-0!"
                rules={[
                  {
                    required: true,
                    message: "Please select start and end date",
                  },
                ]}
              >
                <RangePicker
                  placeholder={["Start Date", "End Date"]}
                  format="YYYY-MM-DD"
                  className="w-full! h-12 rounded-xl border-slate-300 hover:border-slate-500 focus-within:border-blue-600"
                />
              </Form.Item>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <div className="pt-1">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={!isFormReady}
            className={`w-full! h-12 rounded-xl border-none font-semibold text-base ${
              isFormReady
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

export default DiscountRoomRateModal;
