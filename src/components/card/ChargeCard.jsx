import React from "react";
import { EditOutlined } from "@ant-design/icons";

const ChargeCard = ({ title, type, value, onEdit }) => {
  const getSubtext = () => {
    if (type === "included") return "Included";
    if (type === "percentage") return `${value}% `;
    if (type === "fixed") return `${value} MMK`;
    return "";
  };

  return (
    <div className="bg-[#f8f9fa] p-4 rounded-xl flex justify-between items-center border border-gray-100 shadow-sm">
      <div>
        <h4 className="text-gray-700 font-semibold text-base mb-1">{title}</h4>
        <p className="text-gray-900 font-bold text-lg m-0">{getSubtext()}</p>
      </div>
      <button
        onClick={onEdit}
        className="text-[#4f46e5] hover:text-[#3730a3] text-xl p-2 rounded-full hover:bg-indigo-50 transition-all"
      >
        <EditOutlined />
      </button>
    </div>
  );
};

export default ChargeCard;
