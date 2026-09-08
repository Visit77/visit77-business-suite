// EditRoomNumber.jsx
import React, { useEffect, useMemo, useState } from "react";
import AddRoomNumberForm from "../components/form/AddRoomNumberForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import { selectBusinessId } from "../service/businessSlice";
import { getHotelBuilding } from "../service/buildingSlice";
import {
  getOnePhysicalRoom,
  physicalRoomSelector,
  updatePhysicalRoom,
} from "../service/physicalRoomSlice";
import { message } from "antd";
import _ from "lodash";

export default function EditRoomNumber() {
  const { roomTypeId, id } = useParams();
  const businessId = useSelector(selectBusinessId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getOnePhysicalRoom(id));
    }
    dispatch(
      getHotelBuilding({
        business_id: businessId,
      }),
    );
  }, [dispatch, id, businessId]);

  const { details: physicalRoom, isPending: isLoadingRoomType } =
    useSelector(physicalRoomSelector);

  const initialValues = useMemo(() => {
    if (!physicalRoom) return null;

    return {
      building: physicalRoom?.building_data?.id,
      floor: physicalRoom?.floor_data?.id,
      room_no: physicalRoom?.room_no,
      room_view_ids: physicalRoom?.room_views?.map((v) => `${v.id}`) || [],
      bath_type_ids: physicalRoom?.bath_types?.map((b) => `${b.id}`) || [],
      room_area: physicalRoom?.room_area,
      area_unit: physicalRoom?.area_unit || "sqm",
      beds: physicalRoom?.beds?.[0]?.bed_type?.id,
      bed_quantity: String(physicalRoom?.beds?.[0]?.quantity || 1),
      extra_bed_available: physicalRoom?.extra_bed_available || false,
      extra_bed_quantity: physicalRoom?.extra_bed_quantity || 0,
      amenities: physicalRoom?.amenities?.map((a) => a.id) || [],
    };
  }, [physicalRoom]);

  if (isLoadingRoomType) {
    return <PageLoading message="Loading room data..." />;
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      id: id,
      business_id: businessId,
      room_type_id: roomTypeId,
      ...values,
    };

    dispatch(updatePhysicalRoom({ id: id, data: payload })).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Success !");
        navigate(-1);
      }
    });
    setLoading(false);
  };

  return (
    <div>
      <AddRoomNumberForm
        initialValues={initialValues}
        roomType={physicalRoom?.room_type}
        onSubmit={handleSubmit}
        isUpdate={true}
        loading={loading}
      />
    </div>
  );
}
