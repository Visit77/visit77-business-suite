import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Image, Empty } from "antd";
import { selectBusinessId } from "../service/businessSlice";
import { getRoomDetails, roomSelector } from "../service/roomSlice";
import { API_URL } from "../variables/constants";

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
    <div className="mx-auto  min-h-screen p-4 font-sans text-neutral-800 space-y-4">
      {/* Navigation Header */}

      {/* Room Title & Tag Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-neutral-900">
            #{renderValue(room?.room_no)}
          </h1>
        </div>
        <p className="text-xs text-neutral-500">
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
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-neutral-100 overflow-hidden">
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
          <div className="flex aspect-auto items-center justify-center bg-neutral-100 rounded-xl">
            <Empty description="No images available" />
          </div>
        )}
      </div>

      {/* 1. Basic Info Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-100">
        <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-3">
          Basic Info
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Room Standard :</span>
            <span className="font-medium text-neutral-800">
              {renderValue(room?.room_type?.room_standard?.name)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Room Build Type :</span>
            <span className="font-medium text-neutral-800">
              {renderValue(room?.room_type?.room_build_type?.name)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Building & Floor:</span>
            <span className="font-medium text-neutral-800">
              {renderValue(room?.building)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Room View:</span>
            <span className="font-medium text-neutral-800">
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
            <span className="text-neutral-500">Bath Type:</span>
            <span className="font-medium text-neutral-800">
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
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-100">
        <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-3">
          Bed Configuration
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Bed Type:</span>
            <span className="font-medium text-neutral-800 text-right">
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
            <span className="text-neutral-500">Extra Bed:</span>
            <span className="font-medium text-neutral-800">
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
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-100">
        <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-3">
          Occupancy Limits
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Maximum Adults:</span>
            <span className="font-medium text-neutral-800">
              {renderValue(room?.room_type?.max_adults)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Maximum Children:</span>
            <span className="font-medium text-neutral-800">
              {renderValue(room?.room_type?.max_children)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Pricing Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-100">
        <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-3">
          Pricing
        </h2>
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-neutral-500 mb-1">Local Standard Rate:</p>
            <p className="font-bold text-neutral-800 text-base">
              {room?.room_type?.local_base_price
                ? `${
                    room?.room_type?.local_base_currency
                  } ${room?.room_type?.local_base_price.toLocaleString()}`
                : "-"}
            </p>
            <p className="font-bold text-neutral-800 text-base">
              {room?.room_type?.local_usd_display_price
                ? `USD ${room?.room_type?.local_usd_display_price.toLocaleString()}`
                : "-"}
            </p>
          </div>
          <hr className="border-neutral-100" />
          <div>
            <p className="text-neutral-500 mb-1">Foreign Standard Rate:</p>
            <p className="font-bold text-neutral-800 text-base">
              {room?.room_type?.foreign_base_price
                ? `${
                    room?.room_type?.foreign_base_currency
                  } ${room?.room_type?.foreign_base_price.toLocaleString()}`
                : "-"}
            </p>
            <p className="font-bold text-neutral-800 text-base">
              {room?.room_type?.foreign_usd_display_price
                ? `USD ${room?.room_type?.foreign_usd_display_price.toLocaleString()}`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Amenities Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-100">
        <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-3">
          Amenities
        </h2>
        <div className="flex flex-wrap gap-2 pt-1">
          {room?.room_type?.amenities?.length > 0 ? (
            room?.room_type?.amenities.map((item, index) => (
              <span
                key={item.id || index}
                className="bg-neutral-100 text-neutral-700 text-xs px-3.5 py-2 rounded-full font-medium border border-neutral-100"
              >
                {renderValue(item)}
              </span>
            ))
          ) : (
            <span className="text-xs text-neutral-500 p-1">-</span>
          )}
        </div>
      </div>

      {/* 6. Room Policies Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-100">
        <h2 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-3">
          Room Policies
        </h2>
        <div className="flex flex-wrap gap-2 pt-1">
          {room?.policies?.length > 0 ? (
            room.policies.map((policy, index) => (
              <span
                key={policy.id || index}
                className="bg-neutral-100 text-neutral-700 text-xs px-3.5 py-2 rounded-full font-medium border border-neutral-100"
              >
                {renderValue(policy)}
              </span>
            ))
          ) : (
            <span className="text-xs text-neutral-500 p-1">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
