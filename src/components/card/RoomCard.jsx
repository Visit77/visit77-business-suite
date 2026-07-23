import React, { useState } from "react";
import { Button, Tooltip, Carousel, Image } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  HeartOutlined,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../variables/constants";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const images =
    room?.photos && room.photos.length > 0
      ? room.photos.map((p) =>
          p.image?.startsWith("http") ? p.image : `${API_URL}${p.image}`,
        )
      : ["https://via.placeholder.com/400x300?text=No+Image"];

  const isAvailable = room?.available_rooms > 0;
  const statusText = isAvailable
    ? `${room?.available_rooms} AVAILABLE`
    : "BOOKED OUT";
  const statusClass = isAvailable
    ? "bg-emerald-500/90 text-white"
    : "bg-rose-500/90 text-white";

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative">
      {/* 1. Image Carousel & Preview Section */}
      <div className="relative overflow-hidden aspect-4/3 bg-slate-100 group/carousel">
        <Carousel
          dots={images.length > 1}
          arrows={images.length > 1}
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
          className="h-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide>div]:h-full"
        >
          {images.map((imgSrc, index) => (
            <div
              key={index}
              className="relative h-full w-full flex justify-center items-center"
            >
              <img
                src={imgSrc}
                alt={`${room?.name} ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                onClick={() => {
                  setPreviewIndex(index);
                  setPreviewVisible(true);
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Hover Overlay Button to open Fullscreen Preview */}
        <button
          onClick={() => setPreviewVisible(true)}
          className="absolute inset-0 m-auto w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs cursor-pointer z-10 pointer-events-auto"
          title="Click to view full screen"
        >
          <EyeOutlined className="text-lg" />
        </button>

        {/* Status Badge */}
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase z-10 ${statusClass}`}
        >
          {statusText}
        </span>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-rose-500 shadow-sm transition-colors active:scale-90 z-10">
          <HeartOutlined className="text-sm" />
        </button>
      </div>

      {/* Ant Design Hidden Image Preview Group (Full view & Navigation support) */}
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            current: previewIndex,
            onVisibleChange: (vis) => setPreviewVisible(vis),
            onChange: (current) => setPreviewIndex(current),
          }}
        >
          {images.map((imgSrc, idx) => (
            <Image key={idx} src={imgSrc} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* 2. Room Information Section */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h4 className="font-title text-base font-bold text-slate-800 truncate">
              {room?.name || "Unnamed Room"}
            </h4>
            <div className="text-right shrink-0">
              <span className="font-title text-base font-bold text-blue-600 block">
                {room?.local_base_price?.toLocaleString()}{" "}
                <span className="text-xs">
                  {room?.local_base_currency || "MMK"}
                </span>
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block -mt-0.5">
                Per Night
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {room?.room_standard?.name ||
              room?.room_build_type?.name ||
              "Standard Room"}
            {room?.room_area
              ? ` • ${room?.room_area} ${room?.area_unit || "sqm"}`
              : ""}
          </p>
        </div>

        {/* 3. Action Buttons Section */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <Button
            type="primary"
            className="flex-1! h-10! bg-blue-600! hover:bg-blue-700! font-title! text-xs! font-semibold! rounded-xl! border-none! transition-all!"
            onClick={() => {
              navigate(`/rooms/${room?.id}`);
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
