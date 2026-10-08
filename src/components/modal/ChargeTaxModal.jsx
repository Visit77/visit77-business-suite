import React, { useState, useEffect } from "react";
import { Modal, Radio, Input, Checkbox, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ChargeTaxModal = ({ visible, onClose, onSave, title, initialData }) => {
  const [chargeType, setChargeType] = useState("included");
  const [percentage, setPercentage] = useState("0");
  const [fixAmount, setFixAmount] = useState("0");

  // Checkbox ၃ ခုထဲက တစ်ခုပဲ ရွေးလို့ရအောင် selectedOption (string) အဖြစ် ပြောင်းလဲထားပါသည်
  const [selectedOption, setSelectedOption] = useState("perBooking");

  useEffect(() => {
    if (initialData) {
      setChargeType(initialData.type || "included");
      setPercentage(initialData.percentage || "0");
      setFixAmount(initialData.fixAmount || "0");

      // initialData ထဲက options object ကို စစ်ပြီး သက်ဆိုင်ရာ selectedOption ကို သတ်မှတ်ခြင်း
      if (initialData.options) {
        if (initialData.options.perGuest) {
          setSelectedOption("perGuest");
        } else if (initialData.options.perRoom) {
          setSelectedOption("perRoom");
        } else {
          setSelectedOption("perBooking");
        }
      }
    } else if (visible) {
      // initialData မရှိရင် Default Value များ ပြန်သတ်မှတ်ခြင်း
      setChargeType("included");
      setPercentage("0");
      setFixAmount("0");
      setSelectedOption("perBooking");
    }
  }, [initialData, visible]);

  const handleSave = () => {
    // Parent component သို့ ပေးပို့မည့် options ကို object structure အဖြစ် ပြန်ဖွဲ့ခြင်း
    const options = {
      perBooking: selectedOption === "perBooking",
      perGuest: selectedOption === "perGuest",
      perRoom: selectedOption === "perRoom",
    };

    onSave({ type: chargeType, percentage, fixAmount, options });
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
      className="top-auto bottom-0 m-0 p-0 max-w-full sm:max-w-md sm:relative sm:bottom-auto"
      bodyStyle={{ padding: "24px", borderRadius: "24px 24px 0 0" }}
    >
      {/* Modal Handle Line */}
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

      <h3 className="text-lg font-bold text-gray-800 mb-6">"{title}"</h3>

      <div className="space-y-4">
        {/* Radio Options */}
        <div
          onClick={() => setChargeType("included")}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <Radio
            checked={chargeType === "included"}
            className="text-indigo-600"
          />
          <span
            className={`text-base font-medium ${chargeType === "included" ? "text-[#4f46e5]" : "text-gray-700"}`}
          >
            Included
          </span>
        </div>

        <div>
          <div
            onClick={() => setChargeType("percentage")}
            className="flex items-center space-x-3 cursor-pointer mb-2"
          >
            <Radio checked={chargeType === "percentage"} />
            <span
              className={`text-base font-medium ${chargeType === "percentage" ? "text-[#4f46e5]" : "text-gray-700"}`}
            >
              Percentage on Subtotal
            </span>
          </div>
          {chargeType === "percentage" && (
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

        <div>
          <div
            onClick={() => setChargeType("fixed")}
            className="flex items-center space-x-3 cursor-pointer mb-2"
          >
            <Radio checked={chargeType === "fixed"} />
            <span
              className={`text-base font-medium ${chargeType === "fixed" ? "text-[#4f46e5]" : "text-gray-700"}`}
            >
              Fix Amount
            </span>
          </div>

          {chargeType === "fixed" && (
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

              {/* Checkboxes (Single Selection) */}
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

      {/* Buttons */}
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

export default ChargeTaxModal;
