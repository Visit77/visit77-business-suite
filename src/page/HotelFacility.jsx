import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOneBusiness,
  selectBusinessDetails,
  updateBusiness,
} from "../service/businessSlice";
import { CheckIcon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FacilitySelectModal from "../components/modal/FacilitySelectModal";
import _ from "lodash";
import { message } from "antd";

const HotelFacility = () => {
  const details = useSelector(selectBusinessDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(
    details?.services?.map?.((service) => {
      return service?.id;
    }),
  );

  const dispatch = useDispatch();

  const handleSubmitFacilities = async (selectedIds) => {
    console.log("Selected Facility IDs:", selectedIds);

    setSelectedFacilityIds(selectedIds);
    const formData = new FormData();
    formData.append("services", JSON.stringify(selectedIds));

    dispatch(updateBusiness({ id: details?.id, formData })).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Success !");
        dispatch(getOneBusiness(details?.id));

        setIsModalOpen(false);
      } else {
      }
    });
  };

  return (
    <div>
      <div className=" flex justify-between items-center">
        <div className="  text-xl">Avaliable Service & Facility </div>
        <div>
          <button
            className=" bg-primary-600 rounded p-2"
            onClick={() => setIsModalOpen(true)}
          >
            <div className=" flex text-white items-center font-medium ">
              <HugeiconsIcon icon={Edit02Icon} className=" pr-2" />
              Edit Service
            </div>
          </button>
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-4 mt-4">
        {details?.services?.map((service) => {
          return (
            <div className=" flex font-medium">
              <HugeiconsIcon icon={CheckIcon} className="text-green-600 pr-2" />
              {service?.name}
            </div>
          );
        })}
      </div>

      <FacilitySelectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitFacilities}
        initialSelected={selectedFacilityIds}
      />
    </div>
  );
};

export default HotelFacility;
