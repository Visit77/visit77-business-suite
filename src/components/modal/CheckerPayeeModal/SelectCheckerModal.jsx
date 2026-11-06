import React from "react";
import { Modal, Spin } from "antd";
import { UserOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";

const SelectCheckerModal = ({
  open,
  onCancel,
  isPending,
  data,
  onSelectChecker,
  onRemoveChecker,
  onOpenAddChecker,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      centered
      className="custom-bottom-sheet-modal"
      width={420}
    >
      <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

      <h3 className="text-lg font-bold text-center text-gray-900 mb-6">
        Select Checker
      </h3>

      <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-1">
        {isPending ? (
          <div className="flex justify-center py-6">
            <Spin />
          </div>
        ) : data && data.length > 0 ? (
          data.map((checker) => (
            <div
              key={checker.id}
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition"
            >
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => onSelectChecker(checker)}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <UserOutlined className="text-lg" />
                </div>
                <span className="font-semibold text-gray-900 text-base">
                  {checker.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveChecker(checker.id);
                }}
                className="text-red-500 hover:text-red-600 font-medium text-sm transition"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No checkers found.</p>
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={onOpenAddChecker}
          className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition text-base"
        >
          <PlusOutlined className="text-lg" />
          <span>Add Checker</span>
        </button>
      </div>
    </Modal>
  );
};

export default SelectCheckerModal;
