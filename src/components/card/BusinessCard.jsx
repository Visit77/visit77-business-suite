import React from "react";
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../variables/constants";

const BusinessCard = ({ business, onSelect }) => {
  return (
    <div className="w-full max-w-85 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans transition-all duration-300 hover:shadow-md">
      {/* 1. Image Section with Active Badge */}
      <div className="relative w-full h-44 overflow-hidden bg-slate-100">
        <img
          src={`${API_URL}${business?.profile}`}
          alt={business?.name_1}
          className="w-full h-full object-cover"
        />

        {/* Active Badge at Top Right */}
        {!business?.is_deleted && (
          <div className="absolute top-3 right-3 bg-[#002266] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm uppercase">
            ACTIVE
          </div>
        )}
      </div>

      {/* 2. Content Body Section */}
      <div className="p-4 flex flex-col justify-between grow space-y-4">
        {/* Title & Category Icon */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-800 text-base md:text-lg leading-snug">
              {business?.name_1}
            </h3>
            {/* Hotel/Building Icon */}
            <div className="text-[#0F296D] text-lg shrink-0">
              <BankOutlined />
            </div>
          </div>

          {/* Location Line */}
          {/* <div className="flex items-center space-x-1.5 text-slate-500 text-xs mt-2">
            <EnvironmentOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div> */}
        </div>

        {/* 3. Select Business Button */}
        <button
          type="button"
          onClick={() => onSelect && onSelect(business?.id)}
          className="w-full py-2.5 px-4 rounded-xl border-2 border-[#0F296D] text-[#0F296D] font-bold text-xs md:text-sm flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-[#0F296D] hover:text-white group cursor-pointer"
        >
          <span>Select Business</span>
          <ArrowRightOutlined className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;
