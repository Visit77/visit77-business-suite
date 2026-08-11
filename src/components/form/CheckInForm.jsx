import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getDotColor,
  getRoomBorderStyle,
  getRoomCardStyle,
  nrcCodes,
  nrcTownships,
  nrcTypes,
} from "../../utils/utils";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const CheckInForm = ({ data }) => {
  const [form] = Form.useForm();
  const [guestType, setGuestType] = useState("Local");
  const [guests, setGuests] = useState([{ id: 1 }]);
  const [selectedCode, setSelectedCode] = useState("12");

  const handleAddGuest = () => {
    setGuests([...guests, { id: guests.length + 1 }]);
  };

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
  };

  const navigate = useNavigate();

  return (
    <div className=" px-3">
      {/* 1. Header Banner */}
      <div className="py-4  space-y-1 px-1">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-extrabold text-neutral-900">
            #{data?.room_number}
          </h2>
          <span
            className={`${getDotColor(data?.display_status)} text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider`}
          >
            {data?.display_status}
          </span>
        </div>
        <p className="text-xs font-medium text-neutral-500 mt-1.5">
          {data?.room_type?.name} &nbsp;
          {_.map(data?.core_snapshot?.beds, (bed, index) => {
            return <span key={index}>.&nbsp;{bed?.bed_type?.name}&nbsp;</span>;
          })}
          {data?.core_snapshot?.room_view?.name && (
            <span>.&nbsp;{data?.core_snapshot?.room_view?.name}</span>
          )}
          {data?.core_snapshot?.room_area && <span>.&nbsp;</span>}
          {data?.core_snapshot?.room_area}
          {data?.core_snapshot?.area_unit}
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          physical_room_id: data?.id,
          rate_plan_id: "",
          check_in: dayjs(),
          check_out: dayjs().add(1, "day"),
          adults: 2,
          children: 0,
          guest_market: "Local",
        }}
        className="space-y-3"
      >
        {/* 2. Dates & Guest Count Card */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Check-in" name="check_in" className="mb-0">
              <DatePicker
                format="DD MMM YYYY"
                className="w-full h-10 rounded-xl bg-neutral-50 border-neutral-200"
                suffixIcon={<CalendarOutlined className="text-blue-500" />}
              />
            </Form.Item>

            <Form.Item label="Check-out" name="check_out" className="mb-0">
              <DatePicker
                format="DD MMM YYYY"
                className="w-full h-10 rounded-xl bg-neutral-50 border-neutral-200"
                suffixIcon={<CalendarOutlined className="text-blue-500" />}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Adult" name="adults" className="mb-0">
              <Select className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50!">
                {Array.from({ length: 11 }, (_, i) => (
                  <Option key={i} value={i}>
                    {i}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Child" name="children" className="mb-0">
              <Select className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50!">
                {Array.from({ length: 11 }, (_, i) => (
                  <Option key={i} value={i}>
                    {i}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="pt-2 flex justify-center space-x-6">
            <Form.Item name="guest_market" className="mb-0">
              <Radio.Group
                onChange={(e) => setGuestType(e.target.value)}
                value={guestType}
                className="flex space-x-6"
              >
                <Radio
                  value="Local"
                  className="text-xs font-semibold text-indigo-600"
                >
                  Local
                </Radio>
                <Radio
                  value="Foreigner"
                  className="text-xs font-semibold text-neutral-600"
                >
                  Foreigner
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>

        {/* 3. Guest Information Section */}
        {guests.map((guest, index) => (
          <div
            key={guest.id}
            className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3"
          >
            <div className="text-xs font-bold text-teal-500 tracking-wider">
              Guest Information {guests.length > 1 ? `#${index + 1}` : ""}
            </div>

            <Form.Item
              label={
                <span className="text-xs font-semibold text-neutral-600">
                  {"Name".toMultiLan()} <span className="text-red-500">*</span>
                </span>
              }
              name={["guests", index, "name"]}
              rules={[{ required: true, message: "Please enter name" }]}
              className="mb-2"
            >
              <Input
                placeholder="Type Here..."
                className="h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-semibold text-neutral-600">
                  Phone Number <span className="text-red-500">*</span>
                </span>
              }
              name={["guests", index, "phone"]}
              rules={[{ required: true, message: "Please enter phone number" }]}
              className="mb-2"
            >
              <Input
                placeholder="Type Here..."
                className="h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-xs font-semibold text-neutral-600">
                  Email <span className="text-red-500">*</span>
                </span>
              }
              name={["guests", index, "email"]}
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter valid email",
                },
              ]}
              className="mb-2"
            >
              <Input
                placeholder="Type Here..."
                className="h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs"
              />
            </Form.Item>

            {guestType === "Local" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">
                  NRC Number
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <Form.Item
                    name={["guests", index, "nrcCode"]}
                    className="mb-0"
                  >
                    <Select
                      onChange={(val) => setSelectedCode(val)}
                      className="h-9 [&_.ant-select-selector]:rounded-xl! text-xs"
                    >
                      {nrcCodes.map((code) => (
                        <Option key={code} value={code}>
                          {code}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={["guests", index, "nrcTownship"]}
                    className="mb-0"
                  >
                    <Select className="h-9 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50! text-xs">
                      {(nrcTownships[selectedCode] || []).map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={["guests", index, "nrcType"]}
                    className="mb-0"
                  >
                    <Select className="h-9 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50! text-xs">
                      {nrcTypes.map((type) => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <Form.Item
                  name={["guests", index, "nrcNumber"]}
                  className="mb-2 pt-1"
                >
                  <Input
                    placeholder="Enter NRC Number..."
                    className="h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs"
                  />
                </Form.Item>
              </div>
            ) : (
              <Form.Item
                label={
                  <span className="text-xs font-semibold text-neutral-600">
                    Passport Number
                  </span>
                }
                name={["guests", index, "passport"]}
                className="mb-2"
              >
                <Input
                  placeholder="Enter Passport Number..."
                  className="h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs"
                />
              </Form.Item>
            )}

            <Form.Item
              name={["guests", index, "identityPhoto"]}
              className="mb-0"
            >
              <Upload maxCount={1} showUploadList={false}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="w-full h-10 rounded-xl bg-white! text-secondary-500! border-secondary-500! text-xs font-semibold border-none flex items-center justify-center space-x-1"
                >
                  Upload Identity Photo
                </Button>
              </Upload>
            </Form.Item>
          </div>
        ))}

        {/* Add Guest Button */}
        <button
          type="button"
          onClick={handleAddGuest}
          className="flex items-center space-x-1 text-teal-600 text-xs font-bold hover:text-teal-700 transition-colors py-1 cursor-pointer"
        >
          <PlusOutlined className="text-xs" />
          <span>Add Another Guest Information</span>
        </button>

        {/* 4. Special Request Section */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
          <label className="text-xs font-semibold text-neutral-600 block">
            Special Request
          </label>
          <Form.Item name="specialRequest" className="mb-0">
            <TextArea
              rows={3}
              placeholder="Enter Special Request ..."
              className="rounded-xl bg-neutral-50 border-neutral-200 text-xs p-2.5 resize-none"
            />
          </Form.Item>
        </div>

        {/* 5. Payment Section */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-teal-500 tracking-wider uppercase">
            Payment
          </div>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-neutral-600">
                Payment Method <span className="text-red-500">*</span>
              </span>
            }
            name="paymentMethod"
            rules={[{ required: true }]}
            className="mb-2"
          >
            <Select className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50! text-xs">
              <Option value="MMQR">MMQR</Option>
              <Option value="KBZ Pay">KBZ Pay</Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-neutral-600">
                Status <span className="text-red-500">*</span>
              </span>
            }
            name="paymentStatus"
            rules={[{ required: true }]}
            className="mb-2"
          >
            <Select className="w-full h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50! text-xs">
              <Option value="Paid">Paid</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-600 block">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <Form.Item name="currency" className="mb-0 w-24">
                <Select className="h-10 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:bg-neutral-50! text-xs">
                  <Option value="MMK">MMK</Option>
                  <Option value="USD">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="amount"
                rules={[{ required: true, message: "Please enter amount" }]}
                className="mb-0 flex-1"
              >
                <Input
                  type="number"
                  placeholder="50000"
                  className="h-10 rounded-xl bg-neutral-50 border-neutral-200 text-xs font-semibold"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* 6. Footer Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            className="h-11 rounded-xl bg-neutral-200/80 hover:bg-neutral-300 border-none text-neutral-700 font-bold text-xs"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none text-white font-bold text-xs shadow-xs"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CheckInForm;
