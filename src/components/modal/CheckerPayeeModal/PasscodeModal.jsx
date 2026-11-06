import React from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const PasscodeModal = ({
  open,
  onCancel,
  passcode,
  onPasscodeChange,
  onConfirm,
}) => {
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

      <h3 className="text-lg font-bold text-center text-gray-900 mb-8">
        Enter 4-digit Passcode
      </h3>

      {/* 4 Passcode Input Boxes */}
      <div className="flex justify-center gap-3 mb-8">
        {passcode.map((digit, index) => (
          <input
            key={index}
            id={`passcode-input-${index}`}
            type="password"
            maxLength={1}
            value={digit}
            onChange={(e) => onPasscodeChange(e.target.value, index)}
            className="w-14 h-14 text-center text-xl font-bold border-2 border-indigo-200 focus:border-indigo-600 rounded-2xl outline-none transition bg-gray-50 focus:bg-white"
          />
        ))}
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={onConfirm}
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-200"
      >
        Confirm
      </button>
    </Modal>
  );
};

export default PasscodeModal;
