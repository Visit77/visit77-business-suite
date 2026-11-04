import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Pagination, Tabs } from "antd";
import { getOtaRevenue, otaRevenueSelector } from "../service/otaRevenueSlice";
import { selectBusinessId } from "../service/businessSlice";
import { RevenueTabContent } from "../components/otaRevenueTable/RevenueTabContent";
import OTARemittance from "../components/otaRevenueTable/OTARemittance";

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

  const revenueRecords = data?.records || data?.results || [];
  const totalRecords = data?.count || 0;
  const totals = data?.totals || {};
  const currency = data?.currency || "MMK";

  const handleStatusTabChange = (val) => {
    setStatusFilter(val);
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

  // Tab options for status filter
  const tabItems = [
    {
      key: "all",
      label: "All",
      children: (
        <RevenueTabContent
          isPending={isPending}
          hasError={hasError}
          currency={currency}
          groupedData={groupedData}
          data={data}
          formatTime={formatTime}
          formatDateDisplay={formatDateDisplay}
          statusFilter={statusFilter}
          totals={totals}
        />
      ),
    },
    {
      key: "available",
      label: "Available",
      children: (
        <RevenueTabContent
          isPending={isPending}
          hasError={hasError}
          currency={currency}
          groupedData={groupedData}
          data={data}
          formatTime={formatTime}
          formatDateDisplay={formatDateDisplay}
          statusFilter={statusFilter}
          totals={totals}
        />
      ),
    },
    {
      key: "held-funds",
      label: "Held Fund",
      children: (
        <RevenueTabContent
          isPending={isPending}
          hasError={hasError}
          currency={currency}
          groupedData={groupedData}
          data={data}
          formatTime={formatTime}
          formatDateDisplay={formatDateDisplay}
          statusFilter={statusFilter}
          totals={totals}
        />
      ),
    },
    {
      key: "refunds",
      label: "Refunds",
      children: (
        <RevenueTabContent
          isPending={isPending}
          hasError={hasError}
          currency={currency}
          groupedData={groupedData}
          data={data}
          formatTime={formatTime}
          formatDateDisplay={formatDateDisplay}
          statusFilter={statusFilter}
          totals={totals}
        />
      ),
    },
    {
      key: "remittances",
      label: "Remittance",
      children: (
        <OTARemittance
          isPending={isPending}
          hasError={hasError}
          currency={currency}
          groupedData={groupedData}
          data={data}
          formatTime={formatTime}
          formatDateDisplay={formatDateDisplay}
          statusFilter={statusFilter}
          totals={totals}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Date Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
      {/* Ant Design Tabs Navigation */}
      <Tabs
        activeKey={statusFilter}
        onChange={handleStatusTabChange}
        items={tabItems}
        className="mb-6! font-medium!"
      />

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
    </div>
  );
}
