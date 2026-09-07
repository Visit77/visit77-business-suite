import React, { useEffect } from "react";
import AddRoomNumberForm from "../components/form/AddRoomNumberForm";
import { useDispatch, useSelector } from "react-redux";
import { getOneRoomType, roomTypeSelector } from "../service/roomTypeSlice";
import { useNavigate, useParams } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import { selectBusinessId } from "../service/businessSlice";
import { getHotelBuilding } from "../service/buildingSlice";
import { createPhysicalRoom } from "../service/physicalRoomSlice";
import { message } from "antd";
import _ from "lodash";

export default function AddRoomNumber() {
  const { id } = useParams();
  const businessId = useSelector(selectBusinessId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getOneRoomType(id));
    }
    dispatch(
      getHotelBuilding({
        business_id: businessId,
      }),
    );
  }, [dispatch, id, businessId]);

  const { details: roomTypeData, isPending: isLoadingRoomType } =
    useSelector(roomTypeSelector);

  if (isLoadingRoomType) {
    return <PageLoading message="Loading room data..." />;
  }

  const handleSubmit = async (values) => {
    dispatch(
      createPhysicalRoom({
        data: {
          business_id: businessId,
          room_type_id: id,
          ...values,
          beds: [
            {
              bed_type_id: values?.beds,
              quantity: values?.bed_quantity,
            },
          ],
        },
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Success !");
        navigate(-1);
      } else {
      }
    });
  };

  return (
    <div>
      <AddRoomNumberForm roomType={roomTypeData} onSubmit={handleSubmit} />
    </div>
  );
}
