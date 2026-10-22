import React, { useEffect } from "react";
import { Modal, Form, Button, InputNumber } from "antd";
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";

const AddRoomModalForOTA = ({ isOpen, onClose, roomType, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (roomType) {
      form.setFieldsValue({ roomCount: roomType.available_rooms || 0 });
    }
  }, [roomType, form]);

  const handleSave = (values) => {
    if (onSave) {
      onSave({
        room_type_id: roomType?.room_type_id || roomType?.id,
        total_rooms: values.roomCount,
      });
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      centered
      className="rounded-t-3xl overflow-hidden"
      modalRender={(modal) => (
        <div className="rounded-3xl overflow-hidden bg-white shadow-2xl">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3"></div>
          {modal}
        </div>
      )}
    >
      <div className="p-4">
        <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
          Add Room {roomType ? `(${roomType.room_type_name})` : ""}
        </h2>

        {/* Ant Design Form */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{ roomCount: 0 }}
          onFinish={handleSave}
        >
          <Form.Item
            label={
              <span className="font-semibold text-gray-700 text-sm">
                Total Room Count <span className="text-red-500">*</span>
              </span>
            }
            name="roomCount"
            rules={[
              { required: true, message: "Please input total room count!" },
            ]}
          >
            {/* Counter UI Box (- 0 +) */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1.5 w-full justify-between border border-gray-200">
              <Button
                type="text"
                icon={<MinusOutlined />}
                onClick={() => {
                  const current = form.getFieldValue("roomCount") || 0;
                  if (current > 0)
                    form.setFieldsValue({ roomCount: current - 1 });
                }}
                className="flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-lg w-10 h-10"
              />

              <Form.Item name="roomCount" noStyle>
                <InputNumber
                  bordered={false}
                  controls={false}
                  min={0}
                  className="w-24 text-center text-lg font-bold text-gray-900"
                />
              </Form.Item>

              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => {
                  const current = form.getFieldValue("roomCount") || 0;
                  form.setFieldsValue({ roomCount: current + 1 });
                }}
                className="flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-lg w-10 h-10"
              />
            </div>
          </Form.Item>

          <div className="flex gap-3 mt-8 mb-2">
            <Button
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 border-none font-semibold text-gray-700 text-base shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-base shadow-md"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddRoomModalForOTA;
