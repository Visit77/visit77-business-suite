import React, { useState } from "react";
import { Modal, Form, Radio, DatePicker, Button, Input, message } from "antd";
import {
  CalendarOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { closeRoomForOta } from "../../service/otaManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";

const CloseRoomModal = ({
  isOpen,
  onClose,
  roomTypeId,

  maxAvailableRooms,
}) => {
  const [form] = Form.useForm();

  // Local state for room count
  const [roomCount, setRoomCount] = useState(0);

  // Watch form values to control dynamic UI rendering
  const closeType = Form.useWatch("closeType", form) || "all";
  const periodType = Form.useWatch("periodType", form) || "now";
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  // Reset form states
  const resetForm = () => {
    form.resetFields();
    setRoomCount(0);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  // Increment with max limit validation
  const handleIncrement = () => {
    if (roomCount < maxAvailableRooms) {
      const nextCount = roomCount + 1;
      setRoomCount(nextCount);
      form.setFieldsValue({
        rooms_to_close: nextCount,
        closeType: "specific",
      });
    } else {
      message.warning(
        `Available rooms ထက် ကျော်လွန်၍မရပါ (အများဆုံး: ${maxAvailableRooms})`,
      );
    }
  };

  // Decrement
  const handleDecrement = () => {
    const nextCount = Math.max(0, roomCount - 1);
    setRoomCount(nextCount);
    form.setFieldsValue({
      rooms_to_close: nextCount,
      closeType: "specific",
    });
  };

  // Form Submission
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const dateRange = values.dateRange;
        const payload = {
          room_type: roomTypeId,
          closure_mode: values.periodType === "now" ? "close_now" : "scheduled",
          close_all: values.closeType === "all",
          rooms_to_close: values.closeType === "specific" ? roomCount : 0,
          note: values.note || "",
        };

        if (
          values.periodType === "scheduled" &&
          dateRange &&
          dateRange[0] &&
          dateRange[1]
        ) {
          payload.start_date = dayjs(dateRange[0]).format("YYYY-MM-DD");
          payload.end_date = dayjs(dateRange[1]).format("YYYY-MM-DD");
        }

        message.success({
          content: "Successfully submitted room closure!",
          duration: 3,
        });
        dispatch(
          closeRoomForOta({
            business_id: businessId,
            data: {
              ...payload,
            },
          }),
        ).then((response) => {
          if (_.endsWith(response.type, "fulfilled")) {
            message.success("Success");
            handleCloseModal();
          } else {
            message.error("Error");
          }
        });
        handleCloseModal();
      })
      .catch((err) => {
        console.error("Validation failed:", err);
      });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCloseModal}
      footer={null}
      centered
      // width={440}
    >
      <div className="flex flex-col select-none overflow-hidden rounded-3xl">
        {/* Modal Form Body */}
        <Form
          form={form}
          layout="vertical"
          className="p-6"
          initialValues={{
            closeType: "all",
            rooms_to_close: 0,
            periodType: "now",
          }}
        >
          {/* SECTION 1: Close Room */}
          <section className="mb-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 m-0">
                Close Room
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Available: {maxAvailableRooms} rooms
              </span>
            </div>

            <Form.Item name="closeType" className="mb-0">
              <Radio.Group className="w-full space-y-4 flex flex-col">
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
                    onClick={() =>
                      form.setFieldsValue({ closeType: "specific" })
                    }
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
                      className={`p-1 text-xs font-bold focus:outline-none transition-transform ${
                        roomCount >= maxAvailableRooms
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-800 active:scale-90"
                      }`}
                    >
                      <PlusOutlined />
                    </button>
                  </div>
                </div>
              </Radio.Group>
            </Form.Item>
          </section>

          <hr className="border-gray-100 my-5" />

          {/* SECTION 2: Closing Period */}
          <section className="mb-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Closing Period
            </h3>

            <Form.Item name="periodType" className="mb-4">
              <Radio.Group className="w-full space-y-4 flex flex-col">
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
                    value="scheduled"
                    className="text-slate-800 font-semibold text-base"
                  >
                    Select Date Range (Scheduled)
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            {/* Range Picker */}
            {periodType === "scheduled" && (
              <Form.Item name="dateRange" className="mb-0">
                <DatePicker.RangePicker
                  className="w-full py-3 px-4 rounded-xl border border-indigo-100 bg-[#f0f4ff] hover:border-blue-400 focus:border-blue-600 transition-all shadow-sm"
                  suffixIcon={
                    <CalendarOutlined className="text-blue-600 text-lg" />
                  }
                  placeholder={["Start Date", "End Date"]}
                />
              </Form.Item>
            )}
          </section>

          <hr className="border-gray-100 my-5" />

          {/* SECTION 3: Note */}
          <section className="mb-2">
            <h3 className="text-base font-bold text-slate-900 mb-2">Note</h3>
            <Form.Item name="note" className="mb-0">
              <Input.TextArea
                rows={3}
                placeholder="Enter note (e.g., Maintenance)"
                className="rounded-xl border-indigo-100 bg-[#f0f4ff] p-3"
              />
            </Form.Item>
          </section>
        </Form>

        {/* Modal Footer Actions */}
        <footer className="px-6 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 bg-white">
          <Button
            type="text"
            size="large"
            onClick={handleCloseModal}
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
