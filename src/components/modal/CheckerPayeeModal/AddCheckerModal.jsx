import React from "react";
import { Modal, Input, Form } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CloseOutlined,
} from "@ant-design/icons";

const AddCheckerModal = ({ open, onCancel, form, onFinish }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      centered
      width={420}
    >
      <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

      <h3 className="text-lg font-bold text-center text-gray-900 mb-6">
        Add Checker
      </h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="font-semibold text-gray-800 text-base">Name</span>
          }
          name="name"
          rules={[{ required: true, message: "Please input  name!" }]}
          className="mb-5"
        >
          <Input
            placeholder="Type  Name"
            className="h-12 rounded-xl text-base border-gray-300 focus:border-blue-600 hover:border-gray-400"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-semibold text-gray-800 text-base">
              Create 4-digit Passcode
            </span>
          }
          name="passcode"
          rules={[
            { required: true, message: "Please input 4-digit passcode!" },
            { len: 4, message: "Passcode must be exactly 4 digits!" },
          ]}
          className="mb-5"
        >
          <Input.Password
            placeholder="Type Passcode"
            maxLength={4}
            iconRender={(visible) =>
              visible ? (
                <EyeTwoTone />
              ) : (
                <EyeInvisibleOutlined className="text-gray-700" />
              )
            }
            className="h-12 rounded-xl text-base border-gray-300 focus:border-blue-600 hover:border-gray-400"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="font-semibold text-gray-800 text-base">
              Confirm Passcode
            </span>
          }
          name="confirmPasscode"
          dependencies={["passcode"]}
          rules={[
            { required: true, message: "Please confirm your passcode!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("passcode") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passcodes do not match!"));
              },
            }),
          ]}
          className="mb-8"
        >
          <Input.Password
            placeholder="Type Passcode"
            maxLength={4}
            iconRender={(visible) =>
              visible ? (
                <EyeTwoTone />
              ) : (
                <EyeInvisibleOutlined className="text-gray-700" />
              )
            }
            className="h-12 rounded-xl text-base border-gray-300 focus:border-blue-600 hover:border-gray-400"
          />
        </Form.Item>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 w-full bg-slate-100 hover:bg-slate-200 text-gray-800 font-semibold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200"
          >
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCheckerModal;
