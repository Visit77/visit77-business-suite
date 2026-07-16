import React from "react";
import { Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, HeartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const statusStyles = {
    AVAILABLE: "bg-emerald-500/90 text-white",
    OCCUPIED: "bg-blue-600/95 text-white",
    CLEANING: "bg-amber-400 text-slate-800",
    MAINTENANCE: "bg-rose-500/90 text-white",
  };
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div className="relative overflow-hidden aspect-4/3 bg-slate-100">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${statusStyles[room.status] || "bg-slate-500"}`}
        >
          {room.status}
        </span>
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-rose-500 shadow-sm transition-colors active:scale-90">
          <HeartOutlined className="text-sm!" />
        </button>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h4 className="font-title text-base font-bold text-on-surface truncate">
              {room.roomNo} - {room.name}
            </h4>
            <div className="text-right shrink-0">
              <span className="font-title text-base font-bold text-primary block">
                ${room.price}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-outline block -mt-0.5">
                Per Night
              </span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant/70 font-medium">
            {room.type}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
          <Button
            type="primary"
            className="flex-1! h-10! bg-primary! hover:bg-primary-container! font-title! text-xs! font-semibold! rounded-xl! border-none! transition-all!"
            onClick={() => {
              navigate("/rooms/1");
            }}
          >
            View Details
          </Button>
          <Tooltip title="Edit">
            <Button
              className="w-10! h-10! rounded-xl! border-slate-200! hover:text-blue-600! hover:border-blue-200! flex! items-center! justify-center! shadow-none! shrink-0!"
              icon={<EditOutlined className="text-lg!" />}
              onClick={() => {
                navigate(`/rooms/edit/${room?.id}`);
              }}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              danger
              className="w-10! h-10! rounded-xl! border-rose-100! hover:bg-rose-50/50! flex! items-center! justify-center! shadow-none! shrink-0!"
              icon={<DeleteOutlined className="text-lg!" />}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
