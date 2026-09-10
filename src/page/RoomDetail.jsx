import React, { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Image, Empty } from "antd";
import { selectBusinessId } from "../service/businessSlice";
import { getRoomDetails, roomSelector } from "../service/roomSlice";
import { API_URL } from "../variables/constants";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "#fff",
        fontSize: "18px",
        right: "10px",
        zIndex: 10,
        background: "rgba(0,0,0,0.3)",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <RightOutlined />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "#fff",
        fontSize: "18px",
        left: "10px",
        zIndex: 10,
        background: "rgba(0,0,0,0.3)",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <LeftOutlined />
    </div>
  );
};

const RoomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const businessId = useSelector(selectBusinessId);

  const { details: roomData, isPending } = useSelector(roomSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(
        getRoomDetails({
          id: id,
        }),
      );
    }
  }, [id, businessId, dispatch]);

  const room = roomData;
  const roomType = room?.room_type || {};

  const carouselSettings = {
    // nextArrow: <SampleNextArrow />,
    // prevArrow: <SamplePrevArrow />,
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const renderValue = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    if (typeof val === "object") {
      return val.name || val.title || "-";
    }
    return val;
  };

  if (isPending) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const roomImages = roomType?.photos || [];

  return (
    <div className="max-w-2xl mx-auto bg-slate-50 min-h-screen p-4 font-sans text-slate-800 space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center space-x-3 text-slate-700 py-1">
        <button onClick={() => navigate(-1)} className="hover:opacity-75">
          <ArrowLeftOutlined className="text-base" />
        </button>
        <span className="font-semibold text-base">Room Details</span>
      </div>

      {/* Room Title & Tag Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-slate-900">
            #{renderValue(room?.room_no)}
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          {renderValue(room?.room_type?.name)}
          &nbsp;
          {room?.bath_types?.length > 0 && "• "}
          {room?.bath_types?.map((bath, index) => {
            return (
              <span key={index}>
                {renderValue(bath)}
                {index < room?.bath_types.length - 1 ? ", " : ""}
              </span>
            );
          })}
          &nbsp;
          {room?.room_views?.length > 0 && "• "}
          {room?.room_views?.map((view, index) => {
            return (
              <span key={index}>
                {renderValue(view)}
                {index < room?.room_views.length - 1 ? ", " : ""}
              </span>
            );
          })}
        </p>
      </div>

      {/* 🖼️ IMAGE CAROUSEL SECTION - Added above Basic Info */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-100 overflow-hidden">
        {roomImages.length > 0 ? (
          <Image.PreviewGroup>
            <Carousel {...carouselSettings} className="room-detail-carousel">
              {roomImages.map((pic, index) => (
                <div key={index} className="outline-none relative aspect-16/10">
                  <Image
                    src={`${API_URL}${pic?.image}`}
                    alt={`Room Image ${index + 1}`}
                    className="rounded-xl object-cover"
                    wrapperClassName="w-full h-full"
                    width="100%"
                    height="100%"
                    fallback="path_to_fallback_image.png"
                  />
                </div>
              ))}
            </Carousel>
          </Image.PreviewGroup>
        ) : (
          <div className="flex aspect-auto items-center justify-center bg-slate-100 rounded-xl">
            <Empty description="No images available" />
          </div>
        )}
      </div>

      {/* 1. Basic Info Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Basic Info
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Room Standard :</span>
            <span className="font-medium text-slate-800">
              {renderValue(room?.room_type?.room_standard?.name)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Room Build Type :</span>
            <span className="font-medium text-slate-800">
              {renderValue(room?.room_type?.room_build_type?.name)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Building & Floor:</span>
            <span className="font-medium text-slate-800">
              {renderValue(room?.building)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Room View:</span>
            <span className="font-medium text-slate-800">
              {room?.room_views?.map((view, index) => {
                return (
                  <span key={index}>
                    {renderValue(view)}
                    {index < room?.room_views.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Bath Type:</span>
            <span className="font-medium text-slate-800">
              {room?.bath_types?.map((bath, index) => {
                return (
                  <span key={index}>
                    {renderValue(bath)}
                    {index < room?.bath_types.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Bed Configuration Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Bed Configuration
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Bed Type:</span>
            <span className="font-medium text-slate-800 text-right">
              {room?.beds?.length > 0
                ? room?.beds?.map((bed, index) => {
                    return (
                      <span key={index}>
                        {renderValue(bed?.bed_type)}
                        {index < room?.beds.length - 1 ? ", " : ""}
                      </span>
                    );
                  })
                : "-"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Extra Bed:</span>
            <span className="font-medium text-slate-800">
              {room?.extra_bed_available === true ? (
                <span className="text-green-600">Available</span>
              ) : (
                <span className="text-red-600">Not Available</span>
              )}
              {room?.extra_bed_available && ` (${room?.extra_bed_quantity})`}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Occupancy Limits Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Occupancy Limits
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Maximum Adults:</span>
            <span className="font-medium text-slate-800">
              {renderValue(room?.room_type?.max_adults)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Maximum Children:</span>
            <span className="font-medium text-slate-800">
              {renderValue(room?.room_type?.max_children)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Pricing Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Pricing
        </h2>
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-slate-500 mb-1">Local Standard Rate:</p>
            <p className="font-bold text-slate-800 text-base">
              {room?.room_type?.local_base_price
                ? `${
                    room?.room_type?.local_base_currency
                  } ${room?.room_type?.local_base_price.toLocaleString()}`
                : "-"}
            </p>
            <p className="font-bold text-slate-800 text-base">
              {room?.room_type?.local_usd_display_price
                ? `USD ${room?.room_type?.local_usd_display_price.toLocaleString()}`
                : "-"}
            </p>
          </div>
          <hr className="border-slate-100" />
          <div>
            <p className="text-slate-500 mb-1">Foreign Standard Rate:</p>
            <p className="font-bold text-slate-800 text-base">
              {room?.room_type?.foreign_base_price
                ? `${
                    room?.room_type?.foreign_base_currency
                  } ${room?.room_type?.foreign_base_price.toLocaleString()}`
                : "-"}
            </p>
            <p className="font-bold text-slate-800 text-base">
              {room?.room_type?.foreign_usd_display_price
                ? `USD ${room?.room_type?.foreign_usd_display_price.toLocaleString()}`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Amenities Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Amenities
        </h2>
        <div className="flex flex-wrap gap-2 pt-1">
          {room?.room_type?.amenities?.length > 0 ? (
            room?.room_type?.amenities.map((item, index) => (
              <span
                key={item.id || index}
                className="bg-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-full font-medium border border-slate-100"
              >
                {renderValue(item)}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 p-1">-</span>
          )}
        </div>
      </div>

      {/* 6. Room Policies Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Room Policies
        </h2>
        <div className="flex flex-wrap gap-2 pt-1">
          {room?.policies?.length > 0 ? (
            room.policies.map((policy, index) => (
              <span
                key={policy.id || index}
                className="bg-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-full font-medium border border-slate-100"
              >
                {renderValue(policy)}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 p-1">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
