import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Card,
  Select,
  DatePicker,
  Table,
  Tag,
  Pagination,
  Spin,
  Alert,
} from "antd";
import { getOtaRevenue, otaRevenueSelector } from "../service/otaRevenueSlice";
import { selectBusinessId } from "../service/businessSlice";

export default function OtaRevenueTable() {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);

  const { isPending, hasError, data } = useSelector(otaRevenueSelector);

  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getOtaRevenue({
          business_id: businessId,
          status: statusFilter,
          date_from: fromDate,
          date_to: toDate,
          limit: pageSize,
          offset: page,
        }),
      );
    }
  }, [dispatch, businessId, statusFilter, fromDate, toDate, page, pageSize]);

  const revenueRecords = data?.records || [];
  const totalRecords = data?.count || 0;
  const totals = data?.totals || {};
  const currency = data?.currency || "MMK";

  const handleStatusChange = (val) => {
    setStatusFilter(val || "all");
    setPage(1);
  };

  const handleFromDateChange = (date, dateString) => {
    setFromDate(dateString || "");
    setPage(1);
  };

  const handleToDateChange = (date, dateString) => {
    setToDate(dateString || "");
    setPage(1);
  };

  const formatTime = (isoString) => {
    if (!isoString) return "-";
    const dateObj = new Date(isoString);
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  const groupedData = useMemo(() => {
    return revenueRecords.reduce((acc, curr) => {
      const rawDate =
        curr.check_in || (curr.paid_at ? curr.paid_at.split("T")[0] : "Other");
      const dateKey = formatDateDisplay(rawDate);

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(curr);
      return acc;
    }, {});
  }, [revenueRecords]);

  return (
    <div className="w-full p-4">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-800">OTA Revenue</span>
            {isPending && <Spin size="small" />}
          </div>
        }
        className="shadow-md rounded-lg bg-white"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Status Filter
            </label>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full"
            >
              <Option value="all">All</Option>
              <Option value="available">Available</Option>
              <Option value="held">Held</Option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              From Date
            </label>
            <DatePicker
              className="w-full"
              onChange={handleFromDateChange}
              format="YYYY-MM-DD"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              To Date
            </label>
            <DatePicker
              className="w-full"
              onChange={handleToDateChange}
              format="YYYY-MM-DD"
            />
          </div>
        </div>

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
                  {data?.hotel_cancellation_policy?.type !==
                    "non_refundable" && (
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
                      {/* Date Group Header */}
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

                      {/* Items Row */}
                      {items.map((row, index) => (
                        <tr
                          key={row.booking_id || index}
                          className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="py-2 px-3">
                            {formatTime(row.paid_at)}
                          </td>
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
                                  : row.status === "held" ||
                                      row.status === "Held"
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
                        data?.hotel_cancellation_policy?.type !==
                        "non_refundable"
                          ? 7
                          : 5
                      }
                      className="text-center py-8 text-gray-500"
                    >
                      No data found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Ant Design Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalRecords}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
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
                {currency}{" "}
                {Number(totals.available_amount || 0).toLocaleString()}
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
      </Card>
    </div>
  );
}
