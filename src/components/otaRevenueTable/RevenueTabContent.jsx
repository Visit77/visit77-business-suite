import React from "react";
import { Tag, Spin, Alert } from "antd";

export function RevenueTabContent({
  isPending,
  hasError,
  currency,
  groupedData,
  data,
  formatTime,
  formatDateDisplay,
  statusFilter,
  totals,
}) {
  return (
    <div>
      <div className="overflow-x-auto border rounded-md min-h-62.5">
        {isPending ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : hasError ? (
          <div className="p-4">
            <Alert
              message="Error"
              description="Failed to load data. Please try again."
              type="error"
              showIcon
            />
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">
                  Check in <br />
                  <span className="font-normal text-xs text-gray-500">
                    Check out
                  </span>
                </th>
                <th className="py-2.5 px-3 text-right">
                  Amount <br />
                  <span className="font-normal text-xs text-gray-500">
                    {currency}
                  </span>
                </th>
                <th className="py-2.5 px-3 text-center">Status</th>
                {data?.hotel_cancellation_policy?.type !== "non_refundable" && (
                  <>
                    <th className="py-2.5 px-3 text-right">Refund</th>
                    <th className="py-2.5 px-3 text-right">Remaining</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(([date, items]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-gray-200/60 font-semibold text-gray-700">
                      <td
                        colSpan={
                          data?.hotel_cancellation_policy?.type !==
                          "non_refundable"
                            ? 7
                            : 5
                        }
                        className="py-1.5 px-3"
                      >
                        {date}
                      </td>
                    </tr>
                    {items.map((row, index) => (
                      <tr
                        key={row.booking_id || index}
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-2 px-3">{formatTime(row.paid_at)}</td>
                        <td className="py-2 px-3 font-medium text-gray-800">
                          {row.booking_code || "-"}
                        </td>
                        <td className="py-2 px-3">
                          <div>{formatDateDisplay(row.check_in)}</div>
                          <div className="text-xs text-gray-500">
                            {formatDateDisplay(row.check_out)}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          {Number(row.gross_amount || 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Tag
                            color={
                              row.status === "available" ||
                              row.status === "Avail"
                                ? "green"
                                : row.status === "held" || row.status === "Held"
                                  ? "gold"
                                  : "blue"
                            }
                            className="capitalize font-medium"
                          >
                            {row.status}
                          </Tag>
                        </td>
                        {data?.hotel_cancellation_policy?.type !==
                          "non_refundable" && (
                          <>
                            <td className="py-2 px-3 text-right">
                              {Number(row.refunded_amount || 0) > 0
                                ? Number(row.refunded_amount).toLocaleString()
                                : "-"}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {Number(
                                row.remaining_amount || 0,
                              ).toLocaleString()}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      data?.hotel_cancellation_policy?.type !== "non_refundable"
                        ? 7
                        : 5
                    }
                    className="text-center py-8 text-gray-500"
                  >
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50/60 rounded-md border border-blue-100 space-y-2 text-sm font-semibold text-gray-800">
        {(statusFilter === "held" || statusFilter === "all") && (
          <div className="flex justify-between items-center">
            <span>Total Held</span>
            <span className="text-yellow-600">
              {currency} {Number(totals.held_amount || 0).toLocaleString()}
            </span>
          </div>
        )}

        {(statusFilter !== "held" || statusFilter === "all") && (
          <div className="flex justify-between items-center">
            <span>Total Available</span>
            <span className="text-green-600">
              {currency} {Number(totals.available_amount || 0).toLocaleString()}
            </span>
          </div>
        )}

        {Number(totals.refunded_amount || 0) > 0 && (
          <div className="flex justify-between items-center">
            <span>Total Refunded</span>
            <span className="text-red-500">
              {currency} {Number(totals.refunded_amount).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
