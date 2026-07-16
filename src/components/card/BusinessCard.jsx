import React from "react";
import { EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";

const BusinessCard = ({ id, name, location, phone, isActive, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group/card p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 md:h-52 relative overflow-hidden ${
        isActive
          ? "border-[#0F296D] bg-blue-50/10 shadow-md shadow-blue-950/5"
          : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-xs"
      }`}
    >
      {/* Background Decorative Graphic */}
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full transition-all duration-500 ${
          isActive
            ? "bg-blue-50/40 scale-110"
            : "bg-slate-50/50 group-hover/card:scale-110"
        }`}
      />

      {/* Top Section */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isActive
                ? "bg-[#0F296D] text-white"
                : "bg-slate-100 text-slate-500 group-hover/card:bg-[#0F296D]/10 group-hover/card:text-[#0F296D]"
            }`}
          >
            <EnvironmentOutlined className="text-sm" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Active Outlet
          </span>
        </div>

        <h3 className="font-title text-base md:text-lg font-bold text-slate-800 mt-1 leading-tight">
          {name}
        </h3>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 flex items-end justify-between mt-auto">
        <div className="space-y-1">
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-45 md:max-w-50">
            {location}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold">{phone}</p>
        </div>

        {/* Action Arrow Icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isActive
              ? "bg-[#0F296D] text-white translate-x-0"
              : "bg-slate-50 text-slate-400 group-hover/card:bg-[#0F296D] group-hover/card:text-white group-hover/card:translate-x-1"
          }`}
        >
          <ArrowRightOutlined className="text-xs" />
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
