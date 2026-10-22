import React, { useState } from "react";
import {
  Modal,
  Form,
  Radio,
  DatePicker,
  Button,
  ConfigProvider,
  message,
} from "antd";
import {
  CalendarOutlined,
  MinusOutlined,
  PlusOutlined,
  LockOutlined,
} from "@ant-design/icons";

const CloseRoomModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  // State management for form selections
  const [closeType, setCloseType] = useState("all"); // 'all' | 'specific'
  const [roomCount, setRoomCount] = useState(0);
  const [periodType, setPeriodType] = useState("range"); // 'now' | 'range'
  const [selectedDates, setSelectedDates] = useState(null);

  // Reset form states
  const resetForm = () => {
    setCloseType("all");
    setRoomCount(0);
    setPeriodType("range");
    setSelectedDates(null);
    form.resetFields();
  };

  const handleIncrement = () => {
    setRoomCount((prev) => prev + 1);
    if (closeType !== "specific") {
      setCloseType("specific");
    }
  };

  const handleDecrement = () => {
    setRoomCount((prev) => Math.max(0, prev - 1));
    if (closeType !== "specific") {
      setCloseType("specific");
    }
  };

  // Form Submission
  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        const payload = {
          closeType,
          roomCount: closeType === "specific" ? roomCount : "All",
          periodType,
          dateRange: periodType === "range" ? selectedDates : "Now",
        };
        console.log("payload", payload);
        message.success({
          content: `Successfully submitted! ${
            closeType === "all"
              ? "Close All Dulux selected"
              : `Close ${roomCount} room(s) selected`
          }`,
          duration: 3,
        });

        onClose();
      })
      .catch((err) => {
        console.error("Validation failed:", err);
      });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={440}
      closeIcon={
        <span className="text-slate-400 hover:text-slate-700 text-base font-bold transition-colors">
          ✕
        </span>
      }
    >
      <div className="flex flex-col select-none overflow-hidden rounded-3xl">
        {/* Modal Form Body */}
        <Form form={form} layout="vertical" className="p-6">
          {/* SECTION 1: Close Room */}
          <section className="mb-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Close Room
            </h3>

            <Radio.Group
              value={closeType}
              onChange={(e) => setCloseType(e.target.value)}
              className="w-full space-y-4 flex flex-col"
            >
              {/* Option 1: Close All Dulux */}
              <div className="flex items-center">
                <Radio
                  value="all"
                  className="text-slate-800 font-semibold text-base"
                >
                  Close All Dulux
                </Radio>
              </div>

              {/* Option 2: Close + Counter */}
              <div className="flex items-center space-x-3">
                <Radio
                  value="specific"
                  className="text-slate-800 font-semibold text-base"
                >
                  Close
                </Radio>

                {/* Counter Widget */}
                <div
                  onClick={() => setCloseType("specific")}
                  className={`inline-flex items-center bg-[#ebf1ff] rounded-xl px-3 py-1.5 space-x-4 cursor-pointer transition-all duration-200 ${
                    closeType === "specific"
                      ? "ring-2 ring-blue-500/40 bg-[#e4edff]"
                      : "hover:bg-[#e4edff]"
                  }`}
                >
                  {/* Decrement (-) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrement();
                    }}
                    aria-label="Decrease room count"
                    className="text-blue-600 hover:text-blue-800 active:scale-90 transition-transform p-1 text-xs font-bold focus:outline-none"
                  >
                    <MinusOutlined />
                  </button>

                  {/* Display Count */}
                  <span className="font-bold text-slate-800 min-w-4.5 text-center text-base select-none">
                    {roomCount}
                  </span>

                  {/* Increment (+) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrement();
                    }}
                    aria-label="Increase room count"
                    className="text-blue-600 hover:text-blue-800 active:scale-90 transition-transform p-1 text-xs font-bold focus:outline-none"
                  >
                    <PlusOutlined />
                  </button>
                </div>
              </div>
            </Radio.Group>
          </section>

          <hr className="border-gray-100 my-5" />

          {/* SECTION 2: Closing Period */}
          <section className="mb-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Closing Period
            </h3>

            <Radio.Group
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
              className="w-full space-y-4 flex flex-col"
            >
              <div className="flex items-center">
                <Radio
                  value="now"
                  className="text-slate-800 font-semibold text-base"
                >
                  Close Now
                </Radio>
              </div>

              <div className="flex items-center">
                <Radio
                  value="range"
                  className="text-slate-800 font-semibold text-base"
                >
                  Select Date Range
                </Radio>
              </div>
            </Radio.Group>

            {/* Range Picker */}
            {periodType === "range" && (
              <div className="mt-4">
                <DatePicker.RangePicker
                  className="w-full py-3 px-4 rounded-xl border border-indigo-100 bg-[#f0f4ff] hover:border-blue-400 focus:border-blue-600 transition-all shadow-sm"
                  suffixIcon={
                    <CalendarOutlined className="text-blue-600 text-lg" />
                  }
                  onChange={(dates) => setSelectedDates(dates)}
                  placeholder={["Start Date", "End Date"]}
                />
              </div>
            )}
          </section>
        </Form>
        {/* Modal Footer Actions */}
        <footer className="px-6 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 bg-white">
          <Button
            type="text"
            size="large"
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold rounded-xl h-12 border-none transition-all"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            className="bg-[#002eff] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl h-12 shadow-md shadow-blue-500/20 border-none transition-all"
          >
            Close
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default CloseRoomModal;
