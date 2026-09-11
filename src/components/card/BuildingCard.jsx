import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import { deleteHotelBuilding } from "../../service/buildingSlice";
import _ from "lodash";
import { message } from "antd";
import { useDispatch } from "react-redux";
import {
  Delete02Icon,
  Edit04Icon,
  Image02Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";

const BuildingCard = ({ building }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const onDelete = () => {
    setIsModalOpen(true);
  };

  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-4">
      {/* Image Thumbnail / Placeholder */}
      <div className="w-full h-44 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
        {building?.imageUrl ? (
          <img
            src={building.imageUrl}
            alt={building.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <HugeiconsIcon icon={Image02Icon} />
        )}
      </div>

      {/* Building Details & Actions */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 m-0">
            {building?.name}
          </h2>
          <div className="flex items-center space-x-3 text-xs font-medium text-slate-400 mt-1.5">
            <span>{building?.floors?.length} Floors</span>
            <span>{building?.room_count} Rooms</span>
          </div>
        </div>

        {/* Action Buttons & View All Link */}
        <div className="flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                navigate(`/building-and-area/${building?.id}/edit`);
              }}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border-none cursor-pointer"
            >
              <HugeiconsIcon icon={Edit04Icon} />
            </button>
            <button
              onClick={() => onDelete()}
              className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border-none cursor-pointer"
            >
              <HugeiconsIcon icon={Delete02Icon} />
            </button>
          </div>

          {/* <button
            onClick={() => onViewAll(building)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 bg-transparent border-none cursor-pointer p-0"
          >
            <span>View All</span>

            <HugeiconsIcon icon={ArrowRight01Icon} />
          </button> */}
        </div>
      </div>
      <DeleteConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsDeleting(true);
          dispatch(deleteHotelBuilding(building?.id)).then((response) => {
            if (_.endsWith(response.type, "fulfilled")) {
              message.success("Success");
            } else {
              message.error("Error");
            }
          });
          setIsDeleting(false);
          setIsModalOpen(false);
        }}
        loading={isDeleting}
        title={`Delete ${building?.name} ?`}
      />
    </div>
  );
};

export default BuildingCard;
