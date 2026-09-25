import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import moment from "moment";
import PageLoading from "../components/PageLoading";
import CheckInForm from "../components/checkIn/CheckInForm";
import BookingSummary from "../components/checkIn/BookingSummary";
import InvoiceStep from "../components/checkIn/InvoiceStep";
import { bookingSelector, getBookingDetails } from "../service/bookingSlice";
import Receipt from "../components/checkIn/Receipt";

const CheckIn = () => {
  const { id } = useParams();
  const location = useLocation();
  const booking_id = location.state?.booking_id;
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { details: roomData, isPending } = useSelector(roomBoardSelector);
  const { details: booking, isPending: isBookingPending } =
    useSelector(bookingSelector);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    if (!businessId) return;

    dispatch(getBookingDetails({ business_id: businessId, booking_id }));

    dispatch(
      getOneRoom({
        business_id: businessId,
        date: moment().format("YYYY-MM-DD"),
        id: id,
      }),
    );
  }, [id, businessId, booking_id, dispatch]);

  if (isPending || isBookingPending) {
    return <PageLoading message="Loading room data..." />;
  }

  const handleStep1Next = (values) => {
    setFormData(values);
    setCurrentStep(2);
  };

  const handleStep2Next = (data) => {
    setSummaryData(data);
    setCurrentStep(3);
  };
  const handleStep3Next = (data) => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {currentStep === 1 && (
        <CheckInForm
          data={roomData}
          onNext={handleStep1Next}
          initialValues={booking}
        />
      )}

      {currentStep === 2 && (
        <BookingSummary
          booking={booking}
          onNext={handleStep2Next}
          onBack={handleBack}
          guest_market={booking?.guest_market}
        />
      )}

      {currentStep === 3 && (
        <InvoiceStep
          booking={booking}
          onBack={handleBack}
          onNext={handleStep3Next}
        />
      )}

      {currentStep === 4 && <Receipt booking={booking} />}
    </div>
  );
};

export default CheckIn;
