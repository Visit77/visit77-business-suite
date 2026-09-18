import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, Button, message } from "antd";

import {
  getOTARoomType,
  manageOTARoom,
  otaManagementSelector,
} from "../service/otaManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const AddOTARoom = () => {
  const { data, isPending } = useSelector(otaManagementSelector);

  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getOTARoomType({
        business_id: businessId,
      }),
    );
  }, [businessId, dispatch]);

  const initialRoomList = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data
      .filter((room) => room.rooms && room.rooms.length > 0)
      .map((room) => ({
        id: room.id,
        coreRoomTypeId: room.core_room_type_id,
        name: room.name,
        totalRoomCount: room.total_room_count,
        otaEnabledRoomCount: room.ota_enabled_room_count,
        maxOccupancy: room.max_occupancy,
        bookingEnabled: room.booking_enabled,
        coverImageUrl: room.cover_image_url,
        breakfastType: room.breakfast_plan_type,
        ratePlans: room.core_snapshot?.rate_plans || [],
        rooms: room.rooms || [],
      }));
  }, [data]);

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (initialRoomList.length > 0) {
      setGroups(initialRoomList);
    }
  }, [initialRoomList]);

  const handleToggleRoom = (groupId, physicalRoomId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;

        const updatedRooms = group.rooms.map((room) =>
          room.physical_room_id === physicalRoomId
            ? { ...room, is_ota_selected: !room.is_ota_selected }
            : room,
        );

        return { ...group, rooms: updatedRooms };
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedPhysicalRoomIds = groups.flatMap((group) =>
      group.rooms
        .filter((room) => room.is_ota_selected)
        .map((room) => room.physical_room_id),
    );
    dispatch(
      manageOTARoom({
        business_id: businessId,
        selected_room_ids: selectedPhysicalRoomIds,
      }),
    ).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success("Success");
      } else {
        message.error("Error");
      }
    });
  };
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col font-sans text-neutral-800 relative">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 px-4 sm:px-6 py-6 space-y-8 max-w-4xl mx-auto w-full pb-24">
            {groups.map((group) => {
              const selectedCount = group.rooms.filter(
                (r) => r.is_ota_selected,
              ).length;

              return (
                <div key={group.id} className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                    <h2 className="font-bold text-neutral-800 text-base">
                      {group.name}
                    </h2>
                    <span className="text-xs font-semibold text-emerald-500">
                      Selected: {selectedCount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {group.rooms.map((room) => (
                      <div
                        key={room.physical_room_id}
                        className="flex items-center gap-2 select-none py-1"
                      >
                        <Checkbox
                          checked={room.is_ota_selected}
                          onChange={() =>
                            handleToggleRoom(group.id, room.physical_room_id)
                          }
                        >
                          <span
                            className={`text-xs sm:text-sm font-bold tracking-tight ${
                              room.is_ota_selected
                                ? "text-emerald-500"
                                : "text-neutral-800"
                            }`}
                          >
                            {room.room_number}
                          </span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="fixed bottom-0 right-0 w-auto lg:w-2xl px-4 py-3 flex items-center gap-3 max-w-4xl mx-auto z-20">
            <Button
              size="large"
              block
              onClick={() => {
                navigate(-1);
              }}
              className="bg-neutral-100! border-neutral-100! hover:bg-neutral-200! text-neutral-700! font-semibold! rounded-xl! h-12!"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="bg-primary-600! hover:bg-primary-700! text-white! font-semibold! rounded-xl! h-12! border-none! shadow-md shadow-indigo-200"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOTARoom;
