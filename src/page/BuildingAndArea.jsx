import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { useNavigate } from "react-router-dom";
import BuildingCard from "../components/card/BuildingCard";
import {
  getHotelBuilding,
  hotelBuildingSelector,
} from "../service/buildingSlice";
import PageLoading from "../components/PageLoading";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const BuildingAndArea = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getHotelBuilding({ business_id: businessId }));
  }, [businessId, dispatch]);

  const { data: buildings, isPending } = useSelector(hotelBuildingSelector);

  if (isPending) {
    return <PageLoading message="Loading business data..." />;
  }

  return (
    <>
      <div className=" flex justify-between items-center mb-3">
        <h1 className=" font-semibold">Buildings And Areas</h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="flex-1! sm:flex-none! h-9! md:h-10! rounded-xl! bg-primary! hover:bg-primary-container! font-semibold! border-none! text-xs! md:text-sm!"
          onClick={() => navigate("/building-and-area/create")}
        >
          Add Building & Area
        </Button>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {buildings?.map((building) => (
          <BuildingCard
            key={building.id}
            building={building}
            onEdit={() => {}}
          />
        ))}
      </div>
    </>
  );
};

export default BuildingAndArea;
