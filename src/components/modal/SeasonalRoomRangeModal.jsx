import React, { useEffect } from "react";
import { Form, Modal, InputNumber, DatePicker, Button, Divider } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const SeasonalRoomRangeModal = ({
  opened,
  onClose,
  initialData = null,
  onSubmit,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const isEditMode = Boolean(initialData?.seasonal_id);

  const dateRange = Form.useWatch("date_range", form);
  const seasonalLocalBasePrice = Form.useWatch(
    "seasonal_local_base_price",
    form,
  );
  const seasonalLocalUsdPrice = Form.useWatch("seasonal_local_usd_price", form);
  const seasonalForeignBasePrice = Form.useWatch(
    "seasonal_foreign_base_price",
    form,
  );
  const seasonalForeignUsdPrice = Form.useWatch(
    "seasonal_foreign_usd_price",
    form,
  );

  const hasValue = (val) => val !== null && val !== undefined && val !== "";

  const hasDateRange =
    Array.isArray(dateRange) && Boolean(dateRange[0]) && Boolean(dateRange[1]);

  const hasSeasonalPrice =
    hasValue(seasonalLocalBasePrice) ||
    hasValue(seasonalLocalUsdPrice) ||
    hasValue(seasonalForeignBasePrice) ||
    hasValue(seasonalForeignUsdPrice);

  const isFormReady = hasDateRange && hasSeasonalPrice;

  useEffect(() => {
    if (!opened) return;

    if (initialData) {
      const rawStart = initialData?.start_date ?? null;
      const rawEnd = initialData?.end_date ?? null;

      form.setFieldsValue({
        date_range:
          rawStart && rawEnd ? [dayjs(rawStart), dayjs(rawEnd)] : null,
        local_base_price: initialData?.local_base_price ?? null,
        local_usd_price: initialData?.local_usd_price ?? null,
        foreign_base_price: initialData?.foreign_base_price ?? null,
        foreign_usd_price: initialData?.foreign_usd_price ?? null,
        seasonal_local_base_price:
          initialData?.seasonal_local_base_price ?? null,
        seasonal_local_usd_price: initialData?.seasonal_local_usd_price ?? null,
        seasonal_foreign_base_price:
          initialData?.seasonal_foreign_base_price ?? null,
        seasonal_foreign_usd_price:
          initialData?.seasonal_foreign_usd_price ?? null,
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
    const startDate = values.date_range?.[0]
      ? dayjs(values.date_range[0]).format("YYYY-MM-DD")
      : null;
    const endDate = values.date_range?.[1]
      ? dayjs(values.date_range[1]).format("YYYY-MM-DD")
      : null;

    const roomTypeId = initialData?.room_type_id ?? initialData?.id ?? null;

    const payload = {
      ...(roomTypeId ? { id: roomTypeId, room_type_id: roomTypeId } : {}),
      ...(initialData?.seasonal_id
        ? { seasonal_id: initialData.seasonal_id }
        : {}),
      start_date: startDate,
      end_date: endDate,
      local_base_price: values.seasonal_local_base_price ?? null,
      local_usd_price: values.seasonal_local_usd_price ?? null,
      foreign_base_price: values.seasonal_foreign_base_price ?? null,
      foreign_usd_price: values.seasonal_foreign_usd_price ?? null,
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
        value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
      }
      parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
      className="w-full! h-11 flex items-center rounded-xl border-slate-300 text-base hover:border-slate-500 focus-within:border-blue-600"
    />
  );

  return (
    <Modal
      open={opened}
      onCancel={handleClose}
      title={
        <span className="text-lg font-bold text-slate-800">
          {isEditMode ? "Update Seasonal Room Rate" : "Seasonal Room Rate"}
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
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-blue-600 bg-slate-50 shrink-0">
                  MMK
                </div>
                <Form.Item name="local_base_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Seasonal Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item
                  name="seasonal_local_base_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
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
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-blue-600 bg-slate-50 shrink-0">
                  USD
                </div>
                <Form.Item name="local_usd_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Seasonal Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white shrink-0">
                  USD
                </div>
                <Form.Item
                  name="seasonal_local_usd_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
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
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-blue-600 bg-slate-50 shrink-0">
                  MMK
                </div>
                <Form.Item name="foreign_base_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Seasonal Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white shrink-0">
                  MMK
                </div>
                <Form.Item
                  name="seasonal_foreign_base_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
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
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-blue-600 bg-slate-50 shrink-0">
                  USD
                </div>
                <Form.Item name="foreign_usd_price" className="flex-1 mb-0!">
                  {renderNumberInput("Regular", true)}
                </Form.Item>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-600 w-28 shrink-0">
                  Seasonal Price
                </span>
                <div className="w-16 h-11 flex items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white shrink-0">
                  USD
                </div>
                <Form.Item
                  name="seasonal_foreign_usd_price"
                  className="flex-1 mb-0!"
                >
                  {renderNumberInput("Type ...")}
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        {/* Choose Date Range Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-800 mb-3">
            Choose Date Range
          </p>
          <Form.Item
            name="date_range"
            className="mb-0!"
            rules={[
              { required: true, message: "Please select start and end date" },
            ]}
          >
            <RangePicker
              placeholder={["Start Date", "End Date"]}
              format="YYYY-MM-DD"
              className="w-full! h-12 rounded-xl border-slate-300 hover:border-slate-500 focus-within:border-blue-600"
            />
          </Form.Item>
        </div>

        {/* Confirm Button */}
        <div className="pt-2">
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

export default SeasonalRoomRangeModal;
