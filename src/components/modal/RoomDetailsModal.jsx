import React from "react";
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

const RoomDetailsModal = ({
  open,
  onClose,
  data = {
    roomNo: "#M 303",
    status: "Occupied",
    roomType: "Double Room - King Bed - City View - 301 sqft",
    localPrice: "MMK 300,000",
    foreignPrice: "USD 40",
    guestName: "Carter Curtis",
    bookingId: "BK202603",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    paymentStatus: "Paid",
    checkInDate: "04 Jun 2026",
    checkInTime: "From 14:00 PM",
    checkOutDate: "08 Jun 2026",
    checkOutTime: "Until 12:00 PM",
    duration: "2 Nights",
    occupancy: "2 Adults, 1 Child",
  },
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      // closeIcon={null}
      centered
      width={960}
      className="p-0 rounded-3xl overflow-hidden [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:rounded-3xl"
    >
      <div className="bg-[#FAFBFD] font-sans text-slate-800">
        {/* 1. Modal Header */}

        {/* Modal Main Content Layout */}
        <div className="space-y-5">
          {/* 2. Top Banner: Room Info & Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-slate-900">
                  {data.roomNo}
                </h1>
                <span className="bg-[#1D3557] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {data.status}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1.5">
                {data.roomType}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#F4F7FC] rounded-xl p-3.5 flex items-center divide-x divide-slate-200/80">
              <div className="pr-5">
                <div className="text-[10px] font-semibold text-slate-500">
                  Local Guest
                </div>
                <div className="text-sm font-bold text-[#0F296D]">
                  {data.localPrice}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    / Night
                  </span>
                </div>
              </div>
              <div className="pl-5">
                <div className="text-[10px] font-semibold text-slate-500">
                  Foreigner Guest
                </div>
                <div className="text-sm font-bold text-[#0F296D]">
                  {data.foreignPrice}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    / Night
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Main Grid (Left Details + Right Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Guest Card */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={data.avatar}
                    alt={data.guestName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      {data.guestName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Booking ID: {data.bookingId}
                    </p>
                  </div>
                </div>
                <span className="bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
                  <CheckCircleFilled className="text-xs" />
                  <span>{data.paymentStatus}</span>
                </span>
              </div>

              {/* Booking Info 2x2 Grid */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
                {/* Row 1 */}
                <div className="grid grid-cols-2 divide-x divide-slate-100 p-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <CalendarOutlined className="text-base" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400">
                        Check-in Date
                      </div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">
                        {data.checkInDate}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {data.checkInTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pl-5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center shrink-0">
                      <CalendarOutlined className="text-base" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400">
                        Check-out Date
                      </div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">
                        {data.checkOutDate}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {data.checkOutTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 divide-x divide-slate-100 p-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                      <MoonOutlined className="text-base" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400">
                        Duration of Stay
                      </div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">
                        {data.duration}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pl-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <UserOutlined className="text-base" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400">
                        Occupancy
                      </div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">
                        {data.occupancy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                <AppstoreOutlined className="text-sm" />
                <span>Quick Actions</span>
              </div>

              {/* Guest Services */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Guest Services
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <CalendarOutlined className="text-lg text-indigo-600 mb-1.5" />
                    <span>Check Out</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <ClockCircleOutlined className="text-lg text-indigo-600 mb-1.5" />
                    <span>Extend Stay</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <SwapOutlined className="text-lg text-indigo-600 mb-1.5" />
                    <span>Change Room</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <FileTextOutlined className="text-lg text-indigo-600 mb-1.5" />
                    <span>View Booking</span>
                  </button>
                </div>
              </div>

              {/* Maintenance & Ops */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Maintenance & Ops
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <div className="text-lg text-indigo-600 mb-1.5">✨</div>
                    <span>House Keeping</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <ToolOutlined className="text-lg text-indigo-600 mb-1.5" />
                    <span>Maintenance</span>
                  </button>
                </div>
              </div>

              {/* Administration */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Administration
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors text-slate-700 font-bold text-xs border border-slate-100 cursor-pointer">
                    <HistoryOutlined className="text-lg text-indigo-600 mb-1.5" />
                    <span>Room History</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50/50 hover:bg-rose-100/50 transition-colors text-rose-600 font-bold text-xs border border-rose-200 cursor-pointer">
                    <LockOutlined className="text-lg text-rose-500 mb-1.5" />
                    <span>Block Room</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoomDetailsModal;
