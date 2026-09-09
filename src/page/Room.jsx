import React, { useEffect } from "react";
import { Select, Input, Button, Empty } from "antd";
import RoomCard from "../components/card/RoomCard";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import { getRoomType, roomTypeSelector } from "../service/roomTypeSlice";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Room = () => {
  // Mock Data for Rooms
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoomType({ business_id: businessId }));
  }, [businessId, dispatch]);

  const { data: roomType, isPending } = useSelector(roomTypeSelector);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* 1. Top Filter Control Panel */}
      {/* <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
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
      </div> */}
      <div className=" flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="flex-1! sm:flex-none! h-9! md:h-10! rounded-xl! bg-primary! hover:bg-primary-container! font-semibold! border-none! text-xs! md:text-sm!"
          onClick={() => navigate("/room-create/")}
        >
          Add Room Type
        </Button>
      </div>
      {/* 2. Responsive Room Grid Layout */}
      {!isPending && (
        <>
          {roomType?.length > 0 ? (
            <div className="grid grid-cols-1  gap-6">
              {roomType?.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className=" w-full flex justify-center items-center">
              <Empty />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Room;
