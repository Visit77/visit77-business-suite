import React, { useState } from "react";
import { Button, Card, Input, message } from "antd";
import { CheckCheckIcon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { handleDownload } from "../../utils/utils";
import { getRemittanceFile } from "../../service/otaRevenueSlice";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function OTARemittance({ data }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data?.results?.filter((item) =>
    item.reference.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);

  return (
    <div className="px-4 space-y-4">
      <div className=" mb-4">
        <Input
          placeholder="Remittance ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border-gray-300 h-10 text-sm"
        />
      </div>
      {filteredData?.map((item) => (
        <Card
          key={item?.id}
          className="shadow-sm! rounded-xl! border! border-gray-100! bg-white! mb-3!"
        >
          {/* Remittance Info Header */}
          <div className="space-y-2 text-sm text-neutral-600 mb-4">
            <div className="flex justify-between items-center">
              <span>Remittance ID</span>
              <span className="font-semibold text-neutral-800">
                {item.reference}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Statement Date</span>
              <span className="font-medium text-neutral-800">
                {formatDate(item.period_to)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payout Period Covered</span>
              <span className="font-medium text-neutral-800">
                {item.period_from} – {item.period_to}
              </span>
            </div>
          </div>

          {/* Calculations Breakdown */}
          <div className="space-y-2 text-sm text-neutral-600 mb-4 border-t pt-3 border-dashed border-gray-200">
            <div className="flex justify-between items-center">
              <span>Total Gross Booking Collection</span>
              <span className="font-medium text-neutral-800">
                {item.currency} {item.booking_collection}
              </span>
            </div>
            {item?.released_held_funds > 0 && (
              <div className="flex justify-between items-center">
                <span>Release of Held Refunds</span>
                <span className="font-medium text-neutral-800">
                  {item.currency} {item.released_held_funds}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Tax (Excluded form Comission)</span>
              <span className="font-medium text-neutral-800">
                {item.currency} {item.tax_excluded_from_commission}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Visit 77 Commission</span>
              <span className="font-medium text-neutral-800">
                {item.currency} {item.commission}
              </span>
            </div>

            {/* Net Payout Highlighted */}
            <div className="flex justify-between items-center bg-blue-50/70 p-2.5 rounded-lg text-blue-950 font-medium my-2">
              <span>Net Payout</span>
              <span className="font-semibold">
                {item.currency} {item.net_payout}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            {item.can_view_remittance_pdf && (
              <Button
                onClick={() =>
                  dispatch(
                    getRemittanceFile({
                      business_id: businessId,
                      url: item?.hotel_statement_pdf_url,
                    }),
                  ).then((response) => {
                    if (_.endsWith(response.type, "fulfilled")) {
                      const pdfData = response.payload.data;
                      message.success("Success");
                      const blob = new Blob([pdfData], {
                        type: "application/pdf",
                      });
                      const blobUrl = URL.createObjectURL(blob);

                      window.open(blobUrl, "_blank");

                      //direct download

                      // const blob = new Blob([pdfData], {
                      //   type: "application/pdf",
                      // });
                      // const blobUrl = URL.createObjectURL(blob);

                      // const link = document.createElement("a");
                      // link.href = blobUrl;
                      // link.download = "remittance-statement.pdf";
                      // document.body.appendChild(link);
                      // link.click();
                      // document.body.removeChild(link);

                      // Memory ရှင်းထုတ်ရန်
                      // URL.revokeObjectURL(blobUrl);
                    } else {
                      message.error("Error");
                    }
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 border-blue-900 text-blue-900 font-medium h-9 text-xs rounded-md"
              >
                <HugeiconsIcon icon={Download01Icon} />
                Remittance
              </Button>
            )}

            <Button
              onClick={() =>
                handleDownload({
                  url: item.payment_receipt_url,
                })
              }
              className="flex-1 flex items-center justify-center gap-1.5 border-blue-900 text-blue-900 font-medium h-9 text-xs rounded-md"
            >
              <HugeiconsIcon icon={Download01Icon} />
              Bank Receipt
            </Button>

            <a
              href={`/remittance-details/${item?.id}`}
              className="text-blue-900 font-semibold text-xs underline pl-1 hover:text-blue-700"
            >
              View Details
            </a>
          </div>

          {/* Status Section */}
          {item.status === "received" ? (
            <div className="space-y-2">
              <div className="w-full bg-emerald-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                <HugeiconsIcon icon={CheckCheckIcon} />

                <span>Received</span>
              </div>
              {item.received_by && (
                <p className="text-xs text-neutral-500 m-0 text-left">
                  Confirmed by{" "}
                  <span className="font-bold text-neutral-800">
                    {item.received_by.name}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <Button
              type="primary"
              block
              className="bg-blue-600 h-10 rounded-lg font-medium"
            >
              Confirm Receipt
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
