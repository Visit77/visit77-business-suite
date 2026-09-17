import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  DollarCircleIcon,
  Search01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { TabNavigation } from "../components/TabNavigation";
import { OTARoomCard } from "../components/card/OTARoomCard";
import { OTABookingCard } from "../components/card/OTABookingCard";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getOTARecord,
  getOTARoom,
  otaManagementSelector,
} from "../service/otaManagementSlice";

export default function OTAManagement() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const {
    data: otaManagement,
    record,
    isPending,
  } = useSelector(otaManagementSelector);

  const businessId = useSelector(selectBusinessId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getOTARoom({
        business_id: businessId,
      }),
    );
  }, [businessId, dispatch]);

  useEffect(() => {
    if (activeTab == "bookings") {
      dispatch(
        getOTARecord({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch, activeTab]);

  if (isPending) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const groupedData = record?.rooms
    ? Object.groupBy(record.rooms, (item) => item?.check_in)
    : {};
  const recordData = Object.entries(groupedData).map(
    ([checkInDate, items], index) => {
      return {
        check_in: checkInDate,
        rooms: items?.map((item, itemIndex) => ({
          ...item,
        })),
      };
    },
  );

  return (
    <div className="min-h-screen font-sans text-neutral-800">
      {/* Tabs Bar */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="mx-auto px-6 py-6 ">
        {/* ROOMS TAB CONTENT */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            {/* Summary Statistics & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-4 text-sm">
                <div className="font-bold text-blue-600">
                  Total Rooms:{" "}
                  <span className="text-neutral-800">
                    {otaManagement?.total_rooms}
                  </span>
                </div>
                <div className="h-4 w-px bg-neutral-200" />
                <div className="font-bold text-neutral-600">
                  Total OTA:{" "}
                  <span className="text-neutral-800">
                    {otaManagement?.total_ota_rooms}
                  </span>
                </div>
                <div className="h-4 w-px bg-neutral-200" />
                <div className="font-bold text-emerald-600">
                  Active OTA Room:{" "}
                  <span className="text-neutral-800">
                    {otaManagement?.total_open_ota_rooms}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-600 transition-colors">
                  <HugeiconsIcon icon={FilterIcon} size={18} />
                </button>
                <button className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors">
                  <HugeiconsIcon icon={DollarCircleIcon} size={18} />
                </button>
              </div>
            </div>

            {/* Room Groups Grid */}
            {otaManagement?.room_types?.map((roomType) => {
              const groupId = roomType.room_type_id || roomType.room_type_name;
              const isCollapsed = collapsedGroups[groupId];
              const roomsInGroup = roomType.rooms || [];

              return (
                <div key={groupId} className="space-y-3">
                  {/* Accordion Group Header */}
                  <div
                    onClick={() => toggleGroup(groupId)}
                    className="flex items-center justify-between cursor-pointer select-none py-1"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-neutral-800">
                        {roomType.room_type_name}
                      </h2>
                      <p className="text-xs font-semibold text-emerald-600">
                        Selected OTA: {roomType.selected_count || 0} / Total:{" "}
                        {roomType.total_rooms || roomsInGroup.length}
                      </p>
                    </div>
                    <button type="button" className="p-1 text-neutral-400">
                      <HugeiconsIcon
                        icon={isCollapsed ? ArrowDown01Icon : ArrowUp01Icon}
                        size={20}
                      />
                    </button>
                  </div>

                  {/* Desktop Grid Layout */}
                  {!isCollapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roomsInGroup.map((room) => (
                        <OTARoomCard
                          key={
                            room.physical_room_id || room.core_physical_room_id
                          }
                          room={room}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BOOKINGS TAB CONTENT */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Search Input Bar */}
            <div className="relative max-w-xl">
              <HugeiconsIcon
                icon={Search01Icon}
                size={20}
                className="absolute left-4 top-1/2 -tra-neutral-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search Room, Guest Info..."
                className="w-full bg-white border border-neutral-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>

            {/* Bookings List by Date */}
            <div className="space-y-8">
              {recordData?.map((group) => (
                <div key={group?.check_in} className="space-y-3">
                  <h3 className="text-md font-bold text-neutral-800">
                    {group?.check_in}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                    {group?.rooms?.map((room) => (
                      <OTABookingCard key={room?.id} booking={room} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
