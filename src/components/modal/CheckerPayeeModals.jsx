import React, { useEffect, useState } from "react";
import { Modal, Input, Form, Spin, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  createHotelChecker,
  getHotelChecker,
  hotelCheckerSelector,
  removeHotelChecker,
} from "../../service/hotelCheckerSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import _ from "lodash";
import { confirmReceive } from "../../service/otaRevenueSlice";

const CheckerPayeeModals = ({
  isSelectCheckerOpen,
  setIsSelectCheckerOpen,
  remittance,
}) => {
  const [isAddPayeeOpen, setIsAddPayeeOpen] = useState(false);
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [selectedChecker, setSelectedChecker] = useState(null);
  const [passcode, setPasscode] = useState(["", "", "", ""]);

  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);

  const { data, isPending } = useSelector(hotelCheckerSelector);

  useEffect(() => {
    if (businessId && isSelectCheckerOpen === true) {
      dispatch(
        getHotelChecker({
          business_id: businessId,
        }),
      );
    }
  }, [dispatch, businessId, isSelectCheckerOpen]);

  const [form] = Form.useForm();

  const handleAddPayee = (values) => {
    dispatch(
      createHotelChecker({ business_id: businessId, data: values }),
    ).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success("Success");
      } else {
        message.error("Error");
      }
    });
    setIsAddPayeeOpen(false);
    form.resetFields();
  };

  const handleRemoveChecker = (id) => {
    dispatch(removeHotelChecker({ id: id, business_id: businessId })).then(
      (response) => {
        if (_.endsWith(response.type, "fulfilled")) {
          message.success("Success");
        } else {
          message.error("Error");
        }
      },
    );
  };

  const handleSelectCheckerItem = (checker) => {
    setSelectedChecker(checker);
    setIsSelectCheckerOpen(false);
    setIsPasscodeOpen(true);
    setPasscode(["", "", "", ""]);
  };

  const handlePasscodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newPasscode = [...passcode];
      newPasscode[index] = value;
      setPasscode(newPasscode);

      if (value && index < 3) {
        const nextInput = document.getElementById(
          `passcode-input-${index + 1}`,
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleConfirmPasscode = () => {
    const enteredPasscode = passcode.join("");
    if (enteredPasscode.length !== 4) {
      message.error("Please enter a 4-digit passcode");
      return;
    }

    dispatch(
      confirmReceive({
        business_id: businessId,
        id: remittance?.id,
        data: { actor_id: selectedChecker?.id, passcode: enteredPasscode },
      }),
    ).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success("Success");
      } else {
        message.error("Error");
      }
    });

    setIsPasscodeOpen(false);
  };

  return (
    <div>
      {/* ---------------- 1. SELECT CHECKER MODAL ---------------- */}
      <Modal
        open={isSelectCheckerOpen}
        onCancel={() => setIsSelectCheckerOpen(false)}
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
                  onClick={() => handleSelectCheckerItem(checker)}
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
                    handleRemoveChecker(checker.id);
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
            onClick={() => {
              setIsSelectCheckerOpen(false);
              setIsAddPayeeOpen(true);
            }}
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition text-base"
          >
            <PlusOutlined className="text-lg" />
            <span>Add Payee</span>
          </button>
        </div>
      </Modal>

      {/* ---------------- 2. ENTER 4-DIGIT PASSCODE MODAL (ပုံထဲပါသည့်အတိုင်း) ---------------- */}
      <Modal
        open={isPasscodeOpen}
        onCancel={() => setIsPasscodeOpen(false)}
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
              onChange={(e) => handlePasscodeChange(e.target.value, index)}
              className="w-14 h-14 text-center text-xl font-bold border-2 border-indigo-200 focus:border-indigo-600 rounded-2xl outline-none transition bg-gray-50 focus:bg-white"
            />
          ))}
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={handleConfirmPasscode}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-200"
        >
          Confirm
        </button>
      </Modal>

      {/* ---------------- 3. ADD PAYEE MODAL ---------------- */}
      <Modal
        open={isAddPayeeOpen}
        onCancel={() => setIsAddPayeeOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined className="text-gray-500 text-lg" />}
        centered
        width={420}
      >
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <h3 className="text-lg font-bold text-center text-gray-900 mb-6">
          Add Payee
        </h3>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPayee}
          requiredMark={false}
        >
          <Form.Item
            label={
              <span className="font-semibold text-gray-800 text-base">
                Name
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Please input payee name!" }]}
            className="mb-5"
          >
            <Input
              placeholder="Type Payee Name"
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
              onClick={() => setIsAddPayeeOpen(false)}
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
    </div>
  );
};

export default CheckerPayeeModals;
