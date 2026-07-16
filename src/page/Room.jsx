import React from "react";
import { Select, Input, Button } from "antd";
import RoomCard from "../components/card/RoomCard";

const Room = () => {
  // Mock Data for Rooms
  const roomsData = [
    {
      id: 1,
      roomNo: "Room 101",
      name: "Single Premium",
      type: "First Floor",
      price: 120,
      status: "AVAILABLE",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600",
    },
    {
      id: 2,
      roomNo: "Room 204",
      name: "Double Deluxe",
      type: "Second Floor",
      price: 250,
      status: "OCCUPIED",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600",
    },
    {
      id: 3,
      roomNo: "Room 305",
      name: "Executive Suite",
      type: "Third Floor",
      price: 450,
      status: "CLEANING",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600",
    },
    {
      id: 4,
      roomNo: "Room 102",
      name: "Single Economy",
      type: "First Floor",
      price: 95,
      status: "MAINTENANCE",
      image:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600",
    },
    {
      id: 5,
      roomNo: "Room 205",
      name: "Double Suite",
      type: "Second Floor",
      price: 280,
      status: "AVAILABLE",
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600",
    },
    {
      id: 6,
      roomNo: "Room 108",
      name: "Single King",
      type: "First Floor",
      price: 150,
      status: "OCCUPIED",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* 1. Top Filter Control Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-on-surface-variant/70 tracking-wide block">
              Room Type
            </span>
            <Select
              defaultValue="all"
              className="w-full h-10 rounded-xl"
              options={[{ value: "all", label: "All Types" }]}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-on-surface-variant/70 tracking-wide block">
              Status
            </span>
            <Select
              defaultValue="all"
              className="w-full! h-10! rounded-xl!"
              options={[{ value: "all", label: "All Status" }]}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-on-surface-variant/70 tracking-wide block">
              Price Range
            </span>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Min"
                className="h-10 rounded-xl bg-surface/40 border-slate-200"
              />
              <span className="text-outline text-xs">-</span>
              <Input
                placeholder="Max"
                className="h-10 rounded-xl bg-surface/40 border-slate-200"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              className="w-full h-10 bg-amber-300 hover:bg-amber-400 font-title text-xs font-bold text-slate-800 rounded-xl border-none shadow-none cursor-pointer transition-colors"
            >
              Filter Rooms
            </button>
          </div>
        </div>
      </div>

      {/* 2. Responsive Room Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomsData.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Room;
