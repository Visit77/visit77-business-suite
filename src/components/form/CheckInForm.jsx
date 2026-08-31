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

// NRC parsing helper
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
        booking?.guests?.length > 0
          ? booking.guests
          : booking?.primary_guest
            ? [booking.primary_guest]
            : [{}];

      const defaultMarket = booking.guest_market || "local";

      const formattedGuestState = [];
      const formattedGuestsFormValue = [];

      bookingGuests.forEach((g, index) => {
        const guestType = g?.identity_type
          ? g.identity_type === "nrc"
            ? "local"
            : "foreigner"
          : defaultMarket;

        const nrcParsed = g?.nrc_number ? parseNrcString(g.nrc_number) : {};

        formattedGuestState.push({
          id: g?.id || Date.now() + index,
          guestType,
          selectedCode: nrcParsed.nrcCode || "",
          is_primary: index === 0,
        });

        formattedGuestsFormValue.push({
          name: g?.name || "",
          phone: g?.phone || booking?.contact?.phone || "",
          email: g?.email || booking?.contact?.email || "",
          guestType: guestType,
          nrcCode: nrcParsed.nrcCode || "",
          nrcTownship: nrcParsed.nrcTownship || "",
          nrcType: nrcParsed.nrcType || "",
          nrcNumber: nrcParsed.nrcNumber || "",
          passport: g?.passport_number || g?.identity_number || "",
          identityPhoto: g?.documents
            ? [
                {
                  uid: `-guest-${index}`,
                  name: "identity.png",
                  status: "done",
                  url: g.documents?.[0]?.file_url,
                },
              ]
            : [],
        });
      });

      // State Updates
      setGuests(formattedGuestState);

      // Form Initial Values
      form.setFieldsValue({
        check_in: booking?.check_in ? dayjs(booking.check_in) : dayjs(),
        check_out: booking?.check_out
          ? dayjs(booking.check_out)
          : dayjs().add(1, "day"),
        adults: booking?.guest_count?.adults ?? 2,
        children: booking?.guest_count?.children ?? 0,
        guest_market: defaultMarket,
        specialRequest: booking?.special_request || "",
        paymentMethod: booking?.payments?.[0]?.provider || "cash",
        paymentStatus: booking?.payment_status || "paid",
        guests: formattedGuestsFormValue,
      });
    } else {
      setGuests([
        {
          id: Date.now(),
          guestType: "local",
          selectedCode: "12",
          is_primary: true,
        },
      ]);

      form.setFieldsValue({
        check_in: dayjs(),
        check_out: dayjs().add(1, "day"),
        adults: 2,
        children: 0,
        guest_market: "local",
        paymentMethod: "cash",
        paymentStatus: "paid",
        guests: [
          {
            name: "",
            phone: "",
            email: "",
            guestType: "local",
            nrcCode: "12",
            nrcTownship: "MaYaKa",
            nrcType: "Naing",
            nrcNumber: "",
            passport: "",
            identityPhoto: [],
          },
        ],
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
      const isPrimary = index === 0;

      const isLocal = isPrimary
        ? values?.guest_market === "local"
        : guest?.guestType === "local";

      formData.append(`guests[${index}][is_primary]`, isPrimary ? "1" : "0");
      formData.append(`guests[${index}][name]`, guest?.name || "");
      formData.append(`guests[${index}][phone]`, guest?.phone || "");
      formData.append(`guests[${index}][email]`, guest?.email || "");

      if (isLocal) {
        const nrcNumber = `${guest?.nrcCode || ""}/${guest?.nrcTownship || ""}(${guest?.nrcType || ""})/${guest?.nrcNumber || ""}`;
        formData.append(`guests[${index}][identity_type]`, "nrc");
        formData.append(`guests[${index}][nrc_number]`, nrcNumber);
      } else {
        formData.append(`guests[${index}][identity_type]`, "passport");
        formData.append(
          `guests[${index}][identity_number]`,
          guest?.passport || "",
        );
      }

      // Identity Photo
      const fileObj = guest?.identityPhoto?.[0]?.originFileObj;
      if (fileObj) {
        formData.append(`guests[${index}][photo]`, fileObj, fileObj.name);
      }
    });

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
            className={`${getDotColor(
              data?.display_status,
            )} text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider`}
          >
            {data?.display_status}
          </span>
        </div>
        <p className="text-xs font-medium text-neutral-500 mt-1.5">
          {data?.core_snapshot?.room_type?.name} &nbsp; .&nbsp;
          {data?.room_standard?.name} &nbsp;
          {_.map(data?.core_snapshot?.beds, (bed, index) => (
            <span key={index}>.&nbsp;{bed?.bed_type?.name}&nbsp;</span>
          ))}
          {_.map(data?.core_snapshot?.room_views, (view, index) => (
            <span key={index}>.&nbsp;{view?.name}&nbsp;</span>
          ))}
          {data?.core_snapshot?.room_area && (
            <span>.&nbsp; {data?.core_snapshot?.area_unit}</span>
          )}
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
        {data?.room_type?.breakfast && (
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
            <div>
              <h2 className="text-base font-extrabold text-neutral-900">
                #{data?.room_number} .{data?.floor} Floor, {data?.building}
              </h2>
            </div>
            <p className="text-xs font-medium text-neutral-500 mt-1.5">
              {data?.core_snapshot?.room_type?.name} &nbsp; .&nbsp;
              {data?.room_standard?.name} &nbsp;
              {_.map(data?.core_snapshot?.beds, (bed, index) => (
                <span key={index}>.&nbsp;{bed?.bed_type?.name}&nbsp;</span>
              ))}
              {_.map(data?.core_snapshot?.room_views, (view, index) => (
                <span key={index}>.&nbsp;{view?.name}&nbsp;</span>
              ))}
              {data?.core_snapshot?.room_area && (
                <span>.&nbsp; {data?.core_snapshot?.area_unit}</span>
              )}
            </p>
            {data?.extra_bed_available == true && (
              <div className="flex justify-between items-center">
                <div>Extra Bed</div>
                
              </div>
            )}
          </div>
        )}

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
                        Email
                      </span>
                    }
                    name={["guests", index, "email"]}
                    rules={[
                      {
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

              <Form.Item
                name={["guests", index, "identityPhoto"]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="mb-0"
              >
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
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
