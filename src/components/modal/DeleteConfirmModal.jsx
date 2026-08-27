import React from "react";
import { Modal, Button } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col items-center text-center p-2 space-y-4">
        {/* Warning Icon Container */}
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xl">
          <ExclamationCircleFilled />
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500 max-w-70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 w-full pt-2">
          <Button
            onClick={onClose}
            disabled={loading}
            className="w-1/2 h-10 rounded-xl text-xs font-semibold border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            danger
            loading={loading}
            onClick={onConfirm}
            className="w-1/2 h-10 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 shadow-xs"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
