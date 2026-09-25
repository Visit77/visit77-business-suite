import React from "react";

export const InvoiceTable = ({ booking }) => {
  return (
    <>
      <div className=" pb-2 border-b border-neutral-100">
        <h3 className="text-lg font-extrabold text-neutral-900">
          {booking?.hotel_name}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
        <span className="text-neutral-500">Invoice ID</span>
        <span className="">: {booking?.reservation_code}</span>

        <span className="text-neutral-500">Guest Name</span>
        <span className="">: {booking?.guests?.[0]?.name}</span>

        <span className="text-neutral-500">Contact Number</span>
        <span className="">: {booking?.guests?.[0]?.phone}</span>

        <span className="text-neutral-500">Check-in</span>
        <span className="">: {booking?.check_in}</span>

        <span className="text-neutral-500">Check-out</span>
        <span className="">: {booking?.check_out}</span>
      </div>

      <div className="pt-3 border-t border-dashed border-neutral-200">
        <h4 className="text-xs font-bold text-neutral-800 mb-2">
          Room Charges
        </h4>
        <div className="flex justify-between text-xs">
          <span>
            {booking?.rooms?.map((room) => {
              return (
                <>
                  {room?.room_type_name}x{room?.quantity} &nbsp;
                  {booking?.nights} Night
                </>
              );
            })}
          </span>
          <span>MMK {booking?.room_charge_total?.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-dashed border-neutral-200">
        <h4 className="text-xs font-bold text-neutral-800 mb-2">Room Total</h4>
        <div className="flex justify-between text-xs">
          <span>MMK {booking?.room_total?.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-200 flex justify-between text-xs font-extrabold text-indigo-600">
        <span>Grand Total</span>
        <span>MMK {booking?.grand_total?.toLocaleString()}</span>
      </div>
    </>
  );
};
