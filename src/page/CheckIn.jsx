import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import moment from "moment";
import PageLoading from "../components/PageLoading";
import CheckInForm from "../components/checkIn/CheckInForm";
import BookingSummary from "../components/checkIn/BookingSummary";
import InvoiceStep from "../components/checkIn/InvoiceStep";

const CheckIn = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { details: roomData, isPending } = useSelector(roomBoardSelector);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentStep]);

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

  // Step Next/Prev Handlers
  const handleStep1Next = (values) => {
    setFormData(values);
    setCurrentStep(2);
  };

  const handleStep2Next = (data) => {
    setSummaryData(data);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {/* Steps Progress Indicator */}
      {/* <div className="flex items-center justify-between p-4 bg-neutral-50 border-b border-neutral-100 mb-2">
        <div
          className={`text-xs font-bold ${currentStep === 1 ? "text-indigo-600" : "text-neutral-400"}`}
        >
          1. Form
        </div>
        <div className="text-neutral-300">&gt;</div>
        <div
          className={`text-xs font-bold ${currentStep === 2 ? "text-indigo-600" : "text-neutral-400"}`}
        >
          2. Summary
        </div>
        <div className="text-neutral-300">&gt;</div>
        <div
          className={`text-xs font-bold ${currentStep === 3 ? "text-indigo-600" : "text-neutral-400"}`}
        >
          3. Invoice
        </div>
      </div> */}

      {currentStep === 1 && (
        <CheckInForm data={roomData} onNext={handleStep1Next} />
      )}

      {currentStep === 2 && (
        <BookingSummary
          data={roomData}
          formData={formData}
          onNext={handleStep2Next}
          onBack={handleBack}
        />
      )}
          
      {currentStep === 3 && (
        <InvoiceStep
          data={roomData}
          formData={formData}
          summaryData={summaryData}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CheckIn;
