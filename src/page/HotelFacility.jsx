import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOneBusiness,
  selectBusinessDetails,
  updateBusiness,
} from "../service/businessSlice";
import { CheckIcon, Edit02Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FacilitySelectModal from "../components/modal/FacilitySelectModal";
import _ from "lodash";
import { message } from "antd";
import { ratingOption } from "../utils/utils";
import RatingSelectModal from "../components/modal/RatingSelectModal";

const HotelFacility = () => {
  const details = useSelector(selectBusinessDetails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(
    details?.services?.map?.((service) => {
      return service?.id;
    }),
  );

  const dispatch = useDispatch();

  const handleSubmitFacilities = async (selectedIds) => {
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

  const handleSubmitRadio = async (rating) => {
    const formData = new FormData();
    formData.append("hotel_rating_star", rating?.toString());

    dispatch(updateBusiness({ id: details?.id, formData })).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Success !");
        dispatch(getOneBusiness(details?.id));

        setIsModalOpen(false);
      } else {
      }
    });
  };

  const selectedRating = ratingOption.find(
    (option) => option.value === details?.hotel_rating_star,
  );
  return (
    <div>
      <div className=" flex justify-between items-center">
        <div className=" font-medium text-xl">Rating</div>
        <div>
          <button className=" " onClick={() => setIsRatingModalOpen(true)}>
            <div className=" flex text-neutral-600 items-center font-medium ">
              <HugeiconsIcon icon={Edit02Icon} className=" pr-2" />
              Edit Rating
            </div>
          </button>
        </div>
      </div>
      <div className=" flex items-center my-3">
        <HugeiconsIcon icon={StarIcon} className=" text-yellow-400" />
        <span className=" text-lg font-medium ml-2">
          {selectedRating?.label}
        </span>
      </div>

      <div className=" flex justify-between items-center">
        <div className="  text-xl font-medium">
          Avaliable Service & Facility{" "}
        </div>
        <div>
          <button className="  p-2" onClick={() => setIsModalOpen(true)}>
            <div className=" flex text-neutral-600 items-center font-medium ">
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
      <RatingSelectModal
        open={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleSubmitRadio}
        initialSelected={details?.hotel_rating_star}
      />
    </div>
  );
};

export default HotelFacility;
