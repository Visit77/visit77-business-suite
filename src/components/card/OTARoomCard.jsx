import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  LockPasswordIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Dropdown, message } from "antd";
import {
  removeOTARoom,
  updateSaleStatus,
} from "../../service/otaManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import _ from "lodash";

export const OTARoomCard = ({ room }) => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  const otaCount = room?.ota_records?.filter(
    (item) =>
      item.booking_status === "checked_in" ||
      item.booking_status === "reserved",
  ).length;

  const menuItems = [
    {
      key: "close",
      label: <>{room?.ota_sale_open === false ? "Open Room" : "Close Room"}</>,
      danger: room?.ota_sale_open,
      icon: (
        <HugeiconsIcon
          icon={LockPasswordIcon}
          size={16}
          className={`${
            room?.ota_sale_open === false ? "text-primary-600" : "text-red-600"
          }`}
        />
      ),
      onClick: () =>
        dispatch(
          updateSaleStatus({
            id: room?.physical_room_id,
            business_id: businessId,
            data: {
              action: room?.ota_sale_open === false ? "open" : "close",
              note: "Manual stop sale",
            },
          }),
        ).then((response) => {
          if (_.endsWith(response.type, "fulfilled")) {
            message.success("Success");
          } else {
            message.error("Error");
          }
        }),
    },
    {
      key: "delete",
      label: "Remove Room From OTA",
      icon: (
        <HugeiconsIcon icon={Delete02Icon} size={16} className="text-red-600" />
      ),
      danger: true,
      onClick: () =>
        dispatch(
          removeOTARoom({
            business_id: businessId,
            id: room?.physical_room_id,
          }),
        ).then((response) => {
          if (_.endsWith(response.type, "fulfilled")) {
            message.success("Success");
          } else {
            message.error("Error");
          }
        }),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between h-full">
      <div>
        {/* Header section with Room Code & Status */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base sm:text-lg font-bold text-neutral-800 truncate">
              {room?.room_number}
            </span>
            {room?.ota_sale_status === "closed" && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shrink-0">
                Closed
              </span>
            )}
          </div>
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="text-neutral-500 hover:text-neutral-800 transition-colors shrink-0 cursor-pointer p-1 rounded-md hover:bg-neutral-100">
              <HugeiconsIcon
                icon={MoreHorizontalIcon}
                size={18}
                className="text-neutral-800"
              />
            </button>
          </Dropdown>
        </div>

        {/* Room Specifications */}
        <p className="text-xs text-neutral-500 font-medium mb-4 leading-relaxed">
          {room?.room_standard?.name}
          {room?.bed_type?.name && ` • ${room?.bed_type?.name}`}
          {room?.room_views && room?.room_views.length > 0 && (
            <>
              {room?.room_views.map((view, index) => (
                <span key={view.id || index}>
                  {" • "} {view?.name}
                </span>
              ))}
            </>
          )}
          {room?.room_area && ` • ${room?.room_area} ${room?.area_unit || ""}`}
        </p>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs gap-2">
        <span
          className={`font-semibold shrink-0 ${
            otaCount > 0 ? "text-emerald-600" : "text-neutral-600"
          }`}
        >
          All OTA: {otaCount || 0}
        </span>
        <button className="text-blue-600 font-bold hover:underline shrink-0">
          View All History
        </button>
      </div>
    </div>
  );
};
