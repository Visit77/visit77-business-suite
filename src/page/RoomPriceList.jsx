import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { selectBusinessId } from "../service/businessSlice";
import {
  bookingRoomTypeSelector,
  createRoomPrice,
  getBookingRoomType,
  createSeasonalRate,
  endSeasonalRate,
  updateSeasonalRate,
  createDiscountRate,
  updateDiscountRate,
  endDiscountRate,
  setExtraBedPrice,
} from "../service/bookingRoomTypeSlice";
import { RoomPriceCard } from "../components/card/RoomPriceCard";
import RoomRangeModal from "../components/modal/RoomRangeModal";
import SeasonalRoomRangeModal from "../components/modal/SeasonalRoomRangeModal";
import DeleteConfirmModal from "../components/modal/DeleteConfirmModal";
import DiscountRoomRateModal from "../components/modal/DiscountRateModal";
import ExtraBedRateModal from "../components/modal/ExtraBedRateModal";

const RoomPriceList = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  // 1. Regular Room Price Modal States
  const [modalOpened, setModalOpened] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Seasonal Room Rate Modal States
  const [seasonalModalOpened, setSeasonalModalOpened] = useState(false);
  const [seasonalInitialData, setSeasonalInitialData] = useState(null);
  const [isSeasonalSubmitting, setIsSeasonalSubmitting] = useState(false);

  // 3. Discount Room Rate Modal States
  const [discountModalOpened, setDiscountModalOpened] = useState(false);
  const [discountInitialData, setDiscountInitialData] = useState(null);
  const [isDiscountSubmitting, setIsDiscountSubmitting] = useState(false);

  // 4. Extra Bed Rate Modal States
  const [extraBedModalOpened, setExtraBedModalOpened] = useState(false);
  const [extraBedInitialData, setExtraBedInitialData] = useState(null);
  const [isExtraBedSubmitting, setIsExtraBedSubmitting] = useState(false);

  // 5. Delete / End Confirm Modal States (Seasonal & Discount)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (businessId) {
      dispatch(getBookingRoomType({ business_id: businessId }));
    }
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(bookingRoomTypeSelector);

  const refreshRoomTypes = async () => {
    if (businessId) {
      await dispatch(getBookingRoomType({ business_id: businessId }));
    }
  };

  // ---------------- Regular Rate Handlers ----------------
  const handleOpenCreate = (roomItem) => {
    setModalInitialData({
      name: roomItem?.name,
      room_type_id: roomItem?.id ?? null,
    });
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

  const handleModalSubmit = async (payload, mode) => {
    setIsSubmitting(true);
    try {
      if (mode === "update") {
        await dispatch(
          createRoomPrice({
            data: payload,
            id: modalInitialData?.id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Room Price update Successful.");
      } else {
        await dispatch(
          createRoomPrice({
            data: payload,
            id: modalInitialData?.room_type_id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Room Price create Successful.");
      }

      setModalOpened(false);
      setModalInitialData(null);
      await refreshRoomTypes();
    } catch (error) {
      console.error("Submit error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Seasonal Rate Handlers ----------------
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

  const handleSeasonalModalSubmit = async (payload, mode) => {
    setIsSeasonalSubmitting(true);
    const targetId =
      seasonalInitialData?.id ?? seasonalInitialData?.room_type_id;

    try {
      if (mode === "update") {
        await dispatch(
          updateSeasonalRate({
            data: payload,
            id: payload?.id,
            rate_id: payload?.seasonal_id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Seasonal Price update Successful.");
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
      await refreshRoomTypes();
    } catch (error) {
      console.error("Seasonal submit error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsSeasonalSubmitting(false);
    }
  };

  // ---------------- Discount Rate Handlers ----------------
  const handleOpenDiscount = (roomItem, discountItem = null) => {
    setDiscountInitialData({
      id: roomItem?.id ?? null,
      room_type_id: roomItem?.id ?? null,
      local_base_price: roomItem?.local_base_price ?? null,
      local_usd_price: roomItem?.local_usd_price ?? null,
      foreign_base_price: roomItem?.foreign_base_price ?? null,
      foreign_usd_price: roomItem?.foreign_usd_price ?? null,
      ...(discountItem
        ? {
            discount_id: discountItem.id ?? null,
            start_date: discountItem.start_date ?? null,
            end_date: discountItem.end_date ?? null,
            schedule_type:
              discountItem.schedule_type ||
              (discountItem.start_date && discountItem.end_date
                ? "scheduled"
                : "manual"),
            discount_local_base_price:
              discountItem.discount_local_base_price ??
              discountItem.local_base_price ??
              null,
            discount_local_usd_price:
              discountItem.discount_local_usd_price ??
              discountItem.local_usd_price ??
              null,
            discount_foreign_base_price:
              discountItem.discount_foreign_base_price ??
              discountItem.foreign_base_price ??
              null,
            discount_foreign_usd_price:
              discountItem.discount_foreign_usd_price ??
              discountItem.foreign_usd_price ??
              null,
          }
        : {
            discount_id: null,
            start_date: null,
            end_date: null,
            schedule_type: "manual",
            discount_local_base_price: null,
            discount_local_usd_price: null,
            discount_foreign_base_price: null,
            discount_foreign_usd_price: null,
          }),
    });
    setDiscountModalOpened(true);
  };

  const handleCloseDiscountModal = () => {
    if (isDiscountSubmitting) return;
    setDiscountModalOpened(false);
    setDiscountInitialData(null);
  };

  const handleDiscountModalSubmit = async (payload, mode) => {
    setIsDiscountSubmitting(true);
    try {
      const targetId =
        discountInitialData?.id ?? discountInitialData?.room_type_id;
      if (mode === "update") {
        await dispatch(
          updateDiscountRate({
            data: payload,
            id: payload?.id,
            discount_id: payload?.discount_id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Room Price update Successful.");
      } else {
        await dispatch(
          createDiscountRate({
            data: payload,
            id: targetId,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Room Discount Price create Successful.");
      }

      setDiscountModalOpened(false);
      setDiscountInitialData(null);
      await refreshRoomTypes();
    } catch (error) {
      console.error("Discount submit error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsDiscountSubmitting(false);
    }
  };

  // ---------------- Extra Bed Rate Handlers ----------------
  const handleOpenExtraBed = (roomItem) => {
    setExtraBedInitialData({
      id: roomItem?.id ?? null,
      room_type_id: roomItem?.id ?? null,
      extra_bed_local_base_price: roomItem?.extra_bed_local_base_price ?? null,
      extra_bed_local_usd_price: roomItem?.extra_bed_local_usd_price ?? null,
      extra_bed_foreign_base_price:
        roomItem?.extra_bed_foreign_base_price ?? null,
      extra_bed_foreign_usd_price:
        roomItem?.extra_bed_foreign_usd_price ?? null,
    });
    setExtraBedModalOpened(true);
  };

  const handleCloseExtraBedModal = () => {
    if (isExtraBedSubmitting) return;
    setExtraBedModalOpened(false);
    setExtraBedInitialData(null);
  };

  const handleExtraBedModalSubmit = async (payload, mode) => {
    setIsExtraBedSubmitting(true);
    try {
      const targetId =
        extraBedInitialData?.id ?? extraBedInitialData?.room_type_id;

      await dispatch(
        setExtraBedPrice({
          data: payload,
          id: targetId,
          business_id: businessId,
        }),
      ).unwrap();

      message.success(
        mode === "update"
          ? "Extra Bed Rate update Successful."
          : "Extra Bed Rate create Successful.",
      );
      setExtraBedModalOpened(false);
      setExtraBedInitialData(null);
      await refreshRoomTypes();
    } catch (error) {
      console.error("Extra bed submit error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsExtraBedSubmitting(false);
    }
  };

  // ---------------- End Seasonal / Discount Handlers ----------------
  const handleEndSeasonalRate = (roomItem, seasonalItem) => {
    setDeleteTarget({
      type: "seasonal",
      roomItem,
      rateItem: seasonalItem,
    });
    setDeleteModalOpen(true);
  };

  const handleEndDiscountRate = (roomItem, discountItem) => {
    setDeleteTarget({
      type: "discount",
      roomItem,
      rateItem: discountItem,
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.rateItem?.id) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "seasonal") {
        await dispatch(
          endSeasonalRate({
            id: deleteTarget?.roomItem?.id,
            rate_id: deleteTarget?.rateItem?.id,
            business_id: businessId,
          }),
        ).unwrap();
        message.success("Seasonal Rate ended successfully.");
      } else if (deleteTarget.type === "discount") {
        await dispatch(
          endDiscountRate({
            id: deleteTarget?.roomItem?.id,
            discount_id: deleteTarget?.rateItem?.id,
            business_id: businessId,
          }),
        ).unwrap();

        message.success("Discount Rate ended successfully.");
      }

      setDeleteModalOpen(false);
      setDeleteTarget(null);
      await refreshRoomTypes();
    } catch (error) {
      console.error("End rate error:", error);
      message.error(error?.message || "Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isSeasonalDelete = deleteTarget?.type === "seasonal";
  const rateTitle =
    deleteTarget?.rateItem?.name ||
    (isSeasonalDelete ? "Seasonal Rate" : "Discount Rate");

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
            endingSeasonalId={
              isDeleting && isSeasonalDelete ? deleteTarget?.rateItem?.id : null
            }
            onOpenDiscount={handleOpenDiscount}
            onEndDiscount={handleEndDiscountRate}
            endingDiscountId={
              isDeleting && !isSeasonalDelete
                ? deleteTarget?.rateItem?.id
                : null
            }
            onOpenExtraBed={handleOpenExtraBed}
          />
        ))}
      </div>

      {/* Regular Price Modal */}
      <RoomRangeModal
        opened={modalOpened}
        onClose={handleCloseModal}
        initialData={modalInitialData}
        onSubmit={handleModalSubmit}
        isLoading={isSubmitting}
      />

      {/* Seasonal Rate Modal */}
      <SeasonalRoomRangeModal
        opened={seasonalModalOpened}
        onClose={handleCloseSeasonalModal}
        initialData={seasonalInitialData}
        onSubmit={handleSeasonalModalSubmit}
        isLoading={isSeasonalSubmitting}
      />

      {/* Discount Rate Modal */}
      <DiscountRoomRateModal
        opened={discountModalOpened}
        onClose={handleCloseDiscountModal}
        initialData={discountInitialData}
        onSubmit={handleDiscountModalSubmit}
        isLoading={isDiscountSubmitting}
      />

      {/* Extra Bed Rate Modal */}
      {/* <ExtraBedRateModal
        opened={extraBedModalOpened}
        onClose={handleCloseExtraBedModal}
        initialData={extraBedInitialData}
        onSubmit={handleExtraBedModalSubmit}
        isLoading={isExtraBedSubmitting}
      /> */}

      {/* Delete / End Confirm Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`End ${rateTitle} ?`}
        description={`Are you sure you want to end this ${
          isSeasonalDelete ? "seasonal rate" : "discount rate"
        }${
          deleteTarget?.roomItem?.name
            ? ` for ${deleteTarget.roomItem.name}`
            : ""
        }? This action cannot be undone.`}
      />
    </div>
  );
};

export default RoomPriceList;
