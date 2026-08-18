import React, { useState, useEffect } from "react";
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
  CalendarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getDotColor,
  nrcCodes,
  nrcTownships,
  nrcTypes,
} from "../../utils/utils";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  finalVerifiedCheckIn,
  updateCheckInInfo,
  walkInBooking,
} from "../../service/actionSlice";
import { selectBusinessId } from "../../service/businessSlice";

const { Option } = Select;
const { TextArea } = Input;

const parseNrcString = (nrcStr) => {
  if (!nrcStr)
    return {
      nrcCode: "12",
      nrcTownship: "MaYaKa",
      nrcType: "Naing",
      nrcNumber: "",
    };
  const match = nrcStr.match(/^(\d+)\/([^\(]+)\((.+)\)\/(.*)$/);
  if (match) {
    return {
      nrcCode: match[1],
      nrcTownship: match[2],
      nrcType: match[3],
      nrcNumber: match[4] === "undefined" ? "" : match[4],
    };
  }
  return {
    nrcCode: "12",
    nrcTownship: "MaYaKa",
    nrcType: "Naing",
    nrcNumber: "",
  };
};

// Ant Design Upload Event Handler Helper
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const CheckInForm = ({ data }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const businessId = useSelector(selectBusinessId);
  const [loading, setLoading] = useState(false);

  const [guests, setGuests] = useState([
    { id: 1, guestType: "local", selectedCode: "12", is_primary: true },
  ]);

  useEffect(() => {
    const booking = data?.current_booking;

    if (booking) {
      const bookingGuests =
        booking?.guests?.length > 0 ? booking.guests : [booking.primary_guest];

      const formattedGuestState = bookingGuests.map((g, index) => {
        const guestType = booking.guest_market || "local";
        const nrcParsed = parseNrcString(g?.nrc_number);
        return {
          id: g?.id || Date.now() + index,
          guestType: guestType,
          selectedCode: nrcParsed.nrcCode,
          is_primary: index === 0,
        };
      });

      setGuests(formattedGuestState);

      const formattedGuestsFormValue = bookingGuests.map((g) => {
        const nrcParsed = parseNrcString(g?.nrc_number);
        return {
          name: g?.name || "",
          phone: g?.phone || booking?.contact?.phone || "",
          email: g?.email || booking?.contact?.email || "",
          guestType: booking.guest_market || "local",
          nrcCode: nrcParsed.nrcCode,
          nrcTownship: nrcParsed.nrcTownship,
          nrcType: nrcParsed.nrcType,
          nrcNumber: nrcParsed.nrcNumber,
          identity_number: g?.passport_number || "",
          identityPhoto: g?.identity_photo_url
            ? [
                {
                  uid: "-1",
                  name: "identity.png",
                  status: "done",
                  url: g?.identity_photo_url,
                },
              ]
            : [],
        };
      });

      form.setFieldsValue({
        check_in: booking?.check_in ? dayjs(booking.check_in) : dayjs(),
        check_out: booking?.check_out
          ? dayjs(booking.check_out)
          : dayjs().add(1, "day"),
        adults: booking?.guest_count?.adults ?? 2,
        children: booking?.guest_count?.children ?? 0,
        guest_market: booking?.guest_market || "local",
        specialRequest: booking?.special_request || "",
        paymentMethod: booking?.payments?.[0]?.provider || "cash",
        paymentStatus: booking?.payment_status || "paid",
        guests: formattedGuestsFormValue,
      });
    }
  }, [data, form]);

  const handleAddGuest = () => {
    setGuests([
      ...guests,
      {
        id: Date.now(),
        guestType: form.getFieldValue("guest_market") || "local",
        selectedCode: "12",
      },
    ]);
  };

  const handleRemoveGuest = (index) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
  };

  const handleGuestTypeChange = (index, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index].guestType = value;
    setGuests(updatedGuests);
  };

  const handleNrcCodeChange = (index, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index].selectedCode = value;
    setGuests(updatedGuests);
  };

  const handleSubmit = (values) => {
    setLoading(true);

    const formData = new FormData();

    const formattedCheckIn = values?.check_in
      ? dayjs(values.check_in).format("YYYY-MM-DD")
      : "";
    const formattedCheckOut = values?.check_out
      ? dayjs(values.check_out).format("YYYY-MM-DD")
      : "";

    formData.append("check_in", formattedCheckIn);
    formData.append("check_out", formattedCheckOut);
    formData.append("physical_room_id", data?.id || "");
    formData.append("adults", values?.adults ?? 2);
    formData.append("children", values?.children ?? 0);
    formData.append("guest_market", values?.guest_market || "local");
    formData.append("special_request", values?.specialRequest || "");
    formData.append("contact_name", values?.guests?.[0]?.name || "");
    formData.append("contact_phone", values?.guests?.[0]?.phone || "");

    // Payment Data
    formData.append("payment[provider]", values?.paymentMethod || "cash");
    formData.append("payment[status]", values?.paymentStatus || "paid");
    formData.append("payment[payment_type]", "full_payment");

    const ratePlanId = data?.room_type?.rate_plans?.find(
      (plan) => plan?.guest_market === values?.guest_market,
    )?.id;
    if (ratePlanId) {
      formData.append("rate_plan_id", ratePlanId);
    }

    values?.guests?.forEach((guest, index) => {
      formData.append(`guests[${index}][is_primary]`, index === 0 ? "1" : "0");
      formData.append(`guests[${index}][name]`, guest?.name || "");
      formData.append(`guests[${index}][phone]`, guest?.phone || "");
      formData.append(`guests[${index}][email]`, guest?.email || "");

      if (guest?.guestType === "local") {
        const nrcNumber = `${guest?.nrcCode}/${guest?.nrcTownship}(${guest?.nrcType})/${guest?.nrcNumber || ""}`;
        formData.append(`guests[${index}][nrc_number]`, nrcNumber);
      } else {
        formData.append(
          `guests[${index}][identity_number]`,
          guest?.passport || "",
        );
      }

      const fileList = guest?.identityPhoto;
      const fileObj = fileList?.[0]?.originFileObj;

      if (fileObj) {
        formData.append(`guests[${index}][photo]`, fileObj, fileObj.name);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const actionToDispatch =
      data?.display_status === "reserved"
        ? updateCheckInInfo({
            business_id: businessId,
            booking_id: data?.current_booking?.id,
            data: formData,
          })
        : walkInBooking({
            business_id: businessId,
            data: formData,
          });

    dispatch(actionToDispatch)
      .then((res) => {
        const { payload } = res;
        if (_.endsWith(res.type, "fulfilled")) {
          dispatch(
            finalVerifiedCheckIn({
              business_id: businessId,
              booking_id: payload?.data?.booking?.id,
            }),
          ).then((finalRes) => {
            if (_.endsWith(finalRes.type, "fulfilled")) {
              message.success("Success Check In");
              navigate(-1);
            }
          });
        }
      })
      .catch(() => {
        message.error("Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="px-3">
      <div className="py-4 space-y-1 px-1">
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
          {_.map(data?.core_snapshot?.beds, (bed, index) => (
            <span key={index}>.&nbsp;{bed?.bed_type?.name}&nbsp;</span>
          ))}
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
          check_in: dayjs(),
          check_out: dayjs().add(1, "day"),
          adults: 2,
          children: 0,
          guest_market: "local",
        }}
        className="space-y-3"
      >
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Check-in" name="check_in" className="mb-0">
              <DatePicker
                format="YYYY-MM-DD"
                className="w-full h-10 rounded-xl bg-neutral-50 border-neutral-200"
                suffixIcon={<CalendarOutlined className="text-blue-500" />}
              />
            </Form.Item>

            <Form.Item label="Check-out" name="check_out" className="mb-0">
              <DatePicker
                format="YYYY-MM-DD"
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
                onChange={(e) => handleGuestTypeChange(0, e.target.value)}
                className="flex space-x-6"
              >
                <Radio
                  value="local"
                  className="text-xs font-semibold text-indigo-600"
                >
                  Local
                </Radio>
                <Radio
                  value="foreigner"
                  className="text-xs font-semibold text-neutral-600"
                >
                  Foreigner
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>

        {/* Guest Information Section */}
        {guests.map((guest, index) => {
          const isMainGuest = index === 0;

          return (
            <div
              key={guest.id}
              className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-teal-500 tracking-wider">
                  Guest Information {guests.length > 1 ? `#${index + 1}` : ""}
                </div>
                {!isMainGuest && (
                  <button
                    type="button"
                    onClick={() => handleRemoveGuest(index)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <DeleteOutlined className="text-xs" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {!isMainGuest && (
                <div className="pt-1">
                  <Form.Item
                    name={["guests", index, "guestType"]}
                    className="mb-0"
                  >
                    <Radio.Group
                      onChange={(e) =>
                        handleGuestTypeChange(index, e.target.value)
                      }
                      className="flex space-x-6"
                    >
                      <Radio
                        value="local"
                        className="text-xs font-semibold text-indigo-600"
                      >
                        Local
                      </Radio>
                      <Radio
                        value="foreigner"
                        className="text-xs font-semibold text-neutral-600"
                      >
                        Foreigner
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}

              <Form.Item
                label={
                  <span className="text-xs font-semibold text-neutral-600">
                    Name <span className="text-red-500">*</span>
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

              {isMainGuest && (
                <>
                  <Form.Item
                    label={
                      <span className="text-xs font-semibold text-neutral-600">
                        Phone Number <span className="text-red-500">*</span>
                      </span>
                    }
                    name={["guests", index, "phone"]}
                    rules={[
                      { required: true, message: "Please enter phone number" },
                    ]}
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
                </>
              )}

              {guest.guestType === "local" ? (
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
                        onChange={(val) => handleNrcCodeChange(index, val)}
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
                        {(nrcTownships[guest.selectedCode] || []).map(
                          (item) => (
                            <Option key={item.value} value={item.value}>
                              {item.label}
                            </Option>
                          ),
                        )}
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

              {/* Upload Field - Corrected Fix */}
              <Form.Item
                name={["guests", index, "identityPhoto"]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="mb-0"
              >
                <Upload
                  maxCount={1}
                  beforeUpload={() => false} // Auto upload မလုပ်ဘဲ Manual ခဏတားထားရန်
                  listType="picture"
                >
                  <Button className="w-full h-10 rounded-xl bg-white text-teal-600 border-teal-500 border-dashed text-xs font-semibold flex items-center justify-center space-x-1">
                    <PlusOutlined /> Upload Identity Photo
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          );
        })}

        {/* Add Guest Button */}
        <button
          type="button"
          onClick={handleAddGuest}
          className="flex items-center space-x-1 text-teal-600 text-xs font-bold hover:text-teal-700 transition-colors py-1 cursor-pointer"
        >
          <PlusOutlined className="text-xs" />
          <span>Add Another Guest Information</span>
        </button>

        {/* Special Request */}
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

        {/* Payment Section */}
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
              <Option value="aya">AYA</Option>
              <Option value="mmqr">MMQR</Option>
              <Option value="kbz">KBZ</Option>
              <Option value="cash">Cash</Option>
              <Option value="other">Other</Option>
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
              <Option value="paid">Paid</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => navigate(-1)}
            className="h-11 rounded-xl bg-neutral-200/80 hover:bg-neutral-300 border-none text-neutral-700 font-bold text-xs"
          >
            Cancel
          </Button>

          <Button
            loading={loading}
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
