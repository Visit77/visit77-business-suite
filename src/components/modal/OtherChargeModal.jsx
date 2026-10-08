import React, { useState, useEffect } from "react";
import { Modal, Input, Radio, Checkbox, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const OtherChargeModal = ({ visible, onClose, onSave, title }) => {
  const [chargeTitle, setChargeTitle] = useState("");
  const [type, setType] = useState("percentage");
  const [percentage, setPercentage] = useState("0");
  const [fixAmount, setFixAmount] = useState("0");

  // Checkbox ၃ ခုထဲက တစ်ခုပဲ ရွေးလို့ရအောင် state ကို string အဖြစ် ပြောင်းလဲထားပါသည်
  const [selectedOption, setSelectedOption] = useState("perBooking");

  useEffect(() => {
    if (visible) {
      setChargeTitle("");
      setType("percentage");
      setPercentage("0");
      setFixAmount("0");
      setSelectedOption("perBooking"); // Reset standard value
    }
  }, [visible]);

  const handleSave = () => {
    onSave({
      title: chargeTitle,
      type,
      percentage,
      fixAmount,
      // ယခင် data structure (object) အတိုင်း ပြန်လည်ပေးပို့ချင်ပါက dynamic object ဖွဲ့ပေးထားပါသည်
      options: {
        perBooking: selectedOption === "perBooking",
        perGuest: selectedOption === "perGuest",
        perRoom: selectedOption === "perRoom",
      },
    });
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      className="top-auto bottom-0 m-0 p-0 max-w-full sm:max-w-md"
      bodyStyle={{ padding: "24px", borderRadius: "24px 24px 0 0" }}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

      <h3 className="text-lg font-bold text-gray-800 mb-6">"{title}"</h3>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Charge Name"
            value={chargeTitle}
            onChange={(e) => setChargeTitle(e.target.value)}
            className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800"
          />
        </div>

        {/* Percentage Option */}
        <div>
          <div
            onClick={() => setType("percentage")}
            className="flex items-center space-x-3 cursor-pointer mb-2"
          >
            <Radio checked={type === "percentage"} />
            <span
              className={`text-base font-medium ${type === "percentage" ? "text-[#4f46e5]" : "text-gray-700"}`}
            >
              Percentage on Subtotal
            </span>
          </div>
          {type === "percentage" && (
            <div className="ml-7 mt-2">
              <Input
                suffix="%"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800 font-semibold"
              />
            </div>
          )}
        </div>

        {/* Fix Amount Option */}
        <div>
          <div
            onClick={() => setType("fixed")}
            className="flex items-center space-x-3 cursor-pointer mb-2"
          >
            <Radio checked={type === "fixed"} />
            <span
              className={`text-base font-medium ${type === "fixed" ? "text-[#4f46e5]" : "text-gray-700"}`}
            >
              Fix Amount
            </span>
          </div>

          {type === "fixed" && (
            <div className="ml-7 mt-3 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                  MMK
                </span>
                <Input
                  value={fixAmount}
                  onChange={(e) => setFixAmount(e.target.value)}
                  className="bg-slate-50 border-gray-300 rounded-lg py-2.5 text-gray-800 font-semibold"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <Checkbox
                    checked={selectedOption === "perBooking"}
                    onChange={() => setSelectedOption("perBooking")}
                    className={
                      selectedOption === "perBooking"
                        ? "text-indigo-600 font-medium"
                        : "text-gray-700 font-medium"
                    }
                  >
                    Per Booking / Night
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    checked={selectedOption === "perGuest"}
                    onChange={() => setSelectedOption("perGuest")}
                    className={
                      selectedOption === "perGuest"
                        ? "text-indigo-600 font-medium"
                        : "text-gray-700 font-medium"
                    }
                  >
                    Per Guest / Night
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    checked={selectedOption === "perRoom"}
                    onChange={() => setSelectedOption("perRoom")}
                    className={
                      selectedOption === "perRoom"
                        ? "text-indigo-600 font-medium"
                        : "text-gray-700 font-medium"
                    }
                  >
                    Per Room / Night
                  </Checkbox>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Actions */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        <Button
          onClick={onClose}
          className="h-12 rounded-xl bg-gray-100 border-0 text-gray-700 font-semibold hover:bg-gray-200"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          className="h-12 rounded-xl bg-[#4f46e5] hover:bg-[#3730a3] text-white font-semibold"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default OtherChargeModal;
