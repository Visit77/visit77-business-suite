import React, { useEffect } from "react";
import BuildingAndAreaForm from "../components/form/BuildingAndAreaForm";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import _ from "lodash";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOneBuilding,
  hotelBuildingSelector,
  updateHotelBuilding,
} from "../service/buildingSlice";

export const EditBuildingAndArea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const businessId = useSelector(selectBusinessId);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getOneBuilding({ id: id }));
  }, [businessId, dispatch]);

  const { details: building, isPending } = useSelector(hotelBuildingSelector);

  const initialData = {
    name: building?.name,
    floor_type: building?.floor_type,
    floor_from: building?.floors?.[0]?.name,
    floor_to: building?.floors?.length.toString(),
    image: building.image,
  };

  return (
    <div>
      <BuildingAndAreaForm
        initialData={initialData}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("business_id", businessId);
          formData.append("name", values?.name);
          formData.append("floor_type", values?.floor_type);
          formData.append("floor_from", values?.floor_from || "");
          formData.append("floor_to", values?.floor_to || "");
          if (values?.image) {
            formData.append("image", values?.image);
          }
          dispatch(
            updateHotelBuilding({
              id: id,
              data: formData,
            }),
          ).then((res) => {
            if (_.endsWith(res.type, "fulfilled")) {
              message.success("Building create Successful.");
              navigate(-1);
            }
          });
        }}
      />
    </div>
  );
};
