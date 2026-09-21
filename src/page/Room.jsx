import React, { useEffect } from "react";
import { Select, Input, Button, Empty } from "antd";
import RoomCard from "../components/card/RoomCard";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import { getRoomType, roomTypeSelector } from "../service/roomTypeSlice";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PageLoading from "../components/PageLoading";

const Room = () => {
  // Mock Data for Rooms
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoomType({ business_id: businessId }));
  }, [businessId, dispatch]);

  const navigate = useNavigate();
  const { data: roomType, isPending } = useSelector(roomTypeSelector);

  if (isPending) {
    return <PageLoading message="Loading business data..." />;
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
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
    </div>
  );
};

export default Room;
