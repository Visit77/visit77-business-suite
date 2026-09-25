import React, { useState } from "react";
import { Select, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { selectBusinessId } from "../../service/businessSlice";
import _ from "lodash";
import {
  bookingPayment,
  finalVerifiedCheckIn,
} from "../../service/actionSlice";
import { InvoiceTable } from "./InvoiceTable";

const InvoiceStep = ({ booking, onBack, onNext }) => {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const [loading, setLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("cash");

  const handleFinalSubmit = () => {
    setLoading(true);

    dispatch(
      bookingPayment({
        business_id: businessId,
        booking_id: booking?.id,
        data: {
          payment_type: "full_payment",
          provider: paymentProvider || "cash",
          status: "paid",
        },
      }),
    )
      .then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          dispatch(
            finalVerifiedCheckIn({
              business_id: businessId,
              booking_id: booking?.id,
            }),
          ).then((response) => {
            if (_.endsWith(response.type, "fulfilled")) {
              onNext();
              message.success("Success");
            } else {
              message.error("Error");
            }
          });
        }
      })
      .catch(() => message.error("Something went wrong!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="px-4 pb-10 space-y-4 font-medium! rounded-2xl border border-neutral-100 shadow-2xs">
      <h2 className="text-base font-bold text-neutral-800 my-2 text-center">
        Invoice
      </h2>

      <div className="bg-white p-5  space-y-3">
        <InvoiceTable booking={booking} />
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
          <Option value="cash">Cash</Option>
          <Option value="aya">AYA</Option>
          <Option value="kbz">KBZ Pay</Option>
          <Option value="mmqr">MMQR</Option>
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
