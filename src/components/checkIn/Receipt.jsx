import React, { useState } from "react";
import { Button, message } from "antd";
import _ from "lodash";
import { InvoiceTable } from "./InvoiceTable";
import { useNavigate } from "react-router-dom";
import { BOOKING_URL } from "../../variables/constants";

const Receipt = ({ booking }) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const pdfUrl = booking?.payments?.[0]?.receipt_pdf_url;

    if (pdfUrl) {
      window.open(`${BOOKING_URL}/${pdfUrl}`, "_blank");
    } else {
      message.warning("Receipt PDF မရှိပါ။");
    }
  };
  return (
    <div className="px-4 pb-10 space-y-4 font-medium! rounded-2xl border border-neutral-100 shadow-2xs">
      <h2 className="text-base font-bold text-neutral-800 my-2 text-center">
        Receipt
      </h2>

      <div className="bg-white p-5  space-y-3">
        <InvoiceTable booking={booking} />
      </div>
      {/* Payment Selection */}

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          className="h-11 rounded-xl bg-neutral-200 font-bold text-xs"
          onClick={handleDownload}
        >
          Download
        </Button>
        <Button
          type="primary"
          className="h-11 rounded-xl bg-indigo-600 font-bold text-xs"
          onClick={() => {
            navigate("/rooms-board");
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default Receipt;
