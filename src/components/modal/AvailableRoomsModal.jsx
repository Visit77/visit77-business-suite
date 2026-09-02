import React from "react";
import { Modal, Checkbox, Button } from "antd";
import _ from "lodash";

const AvailableRoomsModal = ({
  isOpen,
  onClose,
  availableRoomsList = [],
  selectedRoomIds = [],
  setSelectedRoomIds,
  onConfirm,
}) => {
  const handleToggleRoom = (roomId) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  return (
    <Modal
      title={
        <div className="text-center text-base font-extrabold text-neutral-900 border-b border-neutral-100 pb-3">
          Available Rooms
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-2xl"
    >
      <div className="py-2 space-y-4 max-h-[60vh] overflow-y-auto">
        {availableRoomsList?.groups?.map((group, groupIndex) => {
          const roomTypeInfo = group?.room_type;
          const rooms = group?.rooms || [];
          const totalRoomsCount = rooms.length;
          const price = group?.rate_plan?.total_price || group?.total_price;

          return (
            <div key={groupIndex} className="space-y-2.5">
              {/* Room Type Header */}
              <div className="flex items-center justify-between py-1">
                <h2 className="text-sm font-bold text-neutral-900">
                  {roomTypeInfo?.name || "Room Type"} ({totalRoomsCount})
                  {price ? ` MMK ${price}` : ""}
                </h2>
              </div>

              {/* Physical Rooms List under this Room Type */}
              <div className="space-y-2.5">
                {rooms.map((room) => {
                  const isSelected = selectedRoomIds.includes(room.id);

                  return (
                    <div
                      key={room.id}
                      onClick={() => handleToggleRoom(room.id)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start space-x-3 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/20"
                          : "border-neutral-200 bg-white"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggleRoom(room.id)}
                        className="mt-0.5"
                      />
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-neutral-900">
                          #{room.room_number} . {room.floor} Floor,{" "}
                          {room.building}
                        </h3>
                        <p className="text-[11px] font-medium text-neutral-500">
                          {room.room_standard?.name} .{" "}
                          {_.map(room.beds, (b) => b?.bed_type?.name).join(
                            " / ",
                          )}
                          {room.room_views?.length > 0 &&
                            ` . ${_.map(room.room_views, (v) => v?.name).join(" . ")}`}
                          {room.room_area &&
                            ` . ${room.room_area} ${room.area_unit}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-neutral-100">
        <Button
          type="primary"
          onClick={onConfirm}
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
        >
          Continue ({selectedRoomIds.length})
        </Button>
      </div>
    </Modal>
  );
};

export default AvailableRoomsModal;
