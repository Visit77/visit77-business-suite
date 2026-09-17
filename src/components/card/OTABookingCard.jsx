import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Calendar01Icon,
  Moon02Icon,
  UserGroupIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import moment from "moment";

export const OTABookingCard = ({ booking }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top Banner */}
      <div className="bg-amber-100/70 px-5 py-3 flex items-center justify-between">
        <div className="font-bold text-slate-800">
          {booking?.room_number}{" "}
          <span className="font-normal text-slate-500">
            ({booking?.room_type_name})
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {moment(booking?.created_at).format("LT")}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 space-y-4">
        {/* Pricing */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-lg font-bold text-blue-600">
              {booking?.currency}
              {booking?.price_per_night}
            </span>
            <span className="text-xs text-slate-500"> / Night</span>
            <div className="text-xs text-slate-400 mt-0.5">
              {booking?.bed_type?.name}
              {booking?.room_views && booking?.room_views.length > 0 && (
                <>
                  {booking?.room_views.map((view, index) => (
                    <span key={view?.id || index}>
                      {" • "} {view?.name}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
          </button>
        </div>

        {/* Guest and Invoice Details */}
        <div className="space-y-2 text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            {booking?.booking_code}
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <HugeiconsIcon
              icon={UserIcon}
              size={16}
              className="text-slate-400"
            />
            <span className="font-medium">{booking?.guest?.name}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={16}
                className="text-slate-400"
              />
              <span>{booking?.check_in}</span> -{" "}
              <span>{booking?.check_out}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Moon02Icon}
                size={16}
                className="text-slate-400"
              />
              <span>{booking?.nights}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={16}
                className="text-slate-400"
              />
              <span>{booking?.guest?.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
