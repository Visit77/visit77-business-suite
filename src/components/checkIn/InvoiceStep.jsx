import React, { useState } from "react";
import { Select, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  makeReservation,
  finalVerifiedCheckIn,
} from "../../service/actionSlice";
import { selectBusinessId } from "../../service/businessSlice";
import dayjs from "dayjs";
import _ from "lodash";

const InvoiceStep = ({ data, formData, summaryData, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const businessId = useSelector(selectBusinessId);
  const [loading, setLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState(
    formData?.paymentMethod || "cash",
  );

  const handleFinalSubmit = () => {
    setLoading(true);
    const payloadData = new FormData();

    payloadData.append(
      "check_in",
      formData?.check_in ? dayjs(formData.check_in).format("YYYY-MM-DD") : "",
    );
    payloadData.append(
      "check_out",
      formData?.check_out ? dayjs(formData.check_out).format("YYYY-MM-DD") : "",
    );

    formData?.selectedRooms?.forEach((room, index) => {
      payloadData.append(`rooms[${index}][physical_room_id]`, room.id);
      payloadData.append(`rooms[${index}][adults]`, formData?.adults ?? 2);
      payloadData.append(`rooms[${index}][children]`, formData?.children ?? 0);
    });

    payloadData.append("guest_market", formData?.guest_market || "local");
    payloadData.append("payment[provider]", paymentProvider);
    payloadData.append("payment[status]", "paid");

    dispatch(makeReservation({ business_id: businessId, data: payloadData }))
      .then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          dispatch(
            finalVerifiedCheckIn({
              business_id: businessId,
              booking_id: res.payload?.data?.booking?.id,
            }),
          ).then((finalRes) => {
            if (_.endsWith(finalRes.type, "fulfilled")) {
              message.success("Success Check In");
              navigate(-1);
            }
          });
        }
      })
      .catch(() => message.error("Something went wrong!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="px-4 pb-10 space-y-4">
      <h2 className="text-base font-bold text-neutral-800 my-2">Invoice</h2>

      <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
        <div className="text-center pb-2 border-b border-neutral-100">
          <h3 className="text-sm font-extrabold text-neutral-900">
            Hotel Pro Test
          </h3>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Invoice ID</span>:
            V77-INV-A0000320
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Guest Name</span>:{" "}
            {formData?.guests?.[0]?.name || "Seems"}
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Contact Number</span>:{" "}
            {formData?.guests?.[0]?.phone || "09444370622"}
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Check-in</span>:{" "}
            {formData?.check_in?.format("YYYY-MM-DD")}
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Check-out</span>:{" "}
            {formData?.check_out?.format("YYYY-MM-DD")}
          </div>
        </div>

        <div className="pt-3 border-t border-dashed border-neutral-200">
          <h4 className="text-xs font-bold text-neutral-800 mb-2">
            Room Charges
          </h4>
          <div className="flex justify-between text-xs">
            <span>yyy x 1 x 1 Night</span>
            <span>MMK {summaryData?.roomTotal?.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-dashed border-neutral-200">
          <h4 className="text-xs font-bold text-neutral-800 mb-2">
            Additional Charges
          </h4>
          <div className="flex justify-between text-xs">
            <span>default x 1 x 1 Night</span>
            <span>MMK {summaryData?.mealPlanTotal?.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200 flex justify-between text-xs font-extrabold text-indigo-600">
          <span>Grand Total</span>
          <span>MMK {summaryData?.grandTotal?.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Selection */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <label className="text-xs font-bold text-teal-600 tracking-wider">
          PAYMENT
        </label>
        <Select
          value={paymentProvider}
          onChange={(val) => setPaymentProvider(val)}
          className="w-full h-10 [&_.ant-select-selector]:rounded-xl! text-xs"
        >
          <Select.Option value="cash">Cash</Select.Option>
          <Select.Option value="aya">AYA</Select.Option>
          <Select.Option value="kbz">KBZ Pay</Select.Option>
          <Select.Option value="mmqr">MMQR</Select.Option>
        </Select>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          onClick={onBack}
          className="h-11 rounded-xl bg-neutral-200 font-bold text-xs"
        >
          Back
        </Button>
        <Button
          loading={loading}
          type="primary"
          onClick={handleFinalSubmit}
          className="h-11 rounded-xl bg-indigo-600 font-bold text-xs"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InvoiceStep;
