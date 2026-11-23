import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  bookingRoomTypeSelector,
  createRoomPrice,
  getBookingRoomType,
  createSeasonalRate,
} from "../service/bookingRoomTypeSlice";
import { RoomPriceCard } from "../components/card/RoomPriceCard";
import RoomRangeModal from "../components/modal/RoomRangeModal";
import SeasonalRoomRangeModal from "../components/modal/SeasonalRoomRangeModal";
import { message } from "antd";

const RoomPriceList = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  // Regular Room Range Modal States
  const [modalOpened, setModalOpened] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seasonal Room Range Modal States
  const [seasonalModalOpened, setSeasonalModalOpened] = useState(false);
  const [seasonalInitialData, setSeasonalInitialData] = useState(null);
  const [isSeasonalSubmitting, setIsSeasonalSubmitting] = useState(false);

  useEffect(() => {
    if (businessId) {
      dispatch(getBookingRoomType({ business_id: businessId }));
    }
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(bookingRoomTypeSelector);

  const handleOpenCreate = (roomItem) => {
    setModalInitialData({ room_type_id: roomItem?.id ?? null });
    setModalOpened(true);
  };

  const handleOpenEdit = (roomItem) => {
    setModalInitialData(roomItem);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setModalOpened(false);
    setModalInitialData(null);
  };

  const handleOpenSeasonal = (roomItem) => {
    const firstSeasonal = Array.isArray(roomItem?.seasonal_rates)
      ? roomItem.seasonal_rates[0]
      : null;

    setSeasonalInitialData({
      ...roomItem,
      ...(firstSeasonal
        ? {
            seasonal_id: firstSeasonal.id,
            start_date: firstSeasonal.start_date ?? null,
            end_date: firstSeasonal.end_date ?? null,
            seasonal_local_base_price: firstSeasonal.local_base_price ?? null,
            seasonal_local_usd_price: firstSeasonal.local_usd_price ?? null,
            seasonal_foreign_base_price:
              firstSeasonal.foreign_base_price ?? null,
            seasonal_foreign_usd_price: firstSeasonal.foreign_usd_price ?? null,
          }
        : {}),
    });
    setSeasonalModalOpened(true);
  };

  const handleCloseSeasonalModal = () => {
    if (isSeasonalSubmitting) return;
    setSeasonalModalOpened(false);
    setSeasonalInitialData(null);
  };

  const handleModalSubmit = async (payload, mode) => {
    setIsSubmitting(true);
    try {
      const formattedValues = {
        ...payload,
      };

      if (mode === "update") {
        await dispatch(
          createRoomPrice({
            data: formattedValues,
            id: modalInitialData?.id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Room Price update Successful.");
      } else {
        await dispatch(
          createRoomPrice({
            data: formattedValues,
            id: modalInitialData?.room_type_id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Room Price create Successful.");
      }

      setModalOpened(false);
      setModalInitialData(null);

      if (businessId) {
        await dispatch(getBookingRoomType({ business_id: businessId }));
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeasonalModalSubmit = async (payload) => {
    setIsSeasonalSubmitting(true);
    try {
      const targetId =
        seasonalInitialData?.id ?? seasonalInitialData?.room_type_id;

      await dispatch(
        createSeasonalRate({
          data: payload,
          id: targetId,
          business_id: businessId,
        }),
      ).unwrap();

      message.success("Seasonal Room Rate saved successfully.");
      setSeasonalModalOpened(false);
      setSeasonalInitialData(null);

      if (businessId) {
        await dispatch(getBookingRoomType({ business_id: businessId }));
      }
    } catch (error) {
      console.error("Seasonal submit error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsSeasonalSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data?.map((price) => (
          <RoomPriceCard
            key={price.id}
            data={price}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onOpenSeasonal={handleOpenSeasonal}
          />
        ))}
      </div>

      <RoomRangeModal
        opened={modalOpened}
        onClose={handleCloseModal}
        initialData={modalInitialData}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
      />

      <SeasonalRoomRangeModal
        opened={seasonalModalOpened}
        onClose={handleCloseSeasonalModal}
        initialData={seasonalInitialData}
        onSubmit={handleSeasonalModalSubmit}
        isLoading={isSeasonalSubmitting}
      />
    </div>
  );
};

export default RoomPriceList;
