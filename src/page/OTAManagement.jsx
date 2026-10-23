import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  DollarCircleIcon,
  Search01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { TabNavigation } from "../components/TabNavigation";
import { OTARoomCard } from "../components/card/OTARoomCard";
import { OTABookingCard } from "../components/card/OTABookingCard";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  changeInventoryMode,
  deleteRoomForOta,
  getOTARecord,
  getOTARoom,
  manageOTARoom,
  otaManagementSelector,
  reopenRoomForOta,
} from "../service/otaManagementSlice";
import { Link } from "react-router-dom";
import { Button, Divider, message, Radio, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { INVENTORY_MODE } from "../variables/constants";
import AddRoomModalForOTA from "../components/modal/AddRoomModalForOTA";
import OTARoomCloseModal from "../components/modal/OTARoomCloseModal";
import DeleteConfirmModal from "../components/modal/DeleteConfirmModal";
import ReopenModal from "../components/modal/ReopenModal";

export default function OTAManagement() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isReopenModal, setIsReopenModal] = useState(false);
  const [isReopen, setIsReopen] = useState(false);

  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  const [inventoryMode, setInventoryMode] = useState(
    () => localStorage.getItem(INVENTORY_MODE) || "physical_room",
  );

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
        timeline_status: "all",
      }),
    );
  }, [businessId, dispatch]);

  useEffect(() => {
    if (activeTab === "bookings") {
      dispatch(
        getOTARecord({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch, activeTab]);

  if (isPending) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading...
      </div>
    );
  }

  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const groupedData = record?.rooms
    ? Object.groupBy(record.rooms, (item) => item?.check_in)
    : {};
  const recordData = Object.entries(groupedData).map(([checkInDate, items]) => {
    return {
      check_in: checkInDate,
      rooms: items?.map((item) => ({
        ...item,
      })),
    };
  });

  const options = [
    { label: "OTA Only", value: "room_type_count" },
    { label: "OTA+PMS", value: "physical_room" },
  ];

  return (
    <div className="min-h-screen font-sans text-neutral-800 bg-neutral-50/50">
      <div className="flex justify-between items-center">
        <Radio.Group
          block
          options={options}
          value={inventoryMode}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            const newValue = e.target.value;
            dispatch(
              changeInventoryMode({
                business_id: businessId,
                data: { inventory_mode: newValue },
              }),
            ).then((response) => {
              if (_.endsWith(response.type, "fulfilled")) {
                message.success("Success");
                localStorage.setItem(INVENTORY_MODE, newValue);
                setInventoryMode(newValue);
              } else {
                message.error("Error");
              }
            });
          }}
        />

        {inventoryMode == "physical_room" && (
          <Link to={`/ota-revenue/add-room`}>
            <Button
              type="default"
              icon={<PlusOutlined />}
              className="h-9 px-3 sm:px-4 rounded-xl bg-primary! border-blue-100 text-white! hover:bg-blue-100! hover:text-blue-700! font-semibold text-xs flex items-center gap-1 shadow-none"
            >
              Add Room For OTA
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs Bar */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
        {/* ROOMS TAB CONTENT */}
        {activeTab === "rooms" && (
          <div className="space-y-6">
            {/* Summary Statistics & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="font-bold text-blue-600">
                  Total Rooms:{" "}
                  <span className="text-neutral-800">
                    {otaManagement?.total_rooms || 0}
                  </span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-neutral-200" />
                <div className="font-bold text-neutral-600">
                  Total OTA:{" "}
                  <span className="text-neutral-800">
                    {otaManagement?.total_ota_rooms || 0}
                  </span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-neutral-200" />
                <div className="font-bold text-emerald-600">
                  Active OTA Room:{" "}
                  <span className="text-neutral-800">
                    {otaManagement?.total_open_ota_rooms || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button className="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-600 transition-colors">
                  <HugeiconsIcon icon={FilterIcon} size={18} />
                </button>
                <button className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors">
                  <HugeiconsIcon icon={DollarCircleIcon} size={18} />
                </button>
              </div>
            </div>

            {/* Room Groups Grid */}
            <>
              {inventoryMode == "physical_room" ? (
                <>
                  {otaManagement?.room_types?.map((roomType) => {
                    const groupId =
                      roomType.room_type_id || roomType.room_type_name;
                    const isCollapsed = collapsedGroups[groupId];
                    const roomsInGroup = roomType.rooms || [];

                    return (
                      <div key={groupId} className="space-y-3">
                        <div
                          onClick={() => toggleGroup(groupId)}
                          className="flex items-center justify-between cursor-pointer select-none py-1.5 px-1 rounded-lg hover:bg-neutral-100/60 transition-colors"
                        >
                          <div>
                            <h2 className="text-base sm:text-lg font-bold text-neutral-800">
                              {roomType.room_type_name}
                            </h2>
                            <p className="text-xs font-semibold text-emerald-600">
                              Selected OTA: {roomType.selected_count || 0} /
                              Total:{" "}
                              {roomType.total_rooms || roomsInGroup.length}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="p-1 text-neutral-400"
                          >
                            <HugeiconsIcon
                              icon={
                                isCollapsed ? ArrowDown01Icon : ArrowUp01Icon
                              }
                              size={20}
                            />
                          </button>
                        </div>

                        {!isCollapsed && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {roomsInGroup.map((room) => (
                              <OTARoomCard
                                key={
                                  room.physical_room_id ||
                                  room.core_physical_room_id
                                }
                                room={room}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {otaManagement?.room_types?.map((roomType) => {
                    const groupId =
                      roomType.room_type_id || roomType.room_type_name;

                    return (
                      <div
                        className="border rounded-lg p-2 border-neutral-200 shadow bg-white"
                        key={groupId}
                      >
                        <h2 className="text-base sm:text-lg font-bold text-neutral-800">
                          {roomType.room_type_name}
                        </h2>
                        <div className="flex justify-between items-center text-sm text-neutral-600">
                          <div>OTA Room : {roomType?.total_ota_rooms}</div>
                          <div>Booking : {roomType?.booked_rooms}</div>
                        </div>
                        {roomType?.closed_rooms > 0 && (
                          <div>
                            <div className=" mt-2 text-xs flex justify-between items-center">
                              <div>
                                Close Condition: {roomType?.closed_rooms}{" "}
                                Rooms{" "}
                              </div>
                              <Tag color="red" variant="solid">
                                Close
                              </Tag>
                            </div>
                            <div className=" flex justify-between items-center mt-3">
                              <button
                                className=" text-green-800 font-bold cursor-pointer underline"
                                onClick={() => {
                                  setSelectedRoomType(roomType);
                                  setIsReopenModal(true);
                                }}
                              >
                                Reopen
                              </button>

                              <button
                                className=" text-green-800 font-bold cursor-pointer"
                                onClick={() => {
                                  setSelectedRoomType(roomType);
                                  setIsModalOpen(true);
                                }}
                              >
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  className=" text-red-800"
                                />
                              </button>
                            </div>
                          </div>
                        )}
                        <Divider className="border-neutral-300! my-2" />

                        <div className="flex justify-end items-center">
                          <button
                            onClick={() => {
                              setSelectedRoomType(roomType);
                              setIsAddRoomOpen(true);
                            }}
                            className="text-blue-600 font-medium border-2 border-blue-200 rounded-lg px-3 py-1 mr-2 hover:bg-blue-50 transition"
                          >
                            Add Room
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRoomType(roomType);
                              setIsCloseModalOpen(true);
                            }}
                            className="text-red-700 font-medium border-2 border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          </div>
        )}

        {/* BOOKINGS TAB CONTENT */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="relative max-w-xl">
              <HugeiconsIcon
                icon={Search01Icon}
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search Room, Guest Info..."
                className="w-full bg-white border border-neutral-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>

            <div className="space-y-8">
              {recordData?.map((group) => (
                <div key={group?.check_in} className="space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-800">
                    {group?.check_in}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <OTARoomCloseModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        roomTypeId={selectedRoomType?.room_type_id}
        maxAvailableRooms={selectedRoomType?.available_rooms}
        roomTypeName={selectedRoomType?.room_type_name}
      />

      <AddRoomModalForOTA
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        roomType={selectedRoomType}
        onSave={(data) => {
          dispatch(
            manageOTARoom({
              business_id: businessId,
              data: {
                room_types: [
                  {
                    room_type_id: data?.room_type_id,
                    total_rooms: data?.total_rooms,
                  },
                ],
              },
            }),
          ).then((response) => {
            if (_.endsWith(response.type, "fulfilled")) {
              message.success("Success");
              setIsAddRoomOpen(false);
              dispatch(
                getOTARoom({ business_id: businessId, timeline_status: "all" }),
              );
            } else {
              message.error("Error");
            }
          });
        }}
      />

      <DeleteConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsDeleting(true);
          dispatch(
            deleteRoomForOta({
              id: selectedRoomType?.close_conditions?.[0]?.id,
              business_id: businessId,
            }),
          )
            .then((response) => {
              if (_.endsWith(response.type, "fulfilled")) {
                message.success("Success");
                setIsModalOpen(false);
                dispatch(
                  getOTARoom({
                    business_id: businessId,
                    timeline_status: "all",
                  }),
                );
              } else {
                message.error("Error");
              }
            })
            .finally(() => {
              setIsDeleting(false);
            });
        }}
        loading={isDeleting}
        title={`Delete ${selectedRoomType?.room_type_name || ""} ?`}
      />

      <ReopenModal
        open={isReopenModal}
        onClose={() => setIsReopenModal(false)}
        onConfirm={() => {
          setIsReopen(true);
          dispatch(
            reopenRoomForOta({
              id: selectedRoomType?.close_conditions?.[0]?.id,
              business_id: businessId,
            }),
          )
            .then((response) => {
              if (_.endsWith(response.type, "fulfilled")) {
                message.success("Success");
                setIsReopenModal(false);
                dispatch(
                  getOTARoom({
                    business_id: businessId,
                    timeline_status: "all",
                  }),
                );
              } else {
                message.error("Error");
              }
            })
            .finally(() => {
              setIsReopen(false);
            });
        }}
        loading={isReopen}
        title={`Reopen ${selectedRoomType?.room_type_name || ""} ?`}
      />
    </div>
  );
}
