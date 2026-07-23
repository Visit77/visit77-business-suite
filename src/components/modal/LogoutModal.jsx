import React from "react";
import { Modal, Button } from "antd";
import {
  LogoutOutlined,
  SwapOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const LogoutModal = ({
  open,
  onClose,
  onLogout,
  onSwitchBusiness,
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="rounded-2xl overflow-hidden"
      destroyOnClose
    >
      <div className="p-4 text-center space-y-5">
        {/* Warning Icon Header */}
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
          <ExclamationCircleOutlined />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-800">Confirm Log Out</h3>
          <p className="text-md text-slate-500 leading-relaxed px-2">
            Are you sure you want to log out? If you just want to manage another
            business, you can switch instead.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* 1. Switch Business Button */}
          <Button
            type="default"
            icon={<SwapOutlined />}
            onClick={() => {
              onClose();
              if (onSwitchBusiness) onSwitchBusiness();
            }}
            className="w-full h-11!  font-bold! rounded-xl! border-blue-200! text-blue-600! hover:bg-blue-50!  text-xs! flex items-center justify-center space-x-1"
          >
            Switch Business
          </Button>

          {/* 2. Log Out Button */}
          <Button
            type="primary"
            danger
            loading={loading}
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className="w-full h-11! rounded-xl! bg-red-600! hover:bg-red-700! font-bold! text-xs! flex items-center justify-center space-x-1"
          >
            Log Out
          </Button>

          {/* 3. Cancel Button */}
          <Button
            type="default"
            onClick={onClose}
            className="w-full h-9! text-slate-400 hover:text-slate-600 text-xs! font-bold"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
