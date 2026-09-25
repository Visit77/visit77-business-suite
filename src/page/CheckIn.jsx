import React, { useEffect } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import moment from "moment";
import PageLoading from "../components/PageLoading";
import CheckInForm from "../components/checkIn/CheckInForm";
import BookingSummary from "../components/checkIn/BookingSummary";
import InvoiceStep from "../components/checkIn/InvoiceStep";
import {
  bookingSelector,
  clearBookingDetails,
  getBookingDetails,
} from "../service/bookingSlice";
import Receipt from "../components/checkIn/Receipt";
import {
  getCheckInSession,
  saveCheckInSession,
} from "../utils/checkInPersistence";

const parseStep = (value) => {
  const step = Number(value);
  return step >= 1 && step <= 4 ? step : null;
};

const CheckIn = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { details: roomData, isPending } = useSelector(roomBoardSelector);
  const { details: booking, isPending: isBookingPending } =
    useSelector(bookingSelector);

  const persisted = getCheckInSession(id);
  const urlBookingId = searchParams.get("booking_id");
  const roomMatches = String(roomData?.id) === String(id);
  const booking_id =
    urlBookingId ||
    location.state?.booking_id ||
    (parseStep(searchParams.get("step")) > 1 ? persisted?.bookingId : null) ||
    (roomMatches ? roomData?.current_booking?.id : null) ||
    null;
  const currentStep =
    parseStep(searchParams.get("step")) || persisted?.step || 1;
  const activeBooking =
    booking_id && String(booking?.id) === String(booking_id) ? booking : {};

  const syncCheckInUrl = (step, nextBookingId = booking_id) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("step", String(step));
        if (nextBookingId) {
          next.set("booking_id", String(nextBookingId));
        }
        return next;
      },
      { replace: true },
    );
    saveCheckInSession(id, {
      step,
      ...(nextBookingId ? { bookingId: nextBookingId } : {}),
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    const urlStep = searchParams.get("step");
    const currentUrlBookingId = searchParams.get("booking_id");
    if (
      parseStep(urlStep) === currentStep &&
      String(currentUrlBookingId || "") === String(booking_id || "")
    ) {
      return;
    }
    syncCheckInUrl(currentStep, booking_id);
  }, [id, currentStep, booking_id]);

  useEffect(() => {
    if (!businessId) return;
    dispatch(
      getOneRoom({
        business_id: businessId,
        date: moment().format("YYYY-MM-DD"),
        id: id,
      }),
    );
  }, [id, businessId, dispatch]);

  useEffect(() => {
    if (!booking_id) {
      dispatch(clearBookingDetails());
      return;
    }
    if (!businessId) return;
    if (String(booking?.id) === String(booking_id)) return;
    dispatch(getBookingDetails({ business_id: businessId, booking_id }));
  }, [id, businessId, booking_id, dispatch]);

  if (
    isPending ||
    !roomMatches ||
    (booking_id &&
      isBookingPending &&
      String(booking?.id) !== String(booking_id))
  ) {
    return <PageLoading message="Loading room data..." />;
  }

  const handleStep1Next = (nextBookingId) => {
    syncCheckInUrl(2, nextBookingId || booking_id);
  };

  const handleStep2Next = () => {
    syncCheckInUrl(3, booking_id);
  };

  const handleStep3Next = () => {
    syncCheckInUrl(4, booking_id);
  };

  const handleBack = () => {
    syncCheckInUrl(Math.max(1, currentStep - 1), booking_id);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {currentStep === 1 && (
        <CheckInForm
          data={roomData}
          onNext={handleStep1Next}
          initialValues={activeBooking}
        />
      )}

      {currentStep === 2 && (
        <BookingSummary
          booking={activeBooking}
          onNext={handleStep2Next}
          onBack={handleBack}
          guest_market={activeBooking?.guest_market}
        />
      )}

      {currentStep === 3 && (
        <InvoiceStep
          booking={activeBooking}
          onBack={handleBack}
          onNext={handleStep3Next}
        />
      )}

      {currentStep === 4 && <Receipt booking={activeBooking} />}
    </div>
  );
};

export default CheckIn;
