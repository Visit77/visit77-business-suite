import React, { useState } from "react";
import { Button, Tooltip, message, Dropdown } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../variables/constants";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { deleteRoomType } from "../../service/roomTypeSlice";
import { deletePhysicalRoom } from "../../service/physicalRoomSlice";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRoomDeleteModalOpen, setIsRoomDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    setIsDeleting(true);
    dispatch(deleteRoomType(id)).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success("Success");
      } else {
        message.error("Error");
      }
    });
    setIsDeleting(false);
    setIsModalOpen(false);
  };

  const handleRoomUnitDelete = (innerRoom) => {
    setSelectedRoom(innerRoom);
    setIsRoomDeleteModalOpen(true);
  };

  const confirmRoomUnitDelete = () => {
    dispatch(deletePhysicalRoom(selectedRoom?.id)).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success(`Room ${selectedRoom?.room_no} deleted successfully`);
      } else {
        message.error("Error");
      }
    });
    setIsRoomDeleteModalOpen(false);
    setSelectedRoom(null);
  };

  const mainImage =
    room?.photos && room.photos.length > 0
      ? room.photos[0].image?.startsWith("http")
        ? room.photos[0].image
        : `${API_URL}${room.photos[0].image}`
      : "https://via.placeholder.com/100?text=No+Image";

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-neutral-200/80 shadow-xs space-y-4 sm:space-y-5">
      {/* 1. Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Left Info Side */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Room Image */}
          <div className="relative shrink-0 w-full sm:w-24 h-48 sm:h-24 rounded-xl overflow-hidden bg-neutral-100">
            <img
              src={mainImage}
              alt={room?.name || "Room Image"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-1.5 w-full">
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                {room?.name}
              </h3>
              <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100">
                {room?.available_rooms || 0} rooms
              </span>
            </div>

            <div className="text-xs text-neutral-500 font-medium leading-relaxed">
              <span>
                Capacity: {room?.max_occupancy}{" "}
                <span className="hidden sm:inline mx-1.5">•</span>
                {room?.max_adults && `${room?.max_adults} Adults`}{" "}
                <span className="hidden sm:inline mx-1.5">•</span>
                {room?.max_children && ` ${room?.max_children} Child`}
              </span>
              <span className="hidden sm:inline mx-1.5">•</span>
              <br className="sm:hidden" />
              <span>
                Nightly Rate:{" "}
                <strong className="text-neutral-900 font-bold">
                  {room?.local_base_currency || "MMK"}{" "}
                  {room?.local_base_price?.toLocaleString() || "300,000"}
                </strong>
                {room?.foreign_usd_display_price && (
                  <span className="text-neutral-900 font-bold">
                    {" "}
                    / ${room?.foreign_usd_display_price} USD
                  </span>
                )}
              </span>
            </div>

            {/* Tags / Amenities */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {room?.amenities?.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-100 text-neutral-600 text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                >
                  {typeof item === "object" ? item?.name : item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end sm:justify-start gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/rooms/${room?.id}/add-room-numbers`)}
            className="h-9 px-3 sm:px-4 rounded-xl text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-100! hover:text-blue-700! font-semibold text-xs flex items-center gap-1 shadow-none"
          >
            Add Room Numbers
          </Button>

          <Tooltip title="Edit">
            <Button
              shape="circle"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-neutral-500 border-neutral-200 hover:text-blue-600! hover:border-blue-300!"
              icon={<EditOutlined />}
              onClick={() => navigate(`/rooms/edit/${room?.id}`)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              shape="circle"
              danger
              className="w-9 h-9 flex items-center justify-center rounded-xl border-rose-200 text-rose-500 bg-rose-50/30 hover:bg-rose-100!"
              icon={<DeleteOutlined />}
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
        </div>
      </div>

      <hr className="border-neutral-100" />

      {/* 2. Bottom Section: Assigned Room Units */}
      <div>
        <h4 className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase mb-3">
          Assigned Room Units & Live Availability
        </h4>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {room?.physical_room_groups?.flatMap((room_group, groupIdx) =>
            room_group?.rooms?.map((innerRoom, roomIdx) => {
              const menuItems = [
                {
                  key: "edit",
                  label: "Edit",
                  icon: <EditOutlined />,
                  onClick: () =>
                    navigate(
                      `/rooms/${room?.id}/edit-room-number/${innerRoom?.id}`,
                    ),
                },
                {
                  key: "delete",
                  label: "Delete",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleRoomUnitDelete(innerRoom),
                },
              ];

              return (
                <div
                  key={innerRoom?.id || `${groupIdx}-${roomIdx}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-neutral-200/80 transition-all hover:border-neutral-300"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-bold text-neutral-800 truncate">
                      {innerRoom?.room_no}
                    </span>
                  </div>

                  <Dropdown
                    menu={{ items: menuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <button className="text-neutral-500 hover:text-neutral-800 transition-colors ml-1 shrink-0 cursor-pointer p-1 rounded-md hover:bg-neutral-100">
                      <EllipsisOutlined className="text-lg!" />
                    </button>
                  </Dropdown>
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* Main Room Type Delete Modal */}
      <DeleteConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDelete(room?.id)}
        loading={isDeleting}
        title="Delete Room Plan?"
      />

      {/* Individual Room Unit Delete Modal */}
      <DeleteConfirmModal
        open={isRoomDeleteModalOpen}
        onClose={() => setIsRoomDeleteModalOpen(false)}
        onConfirm={confirmRoomUnitDelete}
        title={`Delete Room Unit (${selectedRoom?.room_no})?`}
      />
    </div>
  );
};

export default RoomCard;
