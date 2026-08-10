import React, { useEffect } from "react";
import { Modal } from "antd";
import {
  CloseOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleFilled,
  SwapOutlined,
  FileTextOutlined,
  ToolOutlined,
  HistoryOutlined,
  LockOutlined,
  MoonOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { getDotColor } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import { selectBusinessId } from "../service/businessSlice";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import _ from "lodash";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarCheckIn01Icon,
  CardExchange01Icon,
  FileClockIcon,
  InformationCircleIcon,
  Settings01Icon,
  SquareLockRemove01Icon,
} from "@hugeicons/core-free-icons";

const RoomDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { details: roomData, isPending } = useSelector(roomBoardSelector);

  useEffect(() => {
    if (id) {
      dispatch(
        getOneRoom({
          business_id: businessId,
          date: moment().format("YYYY-MM-DD"),
          id: id,
        }),
      );
    }
  }, [id, businessId, dispatch]);
  if (isPending) {
    return <PageLoading message="Loading room data..." />;
  }
  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="space-y-5">
        {/* 2. Top Banner: Room Info & Pricing */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-neutral-900">
                {roomData?.room_number}
              </h1>

              <span
                className={`${getDotColor(roomData?.display_status)} capitalize text-white text-xs font-semibold px-3 py-1 rounded-full`}
              >
                {roomData?.display_status}
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-500 mt-1.5">
              {roomData?.room_type?.name} &nbsp;
              {_.map(roomData?.core_snapshot?.beds, (bed, index) => {
                return (
                  <span key={index}>.&nbsp;{bed?.bed_type?.name}&nbsp;</span>
                );
              })}
              {roomData?.core_snapshot?.room_view?.name && (
                <span>.&nbsp;{roomData?.core_snapshot?.room_view?.name}</span>
              )}
              {roomData?.core_snapshot?.room_area && <span>.&nbsp;</span>}
              {roomData?.core_snapshot?.room_area}
              {roomData?.core_snapshot?.area_unit}
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-[#F4F7FC] rounded-xl p-3.5 flex items-center justify-between ">
            {_.map(roomData?.room_type?.rate_plans, (plan) => {
              return (
                <div className="pr-5">
                  <div className="text-md font-semibold text-neutral-500">
                    {plan?.guest_market == "local"
                      ? "Local Guest"
                      : " Foreigner Guest"}
                  </div>
                  <div className="text-lg font-bold text-primary-400">
                    {plan?.currency}{" "}
                    {plan?.guest_market == "local"
                      ? plan?.base_price
                      : plan?.usd_display_price}
                    <span className="text-[10px] text-neutral-600 font-bold">
                      / Night
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Left Column (8 cols) */}
          {/* <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <img
                  src={roomData?.avatar}
                  alt={roomData?.guestName}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-100"
                />
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm md:text-base">
                    {roomData?.guestName}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">
                    Booking ID: {roomData?.bookingId}
                  </p>
                </div>
              </div>
              <span className="bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <CheckCircleFilled className="text-xs" />
                <span>{roomData?.paymentStatus}</span>
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs divide-y divide-neutral-100">
              <div className="grid grid-cols-2 divide-x divide-neutral-100 p-5">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <CalendarOutlined className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-400">
                      Check-in Date
                    </div>
                    <div className="text-sm font-bold text-neutral-800 mt-0.5">
                      {roomData?.checkInDate}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {roomData?.checkInTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pl-5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center shrink-0">
                    <CalendarOutlined className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-400">
                      Check-out Date
                    </div>
                    <div className="text-sm font-bold text-neutral-800 mt-0.5">
                      {roomData?.checkOutDate}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {roomData?.checkOutTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-neutral-100 p-5">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                    <MoonOutlined className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-400">
                      Duration of Stay
                    </div>
                    <div className="text-sm font-bold text-neutral-800 mt-0.5">
                      {roomData?.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pl-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <UserOutlined className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-400">
                      Occupancy
                    </div>
                    <div className="text-sm font-bold text-neutral-800 mt-0.5">
                      {roomData?.occupancy}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Right Column: Quick Actions Panel (5 cols) */}
          <div className=" bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-neutral-800 font-bold text-xs uppercase tracking-wider">
              <AppstoreOutlined className="text-sm" />
              <span>Room Actions</span>
            </div>

            {/* Guest Services */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigate(`/room/${id}/check-in/`);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl  hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-info-600  cursor-pointer "
                >
                  <HugeiconsIcon
                    icon={CalendarCheckIn01Icon}
                    className=" text-primary-400"
                  />
                  <span>Check In</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-xl  hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-orange-400 cursor-pointer">
                  <HugeiconsIcon
                    icon={CardExchange01Icon}
                    className=" text-primary-400"
                  />
                  <span>Reserve</span>
                </button>
              </div>
              <div className=" grid grid-cols-4 gap-3 ">
                <button className="flex flex-col items-center justify-center p-3 rounded-xl  hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer">
                  <HugeiconsIcon
                    icon={SquareLockRemove01Icon}
                    className=" text-primary-400"
                  />
                  <span>Block</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-xl  hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    className=" text-primary-400"
                  />
                  <span>Room Details</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-xl  hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer">
                  <HugeiconsIcon
                    icon={FileClockIcon}
                    className=" text-primary-400"
                  />{" "}
                  <span>Room History</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-xl  hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer">
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    className=" text-primary-400"
                  />
                  <span>OOS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
