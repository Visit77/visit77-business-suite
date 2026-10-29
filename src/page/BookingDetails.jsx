import React, { useEffect } from "react";
import { Tag, Avatar } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Download02Icon } from "@hugeicons/core-free-icons";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getBookingDetails, bookingSelector } from "../service/bookingSlice";
import PageLoading from "../components/PageLoading";

const BookingDetails = () => {
  const bookingData = {
    roomNumber: "#G004",
    status: "CHECKED_OUT",
    guestName: "UN",
    pricing: {
      local: "MMK 50,000",
      foreigner: "USD 25",
    },
    bookingId: "V77-HTL-26-000063",
    checkIn: "14 Oct 2026",
    checkOut: "15 Oct 2026",
    nights: 1,
    roomType: "Just Room",
    occupancy: "2 Adult • 0 Children",
    payment: {
      roomTotal: "MMK 50,000",
      paidAt: "14 Oct 2026, 09:37 AM",
      method: "AYA",
      status: "PAID",
    },
    specialRequest: "No special request",
  };
  const location = useLocation();
  const { values } = location?.state || {};

  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(
      getBookingDetails({
        business_id: businessId,
        booking_id: id,
      }),
    );
  }, [businessId, dispatch]);

  const { details, isPending } = useSelector(bookingSelector);
  const handleDownload = () => {
    const pdfUrl = details?.invoices?.[0]?.invoice_pdf_url;

    if (pdfUrl) {
      window.open(`${pdfUrl}`, "_blank");
    } else {
      message.warning("Invoice PDF မရှိပါ။");
    }
  };

  if (isPending) {
    return <PageLoading />;
  }
  return (
    <>
      {/* Main Container */}
      <div className="space-y-4">
        {/* Top Header Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 m-0">
              #{values.room_number}
            </h2>
            <Tag
              color="orange"
              className="font-semibold uppercase rounded-full px-3 py-0.5 border-none bg-orange-100 text-orange-600"
            >
              {values.booking_status}
            </Tag>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-sm">
            <div>
              <span className="text-gray-400 block text-xs">Local Guest</span>
              <span className="font-bold text-blue-700">
                MMK {details?.rooms?.[0]?.rate_plan?.base_price}&nbsp;
              </span>
              <span className="text-gray-400 text-xs"> / Night</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-xs">
                Foreigner Guest
              </span>
              <span className="font-bold text-blue-700">
                USD {details?.rooms?.[0]?.rate_plan?.usd_display_price}
              </span>
              <span className="text-gray-400 text-xs"> / Night</span>
            </div>
          </div>
        </div>

        {/* Booking ID & Dates Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <div className="text-sm font-bold text-gray-800">
            Booking ID:{" "}
            <span className="text-gray-600 font-medium">
              {details.booking_code}
            </span>
          </div>

          <div className="bg-neutral-50 p-3 rounded-lg flex items-center justify-between border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block mb-1">Check-in</span>
              <span className="font-semibold text-gray-800 text-sm">
                {details.check_in}
              </span>
            </div>

            <div className="flex items-center text-gray-400 px-2">
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-1">
                Check-out
              </span>
              <span className="font-semibold text-gray-800 text-sm">
                {details.check_out}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block mb-1">Nights</span>
              <span className="font-semibold text-gray-800 text-sm">
                {details.nights}
              </span>
            </div>
          </div>
        </div>

        {/* Room Info Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <Avatar
            size={48}
            className="bg-blue-100 text-blue-600 font-bold shrink-0"
          >
            {details?.guests[0]?.name}
          </Avatar>
          <div className="ml-3">
            <h4 className="font-bold text-gray-800 text-base m-0">
              {details?.guests[0]?.name}
            </h4>
            <span className="text-xs text-gray-500 font-medium">
              {details.total_adults}&nbsp; Adult • {details.total_children}{" "}
              Children
            </span>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase m-0">
            PAYMENT
          </h3>

          <div className="space-y-2 text-sm pt-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Room Total:</span>
              <span className="font-bold text-gray-800">
                {details?.room_total}&nbsp;
                {details?.currency}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment at:</span>
              <span className="text-gray-700">
                {details.payments?.[0]?.created_at}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium text-gray-800 uppercase">
                {details.payments?.[0]?.provider}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Status:</span>
              <Tag
                color="green"
                className="font-bold uppercase rounded-full px-3 border-none bg-emerald-500 text-white m-0"
              >
                {details.payments?.[0]?.status}
              </Tag>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer"
            >
              <HugeiconsIcon icon={Download02Icon} size={18} />

              <span className="underline">Download Invoice</span>
            </button>
          </div>
        </div>

        {/* Special Request Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-1">
          <h3 className="text-sm font-bold text-gray-800 m-0">
            Special Request
          </h3>
          <p className="text-sm text-gray-500 mt-4">
            {details?.special_request
              ? details?.special_request
              : "No special request"}
          </p>
        </div>
      </div>
    </>
  );
};

export default BookingDetails;
