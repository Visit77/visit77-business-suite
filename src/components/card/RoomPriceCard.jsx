import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";

export const RoomPriceCard = ({ data }) => {
  const [hasRegularRate, setHasRegularRate] = useState(false);

  const secondaryButtonClass = hasRegularRate
    ? "bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 cursor-pointer"
    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed";

  const handleRegularRateClick = () => {
    setHasRegularRate(true);
  };

  return (
    <div className="bg-white p-4 shadow-md m-2">
      <h2 className="text-lg font-bold text-slate-900 mb-4">{data?.name}</h2>

      {/* Add Regular Room Rate (Always Active) */}
      <button
        type="button"
        onClick={handleRegularRateClick}
        className="w-full bg-primary-800 hover:bg-primary-700 text-white font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 mb-3 transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={2} />
        <span>Add Regular Room Rate</span>
      </button>

      {/* Add Seasonal Room Rate */}
      <button
        type="button"
        disabled={!hasRegularRate}
        className={`w-full font-semibold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 mb-3 transition-colors ${secondaryButtonClass}`}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={2} />
        <span>Add Seasonal Room Rate</span>
      </button>

      {/* Bottom Row Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!hasRegularRate}
          className={`w-full font-semibold py-3.5 px-3 rounded-xl flex justify-center items-center gap-1.5 transition-colors ${secondaryButtonClass}`}
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
          disabled={!hasRegularRate}
          className={`w-full font-semibold py-3.5 px-3 rounded-xl flex justify-center items-center gap-1.5 transition-colors ${secondaryButtonClass}`}
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
