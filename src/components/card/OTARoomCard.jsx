import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  LockPasswordIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Dropdown } from "antd";

export const OTARoomCard = ({ room }) => {
  const otaCount = room?.ota_records?.filter(
    (item) =>
      item.booking_status === "checked_in" ||
      item.booking_status === "reserved",
  ).length;

  const handleRoomClose = (id) => {
    console.log("id", id);
  };

  const handleRemoveRoomFromOTA = (id) => {
    console.log("id", id);
  };
  const menuItems = [
    {
      key: "close",
      label: "Close Room",
      danger: true,
      icon: (
        <HugeiconsIcon
          icon={LockPasswordIcon}
          size={16}
          className="text-red-600"
        />
      ),
      onClick: () => handleRoomClose(room?.id),
    },
    {
      key: "delete",
      label: "Remove Room From OTA",
      icon: (
        <HugeiconsIcon icon={Delete02Icon} size={16} className="text-red-600" />
      ),
      danger: true,
      onClick: () => handleRemoveRoomFromOTA(room?.id),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
      <div>
        {/* Header section with Room Code & Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-800">
              {room?.room_number}
            </span>
            {room?.ota_sale_status === "closed" && (
              <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                Closed
              </span>
            )}
          </div>
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="text-neutral-500 hover:text-neutral-800 transition-colors ml-1 shrink-0 cursor-pointer p-1 rounded-md hover:bg-neutral-100">
              <HugeiconsIcon
                icon={MoreHorizontalIcon}
                size={16}
                className="text-neutral-800"
              />
            </button>
          </Dropdown>
        </div>

        {/* Room Specifications */}
        <p className="text-xs text-neutral-500 font-medium mb-4">
          {room?.room_standard?.name}
          {" • "}
          {room?.bed_type?.name}
          {/* {room?.bed_types && room?.bed_types.length > 0 && (
            <>
              {" • "}
              {room?.bed_types.map((bed, index) => (
                <span key={bed.id || index}>
                  {bed?.name}
                  {index < room?.beds.length - 1 ? ", " : ""}
                </span>
              ))}
            </>
          )} */}
          {room?.room_views && room?.room_views.length > 0 && (
            <>
              {room?.room_views.map((view, index) => (
                <span key={view.id || index}>
                  {" • "} {view?.name}
                </span>
              ))}
            </>
          )}{" "}
          • {room?.room_area} {room?.area_unit}
        </p>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
        <span
          className={`font-semibold ${otaCount > 0 ? "text-success-600" : "text-neutral-600"} `}
        >
          All OTA: {otaCount}
        </span>
        <button className="text-blue-600 font-bold hover:underline">
          View All History
        </button>
      </div>
    </div>
  );
};
