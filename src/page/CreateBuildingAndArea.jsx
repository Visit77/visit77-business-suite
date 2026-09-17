import React from "react";
import BuildingAndAreaForm from "../components/form/BuildingAndAreaForm";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import _ from "lodash";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { createHotelBuilding } from "../service/buildingSlice";

const CreateBuildingAndArea = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const businessId = useSelector(selectBusinessId);

  return (
    <div>
      <BuildingAndAreaForm
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
            createHotelBuilding({
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
export default CreateBuildingAndArea;
