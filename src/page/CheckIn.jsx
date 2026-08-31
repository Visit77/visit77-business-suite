import React, { useEffect, useState } from "react";
import CheckInForm from "../components/form/CheckInForm";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import moment from "moment";
import PageLoading from "../components/PageLoading";

const CheckIn = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { details: roomData, isPending } = useSelector(roomBoardSelector);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(
        getOneRoom({
          business_id: businessId,
          date: moment().format("YYYY-MM-DD"),
          id: id,
        }),
      );
    }
  }, [id, businessId, dispatch]);

  if (isPending) {
    return <PageLoading message="Loading room data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white ">
      <CheckInForm data={roomData} />
    </div>
  );
};

export default CheckIn;
