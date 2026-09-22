import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  Upload,
  message,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDotColor, nrcCodes, nrcTownships, nrcTypes } from "../utils/utils";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeReservation } from "../service/actionSlice";
import { selectBusinessId } from "../service/businessSlice";
import PageLoading from "../components/PageLoading";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import { getAvailableRoom, roomSelector } from "../service/roomSlice.jsx";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import moment from "moment";
import AvailableRoomsModal from "../components/modal/AvailableRoomsModal.jsx";

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

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

const Reserved = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const businessId = useSelector(selectBusinessId);

  const { details: data, isPending } = useSelector(roomBoardSelector);
  const { data: availableRoomsList } = useSelector(roomSelector);

  const [loading, setLoading] = useState(false);

  // Room Modal States
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [tempSelectedRoomIds, setTempSelectedRoomIds] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [guests, setGuests] = useState([
    { id: 1, guestType: "local", selectedCode: "12", is_primary: true },
  ]);

  // Form Value Watcher for API Triggering
  const formValues = Form.useWatch([], form);

  // Date Validation Logics
  // ၁။ Check-in date ကို Today (ယနေ့) မှ စတင်ရွေးချယ်နိုင်မည် (ယနေ့မတိုင်မီ အတိတ်ရက်များ disable ပေးထားမည်)
  const disabledCheckInDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // ၂။ Check-out date ကို Check-in date ထက် ပိုကြီးသော ရက်များကိုသာ ရွေးချယ်နိုင်မည်
  const disabledCheckOutDate = (current) => {
    const checkInDate = form.getFieldValue("check_in");
    if (!checkInDate) {
      return current && current < dayjs().startOf("day");
    }
    return current && current <= dayjs(checkInDate).startOf("day");
  };

  // Check-in date ပြောင်းလဲပါက Check-out date ကို စစ်ဆေးပြီး လိုအပ်ပါက ၁ ရက် တိုးပေးခြင်း
  const handleCheckInChange = (date) => {
    const checkOutDate = form.getFieldValue("check_out");
    if (
      date &&
      checkOutDate &&
      (dayjs(date).isAfter(checkOutDate) ||
        dayjs(date).isSame(checkOutDate, "day"))
    ) {
      form.setFieldsValue({
        check_out: dayjs(date).add(1, "day"),
      });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Get Room Details on Load
  useEffect(() => {
    if (id) {
      dispatch(
        getOneRoom({
          business_id: businessId,
          date: moment().format("YYYY-MM-DD"),
          id: id,
        }),
      );
    }
  }, [id, businessId, dispatch]);

  // Set Initial Primary Room Data
  useEffect(() => {
    if (data) {
      setSelectedRooms([
        {
          id: data.id,
          room_number: data.room_number,
          floor: data.floor,
          building: data.building,
          room_type: data.room_type,
          room_standard: data.room_standard,
          core_snapshot: data.core_snapshot,
          breakfast_price:
            data?.current_booking?.guest_market == "local"
              ? data.room_type?.breakfast?.price?.local_base_price
              : data?.room_type?.breakfast_price?.foreign_base_price,
          has_breakfast: false,
          extra_bed: 0,
          is_primary: true,
          ...data,
        },
      ]);
    }
  }, [data]);

  // Set Initial Form & Guest Values
  useEffect(() => {
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
  }, [data, form]);

  // Fetch Available Rooms Callback
  const fetchAvailableRooms = useCallback(() => {
    if (!businessId || !formValues?.check_in || !formValues?.check_out) return;

    const currentRatePlan = data?.room_type?.rate_plans?.find(
      (plan) => plan?.id,
    );

    dispatch(
      getAvailableRoom({
        business_id: businessId,
        check_in: dayjs(formValues.check_in).format("YYYY-MM-DD"),
        check_out: dayjs(formValues.check_out).format("YYYY-MM-DD"),
        adults: formValues.adults ?? 2,
        children: formValues.children ?? 0,
        guest_market: formValues.guest_market || "local",
        workflow: "check_in",
        current_room_id: data?.id,
        current_rate_plan_id: currentRatePlan?.id,
        selected_room_id: [data?.id],
      }),
    );
  }, [
    businessId,
    formValues?.check_in,
    formValues?.check_out,
    formValues?.adults,
    formValues?.children,
    formValues?.guest_market,
    data,
    dispatch,
  ]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [fetchAvailableRooms]);

  // Room Selection Handlers
  const handleOpenRoomModal = () => {
    setTempSelectedRoomIds([]);
    setIsRoomModalOpen(true);
  };

  const handleConfirmAddRoom = () => {
    if (!tempSelectedRoomIds || tempSelectedRoomIds.length === 0) {
      message.warning("Please select at least one room!");
      return;
    }

    const newRoomsToAdd = [];

    availableRoomsList?.groups?.forEach((group) => {
      const parentRoomType = group?.room_type;
      const rate_plan_id = group?.rate_plan?.id;

      group?.rooms?.forEach((room) => {
        if (tempSelectedRoomIds.includes(room.id)) {
          const isAlreadyAdded = selectedRooms.some((r) => r.id === room.id);
          if (!isAlreadyAdded) {
            newRoomsToAdd.push({
              ...room,
              room_type: parentRoomType,
              rate_plan_id: rate_plan_id,
              has_breakfast: false,
              extra_bed: room?.extra_bed,
              breakfast_price:
                formValues.guest_market === "local"
                  ? parentRoomType?.breakfast?.meal_plan?.local_base_price
                  : parentRoomType?.breakfast?.meal_plan?.foreign_base_price,
              is_primary: false,
            });
          }
        }
      });
    });

    if (newRoomsToAdd.length > 0) {
      setSelectedRooms((prev) => [...prev, ...newRoomsToAdd]);
    } else {
      message.warning("Selected room(s) are already added!");
    }

    setIsRoomModalOpen(false);
  };

  const handleRemoveRoom = (roomId) => {
    setSelectedRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const handleRoomBreakfastChange = (roomId, checked) => {
    setSelectedRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, has_breakfast: checked } : r)),
    );
  };

  const handleRoomExtraBedChange = (roomId, value) => {
    setSelectedRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, extra_bed: value } : r)),
    );
  };

  // Guest Handlers
  const handleAddGuest = () => {
    setGuests((prev) => [
      ...prev,
      {
        id: Date.now(),
        guestType: form.getFieldValue("guest_market") || "local",
        selectedCode: "12",
      },
    ]);
  };

  const handleRemoveGuest = (index) => {
    setGuests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuestTypeChange = (index, value) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], guestType: value };
      return updated;
    });
  };

  const handleNrcCodeChange = (index, value) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], selectedCode: value };
      return updated;
    });
  };

  const handleSubmit = (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "check_in",
      values?.check_in ? dayjs(values.check_in).format("YYYY-MM-DD") : "",
    );
    formData.append(
      "check_out",
      values?.check_out ? dayjs(values.check_out).format("YYYY-MM-DD") : "",
    );

    selectedRooms.forEach((room, index) => {
      const ratePlanId = room?.room_type?.rate_plans?.find(
        (plan) => plan?.guest_market === values?.guest_market,
      )?.id;
      formData.append(`rooms[${index}][physical_room_id]`, room.id);
      formData.append(
        `rooms[${index}][rate_plan_id]`,
        room?.rate_plan_id || ratePlanId,
      );
      formData.append(`rooms[${index}][adults]`, values?.adults ?? 2);
      formData.append(`rooms[${index}][children]`, values?.children ?? 0);
      formData.append(`rooms[${index}][extra_beds]`, room?.extra_bed || 0);
      formData.append(
        `rooms[${index}][breakfast_selected]`,
        room?.has_breakfast,
      );
    });

    formData.append("guest_market", values?.guest_market || "local");
    formData.append("special_request", values?.specialRequest || "");
    formData.append("contact_name", values?.guests?.[0]?.name || "");
    formData.append("contact_phone", values?.guests?.[0]?.phone || "");

    formData.append("payment[provider]", values?.paymentMethod || "cash");
    formData.append("payment[status]", values?.paymentStatus || "paid");
    formData.append("payment[payment_type]", "full_payment");

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

      const fileObj = guest?.identityPhoto?.[0]?.originFileObj;
      if (fileObj) {
        formData.append(`guests[${index}][photo]`, fileObj, fileObj.name);
      }
    });

    const actionToDispatch = makeReservation({
      business_id: businessId,
      data: formData,
    });

    dispatch(actionToDispatch)
      .then((res) => {
        const { payload } = res;
        if (_.endsWith(res.type, "fulfilled")) {
          message.success("Success Reserved");
          navigate(-1);
        }
      })
      .catch(() => {
        message.error("Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isPending) {
    return <PageLoading message="Loading room data..." />;
  }

  return (
    <div className="px-3 pb-10">
      {/* Header Room Title */}
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
          {data?.core_snapshot?.room_type?.name || data?.room_type?.name} &nbsp;
          .&nbsp;
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
        {/* Date & Guest Count Box */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="Check-in" name="check_in" className="mb-0">
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledCheckInDate}
                onChange={handleCheckInChange}
                className="w-full h-10 rounded-xl bg-neutral-50 border-neutral-200"
                suffixIcon={<CalendarOutlined className="text-blue-500" />}
              />
            </Form.Item>

            <Form.Item
              label="Check-out"
              name="check_out"
              className="mb-0"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const checkIn = getFieldValue("check_in");
                    if (
                      !value ||
                      !checkIn ||
                      dayjs(value).isAfter(dayjs(checkIn), "day")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Check-out date must be after Check-in date!"),
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledCheckOutDate}
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

        {/* Total Rooms Display & Added Room Cards */}
        {selectedRooms.length > 1 && (
          <div className="font-extrabold text-neutral-800 text-sm px-1">
            Total Room ({selectedRooms.length})
          </div>
        )}

        {selectedRooms.map((rm) => {
          return (
            <div
              key={rm.id}
              className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3 relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-neutral-900 flex items-center gap-1.5">
                    {!rm.is_primary && (
                      <CloseOutlined
                        onClick={() => handleRemoveRoom(rm.id)}
                        className="text-red-500 cursor-pointer mr-1"
                      />
                    )}
                    #{rm.room_number} . {rm.floor} Floor, {rm.building}
                  </h2>
                  <p className="text-[11px] font-medium text-neutral-500 mt-1">
                    {rm.core_snapshot?.room_type?.name || rm.room_type?.name} .{" "}
                    {rm.room_standard?.name} .{" "}
                    {_.map(
                      rm.core_snapshot?.beds,
                      (b) => b?.bed_type?.name,
                    ).join(" / ")}{" "}
                    .{" "}
                    {_.map(rm.core_snapshot?.room_views, (v) => v?.name).join(
                      " . ",
                    )}
                  </p>
                </div>
              </div>
              {rm?.room_type?.breakfast?.included === true ? (
                <div className="flex items-center justify-between pt-1">
                  <div className="font-medium text-primary-500 flex items-center">
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className="text-green-700 mr-1"
                    />
                    Breakfast Included
                  </div>

                  <span className="text-xs font-medium text-neutral-400">
                    Included
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <Checkbox
                    checked={rm.has_breakfast}
                    onChange={(e) =>
                      handleRoomBreakfastChange(rm.id, e.target.checked)
                    }
                    className="text-xs font-bold text-neutral-700"
                  >
                    Breakfast Price
                  </Checkbox>
                  <span className="text-xs font-bold text-neutral-800">
                    MMK {rm.breakfast_price || 0}
                  </span>
                </div>
              )}

              {/* Extra Bed Select */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-neutral-600">
                  Extra Bed
                </span>
                <Select
                  onChange={(val) => handleRoomExtraBedChange(rm.id, val)}
                  className="w-24 h-9 [&_.ant-select-selector]:rounded-xl!"
                >
                  {Array.from(
                    { length: rm?.extra_bed_quantity || 1 },
                    (_, i) => {
                      const count = i + 1;
                      return (
                        <Option key={count} value={count}>
                          {count}
                        </Option>
                      );
                    },
                  )}
                </Select>
              </div>
            </div>
          );
        })}

        {/* Add More Room Button */}
        <Button
          type="primary"
          onClick={handleOpenRoomModal}
          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
        >
          + Add More Room
        </Button>

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

      {/* Available Rooms Modal */}
      <AvailableRoomsModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        availableRoomsList={availableRoomsList || []}
        selectedRoomIds={tempSelectedRoomIds}
        setSelectedRoomIds={setTempSelectedRoomIds}
        onConfirm={handleConfirmAddRoom}
      />
    </div>
  );
};

export default Reserved;
