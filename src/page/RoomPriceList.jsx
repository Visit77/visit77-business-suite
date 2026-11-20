import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  bookingRoomTypeSelector,
  getBookingRoomType,
} from "../service/bookingRoomTypeSlice";
import { RoomPriceCard } from "../components/card/RoomPriceCard";

const RoomPriceList = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBookingRoomType({ business_id: businessId }));
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(bookingRoomTypeSelector);

  return (
    <div>
      <div className=" grid grid-cols-2 gap-3">
        {data?.map((price) => {
          return <RoomPriceCard data={price} />;
        })}
      </div>
    </div>
  );
};

export default RoomPriceList;
