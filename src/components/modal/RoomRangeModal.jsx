import React, { useEffect } from "react";
import { Form, Modal, InputNumber, Button, Divider } from "antd";

const RoomRangeModal = ({
  opened,
  onClose,
  initialData = null,
  onSubmit,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const isEditMode = Boolean(initialData?.id);

  const localMmk = Form.useWatch("local_base_price", form);
  const localUsd = Form.useWatch("local_usd_price", form);

  const isLocalFilled =
    localMmk !== null &&
    localMmk !== undefined &&
    localMmk !== "" &&
    localUsd !== null &&
    localUsd !== undefined &&
    localUsd !== "";

  useEffect(() => {
    if (!opened) return;

    if (isEditMode && initialData) {
      form.setFieldsValue({
        local_base_price:
          initialData.local_base_price ?? initialData.local_base_price ?? null,
        local_usd_price:
          initialData.local_usd_price ?? initialData.local_usd_price ?? null,
        foreign_base_price:
          initialData.foreign_base_price ??
          initialData.foreign_base_price ??
          null,
        foreign_usd_price:
          initialData.foreign_usd_price ??
          initialData.foreign_usd_price ??
          null,
      });
    } else {
      form.resetFields();
    }
  }, [opened, isEditMode, initialData, form]);

  const handleClose = () => {
    if (isLoading) return;
    form.resetFields();
    onClose?.();
  };

  const handleFinish = (values) => {
    const payload = {
      ...(isEditMode
        ? { id: initialData.id, room_type_id: initialData.id }
        : {
            room_type_id: initialData?.room_type_id ?? null,
          }),
      local_base_price: values.local_base_price ?? null,
      local_usd_price: values.local_usd_price ?? null,
      foreign_base_price: values.foreign_base_price ?? null,
      foreign_usd_price: values.foreign_usd_price ?? null,
    };

    onSubmit?.(payload, isEditMode ? "update" : "create");
  };

  return (
    <Modal
      open={opened}
      onCancel={handleClose}
      title={
        <span className="text-lg font-bold text-slate-800">
          {isEditMode
            ? `Update ${initialData?.name}`
            : `Add ${initialData?.name}`}
        </span>
      }
      centered
      width={440}
      maskClosable={!isLoading}
      keyboard={!isLoading}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-2"
      >
        {/* 1. For Local * */}
        <div>
          <p className="text-base font-semibold text-slate-700 mb-3">
            For Local <span className="text-red-500">*</span>
          </p>

          <div className="space-y-3">
            {/* Local MMK */}
            <div className="flex items-start gap-3">
              <div className="w-24 h-11 flex items-center justify-center rounded-xl border border-slate-500 font-semibold text-slate-800 bg-white shrink-0">
                MMK
              </div>
              <Form.Item
                name="local_base_price"
                className="flex-1 mb-0"
                rules={[{ required: true, message: "Local MMK is required" }]}
              >
                <InputNumber
                  placeholder="Type ..."
                  controls={false}
                  min={0}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) =>
                    value ? value.replace(/\$\s?|(,*)/g, "") : ""
                  }
                  className="w-full! h-11 flex items-center rounded-xl border-slate-500 text-base hover:border-slate-700 focus-within:border-slate-800"
                />
              </Form.Item>
            </div>

            {/* Local USD */}
            <div className="flex items-start gap-3">
              <div className="w-24 h-11 flex items-center justify-center rounded-xl border border-slate-500 font-semibold text-slate-800 bg-white shrink-0">
                USD
              </div>
              <Form.Item
                name="local_usd_price"
                className="flex-1 mb-0"
                rules={[{ required: true, message: "Local USD is required" }]}
              >
                <InputNumber
                  placeholder="Type ..."
                  controls={false}
                  min={0}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) =>
                    value ? value.replace(/\$\s?|(,*)/g, "") : ""
                  }
                  className="w-full! h-11 flex items-center rounded-xl border-slate-500 text-base hover:border-slate-700 focus-within:border-slate-800"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Divider className="my-5 border-slate-200" />

        {/* 2. For Foreigner */}
        <div>
          <p className="text-base font-semibold text-slate-700 mb-3">
            For Foreigner
          </p>

          <div className="space-y-3">
            {/* Foreigner MMK */}
            <div className="flex items-start gap-3">
              <div className="w-24 h-11 flex items-center justify-center rounded-xl border border-slate-500 font-semibold text-slate-800 bg-white shrink-0">
                MMK
              </div>
              <Form.Item name="foreign_base_price" className="flex-1 mb-0">
                <InputNumber
                  placeholder="Type ..."
                  controls={false}
                  min={0}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) =>
                    value ? value.replace(/\$\s?|(,*)/g, "") : ""
                  }
                  className="w-full! h-11 flex items-center rounded-xl border-slate-500 text-base hover:border-slate-700 focus-within:border-slate-800"
                />
              </Form.Item>
            </div>

            {/* Foreigner USD */}
            <div className="flex items-start gap-3">
              <div className="w-24 h-11 flex items-center justify-center rounded-xl border border-slate-500 font-semibold text-slate-800 bg-white shrink-0">
                USD
              </div>
              <Form.Item name="foreign_usd_price" className="flex-1 mb-0">
                <InputNumber
                  placeholder="Type ..."
                  controls={false}
                  min={0}
                  formatter={(value) =>
                    value
                      ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                  parser={(value) =>
                    value ? value.replace(/\$\s?|(,*)/g, "") : ""
                  }
                  className="w-full! h-11 flex items-center rounded-xl border-slate-500 text-base hover:border-slate-700 focus-within:border-slate-800"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* 3. Footer Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-3">
          <Button
            type="default"
            disabled={isLoading}
            onClick={handleClose}
            className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200! border-none text-slate-800 font-semibold text-base"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={!isLocalFilled}
            className={`flex-1 h-11 rounded-xl border-none font-semibold text-base ${
              isLocalFilled
                ? "bg-slate-800! hover:bg-slate-900! text-white!"
                : "bg-slate-300! text-white! cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RoomRangeModal;
