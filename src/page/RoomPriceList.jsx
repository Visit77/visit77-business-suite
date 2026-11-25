import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  bookingRoomTypeSelector,
  createRoomPrice,
  getBookingRoomType,
  createSeasonalRate,
  endSeasonalRate,
  updateSeasonalRate,
} from "../service/bookingRoomTypeSlice";
import { RoomPriceCard } from "../components/card/RoomPriceCard";
import RoomRangeModal from "../components/modal/RoomRangeModal";
import SeasonalRoomRangeModal from "../components/modal/SeasonalRoomRangeModal";
import DeleteConfirmModal from "../components/modal/DeleteConfirmModal";
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

  // End Seasonal Rate Delete Confirm Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [endTarget, setEndTarget] = useState(null);

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

  const handleOpenSeasonal = (roomItem, seasonalItem = null) => {
    setSeasonalInitialData({
      id: roomItem?.id ?? null,
      room_type_id: roomItem?.id ?? null,
      local_base_price: roomItem?.local_base_price ?? null,
      local_usd_price: roomItem?.local_usd_price ?? null,
      foreign_base_price: roomItem?.foreign_base_price ?? null,
      foreign_usd_price: roomItem?.foreign_usd_price ?? null,
      ...(seasonalItem
        ? {
            seasonal_id: seasonalItem.id ?? null,
            start_date: seasonalItem.start_date ?? null,
            end_date: seasonalItem.end_date ?? null,
            seasonal_local_base_price: seasonalItem.local_base_price ?? null,
            seasonal_local_usd_price: seasonalItem.local_usd_price ?? null,
            seasonal_foreign_base_price:
              seasonalItem.foreign_base_price ?? null,
            seasonal_foreign_usd_price: seasonalItem.foreign_usd_price ?? null,
          }
        : {
            seasonal_id: null,
            start_date: null,
            end_date: null,
            seasonal_local_base_price: null,
            seasonal_local_usd_price: null,
            seasonal_foreign_base_price: null,
            seasonal_foreign_usd_price: null,
          }),
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

  const handleSeasonalModalSubmit = async (payload, mode) => {
    setIsSeasonalSubmitting(true);
    try {
      const targetId =
        seasonalInitialData?.id ?? seasonalInitialData?.room_type_id;

      if (mode === "update") {
        await dispatch(
          updateSeasonalRate({
            data: payload,
            id: payload?.id,
            rate_id: payload?.seasonal_id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Seasonal Room Price update Successful.");
      } else {
        await dispatch(
          createSeasonalRate({
            data: payload,
            id: targetId,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Seasonal Price create Successful.");
      }

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

  const handleEndSeasonalRate = (roomItem, seasonalItem) => {
    setEndTarget({ roomItem, seasonalItem });
    setIsModalOpen(true);
  };

  const handleCloseEndModal = () => {
    if (isDeleting) return;
    setIsModalOpen(false);
    setEndTarget(null);
  };

  const handleConfirmEndSeasonal = async () => {
    if (!endTarget?.seasonalItem?.id) return;

    setIsDeleting(true);
    try {
      await dispatch(
        endSeasonalRate({
          id: endTarget?.roomItem?.id,
          rate_id: endTarget?.seasonalItem?.id,
          business_id: businessId,
        }),
      ).unwrap();

      message.success("Seasonal Rate ended successfully.");
      setIsModalOpen(false);
      setEndTarget(null);

      if (businessId) {
        await dispatch(getBookingRoomType({ business_id: businessId }));
      }
    } catch (error) {
      console.error("End seasonal rate error:", error);
      message.error(error?.message || "Failed to end seasonal rate.");
    } finally {
      setIsDeleting(false);
    }
  };

  const seasonalLabel =
    endTarget?.seasonalItem?.name ||
    (endTarget?.seasonalItem?.start_date && endTarget?.seasonalItem?.end_date
      ? `${endTarget.seasonalItem.start_date} to ${endTarget.seasonalItem.end_date}`
      : "Seasonal Rate");

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
            onEndSeasonal={handleEndSeasonalRate}
            endingSeasonalId={isDeleting ? endTarget?.seasonalItem?.id : null}
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

      <DeleteConfirmModal
        open={isModalOpen}
        onClose={handleCloseEndModal}
        onConfirm={handleConfirmEndSeasonal}
        loading={isDeleting}
        title={`End ${seasonalLabel} ?`}
        description={`Are you sure you want to end this seasonal rate${
          endTarget?.roomItem?.name ? ` for ${endTarget.roomItem.name}` : ""
        }? This action cannot be undone.`}
      />
    </div>
  );
};

export default RoomPriceList;
