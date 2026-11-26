import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Collapse } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const hasValue = (val) => val !== null && val !== undefined && val !== "";

const formatCurrency = (prefix, value) => {
  if (!hasValue(value)) return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return `${prefix} ${value}`;
  return `${prefix} ${num.toLocaleString("en-US")}`;
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return null;
  const start = startDate ? dayjs(startDate).format("DD MMM YYYY") : "-";
  const end = endDate ? dayjs(endDate).format("DD MMM YYYY") : "-";
  return `From ${start} To ${end}`;
};

const calculateDiscountPercent = (regularPrice, discountPrice) => {
  if (!hasValue(regularPrice) || !hasValue(discountPrice)) return null;
  const reg = Number(regularPrice);
  const disc = Number(discountPrice);
  if (Number.isNaN(reg) || Number.isNaN(disc) || reg <= 0 || disc >= reg) {
    return null;
  }
  const percent = Math.floor(((reg - disc) / reg) * 100);
  return percent > 0 ? percent : null;
};

const getDiscountPriceValue = (discountItem, discountKey, fallbackKey) => {
  if (hasValue(discountItem?.[discountKey])) return discountItem[discountKey];
  if (hasValue(discountItem?.[fallbackKey])) return discountItem[fallbackKey];
  return null;
};

export const RoomPriceCard = ({
  data,
  onOpenCreate,
  onOpenEdit,
  onOpenSeasonal,
  onEndSeasonal,
  endingSeasonalId = null,
  onOpenDiscount,
  onEndDiscount,
  endingDiscountId = null,
  onOpenExtraBed,
}) => {
  const hasPriceData = Boolean(
    hasValue(data?.local_base_price) ||
    hasValue(data?.local_usd_price) ||
    hasValue(data?.foreign_base_price) ||
    hasValue(data?.foreign_usd_price),
  );

  const hasExtraBedData = Boolean(
    hasValue(data?.extra_bed_local_base_price) ||
    hasValue(data?.extra_bed_local_usd_price) ||
    hasValue(data?.extra_bed_foreign_base_price) ||
    hasValue(data?.extra_bed_foreign_usd_price),
  );

  const seasonalRates = Array.isArray(data?.seasonal_rates)
    ? data.seasonal_rates
    : [];

  const discounts = Array.isArray(data?.discounts) ? data.discounts : [];

  const [isRegularOpen, setIsRegularOpen] = useState(hasPriceData);
  const [isExtraBedOpen, setIsExtraBedOpen] = useState(false);
  const [openSeasonalKeys, setOpenSeasonalKeys] = useState([]);
  const [openDiscountKeys, setOpenDiscountKeys] = useState([]);

  useEffect(() => {
    setIsRegularOpen(hasPriceData);
  }, [hasPriceData]);

  useEffect(() => {
    if (!hasExtraBedData) {
      setIsExtraBedOpen(false);
    }
  }, [data?.id, hasExtraBedData]);

  useEffect(() => {
    const validKeys = new Set(
      seasonalRates.map((item, idx) => String(item?.id ?? `seasonal-${idx}`)),
    );
    setOpenSeasonalKeys((prev) => prev.filter((key) => validKeys.has(key)));
  }, [data?.id, seasonalRates]);

  useEffect(() => {
    const validKeys = new Set(
      discounts.map((item, idx) => String(item?.id ?? `discount-${idx}`)),
    );
    setOpenDiscountKeys((prev) => prev.filter((key) => validKeys.has(key)));
  }, [data?.id, discounts]);

  const addSeasonalButtonClass = hasPriceData
    ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed";

  const bottomOutlineButtonClass = hasPriceData
    ? "bg-white border border-indigo-900 text-indigo-950 hover:bg-indigo-50 cursor-pointer"
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
    onOpenSeasonal?.(data, null);
  };

  const handleEditSeasonalRate = (e, seasonalItem) => {
    e?.stopPropagation();
    if (!hasPriceData) return;
    onOpenSeasonal?.(data, seasonalItem);
  };

  const handleEndSeasonal = (e, seasonalItem) => {
    e?.stopPropagation();
    if (!onEndSeasonal) return;
    onEndSeasonal(data, seasonalItem);
  };

  const handleAddDiscountRate = () => {
    if (!hasPriceData) return;
    onOpenDiscount?.(data, null);
  };

  const handleEditDiscountRate = (e, discountItem) => {
    e?.stopPropagation();
    if (!hasPriceData) return;
    onOpenDiscount?.(data, discountItem);
  };

  const handleEndDiscount = (e, discountItem) => {
    e?.stopPropagation();
    if (!onEndDiscount) return;
    onEndDiscount(data, discountItem);
  };

  const handleOpenExtraBedRate = (e) => {
    e?.stopPropagation();
    if (!hasPriceData) return;
    onOpenExtraBed?.(data);
  };

  return (
    <div className="bg-white p-4 shadow-md m-2 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">{data?.name}</h2>
      </div>

      {/* Regular Room Price Section */}
      {hasPriceData ? (
        <Collapse
          activeKey={isRegularOpen ? ["regular-price"] : []}
          onChange={(keys) =>
            setIsRegularOpen(Array.isArray(keys) && keys.length > 0)
          }
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 mb-3 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={2} />
          <span>Add Regular Room Rate</span>
        </button>
      )}

      {/* Extra Bed Rate Section */}
      {hasExtraBedData && (
        <Collapse
          activeKey={isExtraBedOpen ? ["extra-bed-rate"] : []}
          onChange={(keys) =>
            setIsExtraBedOpen(Array.isArray(keys) && keys.length > 0)
          }
          expandIconPlacement="end"
          className="mb-3! rounded-xl font-medium! overflow-hidden border border-amber-100 bg-white [&_.ant-collapse-header]:bg-amber-50/70! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3! [&_.ant-collapse-content-box]:p-0!"
          items={[
            {
              key: "extra-bed-rate",
              label: (
                <div className="flex items-center justify-between pr-2">
                  <span className="font-semibold text-slate-800 text-sm">
                    Extra Bed Rate
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenExtraBedRate}
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
                      {formatCurrency("MMK", data?.extra_bed_local_base_price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Local (USD)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency("USD", data?.extra_bed_local_usd_price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Foreigner (MMK)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(
                        "MMK",
                        data?.extra_bed_foreign_base_price,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-slate-700">For Foreigner (USD)</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency("USD", data?.extra_bed_foreign_usd_price)}
                    </span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}

      {/* Seasonal Rates List (Array) */}
      {seasonalRates.length > 0 && (
        <div className="space-y-3 mb-3">
          {seasonalRates.map((seasonalItem, index) => {
            const panelKey = String(seasonalItem?.id ?? `seasonal-${index}`);
            const isEnding =
              endingSeasonalId !== null &&
              seasonalItem?.id !== undefined &&
              endingSeasonalId === seasonalItem.id;

            const dateRangeLabel = formatDateRange(
              seasonalItem?.start_date,
              seasonalItem?.end_date,
            );

            return (
              <Collapse
                key={panelKey}
                activeKey={
                  openSeasonalKeys.includes(panelKey) ? [panelKey] : []
                }
                onChange={(keys) => {
                  const activeList = Array.isArray(keys) ? keys : [];
                  setOpenSeasonalKeys((prev) => {
                    const withoutCurrent = prev.filter((k) => k !== panelKey);
                    return activeList.includes(panelKey)
                      ? [...withoutCurrent, panelKey]
                      : withoutCurrent;
                  });
                }}
                expandIconPlacement="end"
                className="rounded-xl mb-2! font-medium! overflow-hidden border border-indigo-100/80 bg-white [&_.ant-collapse-header]:bg-indigo-50/70! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3! [&_.ant-collapse-content-box]:p-3.5!"
                items={[
                  {
                    key: panelKey,
                    label: (
                      <div className="flex items-center justify-between pr-2">
                        <div className="font-semibold text-slate-800 text-sm">
                          <div>{`Seasonal Rate`}</div>
                          <div>{dateRangeLabel}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleEditSeasonalRate(e, seasonalItem)
                          }
                          className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    ),
                    children: (
                      <div className="space-y-3">
                        <div className="divide-y divide-slate-100 text-sm">
                          <div className="flex items-center justify-between py-2.5">
                            <span className="text-slate-700">
                              For Local (MMK)
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(
                                "MMK",
                                seasonalItem?.local_base_price,
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2.5">
                            <span className="text-slate-700">
                              For Local (USD)
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(
                                "USD",
                                seasonalItem?.local_usd_price,
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2.5">
                            <span className="text-slate-700">
                              For Foreigner (MMK)
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(
                                "MMK",
                                seasonalItem?.foreign_base_price,
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-2.5">
                            <span className="text-slate-700">
                              For Foreigner (USD)
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(
                                "USD",
                                seasonalItem?.foreign_usd_price,
                              )}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isEnding}
                          onClick={(e) => handleEndSeasonal(e, seasonalItem)}
                          className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
                        >
                          {isEnding ? "Ending..." : "End Seasonal Rate"}
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            );
          })}
        </div>
      )}

      {/* Discounts List (Array) */}
      {discounts.length > 0 && (
        <div className="space-y-3 mb-3">
          {discounts.map((discountItem, index) => {
            const panelKey = String(discountItem?.id ?? `discount-${index}`);
            const isEndingDiscount =
              endingDiscountId !== null &&
              discountItem?.id !== undefined &&
              endingDiscountId === discountItem.id;

            const dateRangeLabel = formatDateRange(
              discountItem?.start_date,
              discountItem?.end_date,
            );

            const localBaseVal = getDiscountPriceValue(
              discountItem,
              "discount_local_base_price",
              "local_base_price",
            );
            const localUsdVal = getDiscountPriceValue(
              discountItem,
              "discount_local_usd_price",
              "local_usd_price",
            );
            const foreignBaseVal = getDiscountPriceValue(
              discountItem,
              "discount_foreign_base_price",
              "foreign_base_price",
            );
            const foreignUsdVal = getDiscountPriceValue(
              discountItem,
              "discount_foreign_usd_price",
              "foreign_usd_price",
            );

            const localBaseOff = calculateDiscountPercent(
              data?.local_base_price,
              localBaseVal,
            );
            const localUsdOff = calculateDiscountPercent(
              data?.local_usd_price,
              localUsdVal,
            );
            const foreignBaseOff = calculateDiscountPercent(
              data?.foreign_base_price,
              foreignBaseVal,
            );
            const foreignUsdOff = calculateDiscountPercent(
              data?.foreign_usd_price,
              foreignUsdVal,
            );

            return (
              <Collapse
                key={panelKey}
                activeKey={
                  openDiscountKeys.includes(panelKey) ? [panelKey] : []
                }
                onChange={(keys) => {
                  const activeList = Array.isArray(keys) ? keys : [];
                  setOpenDiscountKeys((prev) => {
                    const withoutCurrent = prev.filter((k) => k !== panelKey);
                    return activeList.includes(panelKey)
                      ? [...withoutCurrent, panelKey]
                      : withoutCurrent;
                  });
                }}
                expandIconPlacement="end"
                className="rounded-xl font-medium! overflow-hidden border border-rose-100 bg-white [&_.ant-collapse-header]:bg-rose-50/60! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3! [&_.ant-collapse-content-box]:p-3.5!"
                items={[
                  {
                    key: panelKey,
                    label: (
                      <div className="flex items-center justify-between pr-2">
                        <div className="font-semibold text-slate-800 text-sm">
                          <div>{"Discount Rate"}</div>
                          <div>
                            {dateRangeLabel ? (
                              <div className="rounded-lg bg-slate-100  text-sm font-medium text-slate-700">
                                {dateRangeLabel}
                              </div>
                            ) : (
                              <div className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                                Started manually (No end date)
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleEditDiscountRate(e, discountItem)
                          }
                          className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    ),
                    children: (
                      <div className="space-y-3">
                        <div className="divide-y divide-slate-100 text-sm">
                          <div className="py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700">
                                For Local (MMK)
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatCurrency("MMK", localBaseVal)}
                              </span>
                            </div>
                            {localBaseOff && (
                              <p className="text-xs font-semibold text-rose-500 mt-1">
                                Discount {localBaseOff}% Off
                              </p>
                            )}
                          </div>

                          <div className="py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700">
                                For Local (USD)
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatCurrency("USD", localUsdVal)}
                              </span>
                            </div>
                            {localUsdOff && (
                              <p className="text-xs font-semibold text-rose-500 mt-1">
                                Discount {localUsdOff}% Off
                              </p>
                            )}
                          </div>

                          <div className="py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700">
                                For Foreigner (MMK)
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatCurrency("MMK", foreignBaseVal)}
                              </span>
                            </div>
                            {foreignBaseOff && (
                              <p className="text-xs font-semibold text-rose-500 mt-1">
                                Discount {foreignBaseOff}% Off
                              </p>
                            )}
                          </div>

                          <div className="py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-700">
                                For Foreigner (USD)
                              </span>
                              <span className="font-semibold text-slate-800">
                                {formatCurrency("USD", foreignUsdVal)}
                              </span>
                            </div>
                            {foreignUsdOff && (
                              <p className="text-xs font-semibold text-rose-500 mt-1">
                                Discount {foreignUsdOff}% Off
                              </p>
                            )}
                          </div>
                        </div>

                        {onEndDiscount && (
                          <button
                            type="button"
                            disabled={isEndingDiscount}
                            onClick={(e) => handleEndDiscount(e, discountItem)}
                            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
                          >
                            {isEndingDiscount
                              ? "Ending..."
                              : "End Discount Rate"}
                          </button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            );
          })}
        </div>
      )}

      {/* Add Seasonal Room Rate */}
      <button
        type="button"
        disabled={!hasPriceData}
        onClick={handleAddSeasonalRate}
        className={`w-full font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 mb-3 transition-colors ${addSeasonalButtonClass}`}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={2} />
        <span>Add Seasonal Room Rate</span>
      </button>

      {/* Bottom Row Buttons */}

      <div
        className={`grid ${hasExtraBedData ? "grid-cols-1" : "grid-cols-2"} gap-3`}
      >
        <button
          type="button"
          disabled={!hasPriceData}
          onClick={handleAddDiscountRate}
          className={`w-full font-semibold py-3 px-3 rounded-xl flex justify-center items-center gap-1.5 text-sm transition-colors ${bottomOutlineButtonClass}`}
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={18}
            strokeWidth={2}
            className="shrink-0"
          />
          <span className="truncate">Add Discount Room R...</span>
        </button>
        {!hasExtraBedData && (
          <button
            type="button"
            disabled={!hasPriceData}
            onClick={handleOpenExtraBedRate}
            className={`w-full font-semibold py-3 px-3 rounded-xl flex justify-center items-center gap-1.5 text-sm transition-colors ${bottomOutlineButtonClass}`}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={18}
              strokeWidth={2}
              className="shrink-0"
            />
            <span className="truncate">Add Extra Bed Rate</span>
          </button>
        )}
      </div>
    </div>
  );
};
