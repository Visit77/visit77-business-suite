import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Collapse } from "antd";
import React, { useEffect, useState } from "react";

const hasValue = (val) => val !== null && val !== undefined && val !== "";

const formatCurrency = (prefix, value) => {
  if (!hasValue(value)) return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return `${prefix} ${value}`;
  return `${prefix} ${num.toLocaleString("en-US")}`;
};

export const RoomPriceCard = ({
  data,
  onOpenCreate,
  onOpenEdit,
  onOpenSeasonal,
}) => {
  const hasPriceData = Boolean(
    hasValue(data?.local_base_price) ||
    hasValue(data?.local_usd_price) ||
    hasValue(data?.foreign_base_price) ||
    hasValue(data?.foreign_usd_price),
  );

  const [isOpen, setIsOpen] = useState(hasPriceData);

  useEffect(() => {
    setIsOpen(hasPriceData);
  }, [hasPriceData]);

  const secondaryButtonClass = hasPriceData
    ? "bg-secondary-800 text-white border hover:bg-secondary-600 cursor-pointer"
    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed";

  const buttonClass = hasPriceData
    ? "bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 cursor-pointer"
    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed";

  const handleAddRegularRate = () => {
    onOpenCreate?.(data);
  };

  const handleEditRegularRate = (e) => {
    e?.stopPropagation();
    onOpenEdit?.(data);
  };

  const handleAddSeasonalRate = () => {
    if (!hasPriceData) return;
    onOpenSeasonal?.(data);
  };

  return (
    <div className="bg-white p-4 shadow-md m-2 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">{data?.name}</h2>
      </div>

      {hasPriceData ? (
        <Collapse
          activeKey={isOpen ? ["regular-price"] : []}
          onChange={(keys) => setIsOpen(Array.isArray(keys) && keys.length > 0)}
          expandIconPlacement="end"
          className="mb-3! rounded-xl font-medium! overflow-hidden border border-slate-100 bg-white [&_.ant-collapse-header]:bg-blue-50/70! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3! [&_.ant-collapse-content-box]:p-0!"
          items={[
            {
              key: "regular-price",
              label: (
                <div className="flex items-center justify-between pr-2">
                  <span className="font-semibold text-slate-800 text-sm">
                    Regular Room Price
                  </span>
                  <button
                    type="button"
                    onClick={handleEditRegularRate}
                    className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ),
              children: (
                <div className="divide-y divide-slate-100 text-sm">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Local (MMK)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency("MMK", data?.local_base_price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Local (USD)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency("USD", data?.local_usd_price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Foreigner (MMK)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency("MMK", data?.foreign_base_price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Foreigner (USD)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency("USD", data?.foreign_usd_price)}
                    </span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      ) : (
        <button
          type="button"
          onClick={handleAddRegularRate}
          className="w-full bg-primary-800 hover:bg-primary-700 text-white font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 mb-3 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={2} />
          <span>Add Regular Room Rate</span>
        </button>
      )}

      {/* Add Seasonal Room Rate */}
      <button
        type="button"
        disabled={!hasPriceData}
        onClick={handleAddSeasonalRate}
        className={`w-full font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 mb-3 transition-colors ${secondaryButtonClass}`}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={2} />
        <span>Add Seasonal Room Rate</span>
      </button>

      {/* Bottom Row Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!hasPriceData}
          className={`w-full font-semibold py-3.5 px-3 rounded-xl flex justify-center items-center gap-1.5 transition-colors ${buttonClass}`}
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={20}
            strokeWidth={2}
            className="shrink-0"
          />
          <span className="truncate">Add Discount Room Rate</span>
        </button>

        <button
          type="button"
          disabled={!hasPriceData}
          className={`w-full font-semibold py-3.5 px-3 rounded-xl flex justify-center items-center gap-1.5 transition-colors ${buttonClass}`}
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={20}
            strokeWidth={2}
            className="shrink-0"
          />
          <span className="truncate">Add Extra Bed Rate</span>
        </button>
      </div>
    </div>
  );
};
