import React, { useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getRoomDetails, roomSelector } from "../service/roomSlice";

const RoomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const businessId = useSelector(selectBusinessId);

  const { details: roomData } = useSelector(roomSelector);
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
  const snapshot = room?.core_snapshot || {};
  const roomType = room?.room_type || {};

  const renderValue = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    if (typeof val === "object") {
      return val.name || val.title || "-";
    }
    return val;
  };

  // Rate plans
  const localPlan = roomType?.rate_plans?.find(
    (r) => r.guest_market === "local",
  );
  const foreignPlan = roomType?.rate_plans?.find(
    (r) => r.guest_market === "foreign",
  );

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
          {renderValue(room?.room_type?.name)} •&nbsp;
          {room?.bath_types?.map((bath) => {
            return renderValue(bath);
          })}
          &nbsp; •&nbsp;
          {room?.room_views?.map((view) => {
            return renderValue(view);
          })}
        </p>
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
            <span className="text-slate-500">Building & Floor:</span>
            <span className="font-medium text-slate-800">
              {renderValue(room?.building)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Room View:</span>
            <span className="font-medium text-slate-800">
              {room?.room_views?.map((view) => {
                return renderValue(view);
              })}
              {/* {renderValue(room?.room_view)} */}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Bath Type:</span>
            <span className="font-medium text-slate-800">
              {room?.bath_types?.map((bath) => {
                return renderValue(bath);
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Room Description Card */}
      {/* <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Breakfast
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {renderValue(roomType?.breakfast)}
        </p>
      </div> */}

      {/* 3. Bed Configuration Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Bed Configuration
        </h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Bed Type:</span>
            <span className="font-medium text-slate-800">
              {/* {renderValue(snapshot?.bed_type)} */}
              {room?.beds?.map((bed) => {
                return renderValue(bed?.bed_type);
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Extra Bed:</span>
            <span className="font-medium text-slate-800">
              {/* {renderValue(snapshot?.bed_type)} */}
              {room?.extra_bed_available === true
                ? "Available"
                : "Not Available"}
              &nbsp;( {room?.extra_bed_quantity} )
            </span>
          </div>
        </div>
      </div>

      {/* 4. Occupancy Limits Card */}
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

      {/* 5. Pricing Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Pricing
        </h2>
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-slate-500 mb-1">Local Standard Rate:</p>
            <p className="font-bold text-slate-800">
              {room?.room_type?.local_base_price
                ? `${room?.room_type?.local_base_currency} ${room?.room_type?.local_base_price.toLocaleString()}`
                : "-"}
            </p>
          </div>
          <hr className="border-slate-100" />
          <div>
            <p className="text-slate-500 mb-1">Foreign Standard Rate:</p>
            <p className="font-bold text-slate-800">
              {room?.room_type?.foreign_base_price
                ? `${room?.room_type?.foreign_base_currency} ${room?.room_type?.foreign_base_price.toLocaleString()}`
                : "-"}
            </p>
            {/* {foreignPlan?.usd_price && (
              <p className="text-slate-500">USD {foreignPlan.usd_price}</p>
            )} */}
          </div>
        </div>
      </div>

      {/* 6. Amenities Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Amenities
        </h2>
        <div className="flex flex-wrap gap-2">
          {room?.room_type?.amenities?.length > 0 ? (
            room?.room_type?.amenities.map((item, index) => (
              <span
                key={item.id || index}
                className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium"
              >
                {renderValue(item)}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">-</span>
          )}
        </div>
      </div>

      {/* 7. Room Policies Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          Room Policies
        </h2>
        <div className="flex flex-wrap gap-2">
          {room?.policies?.length > 0 ? (
            room.policies.map((policy, index) => (
              <span
                key={policy.id || index}
                className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-medium"
              >
                {renderValue(policy)}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
