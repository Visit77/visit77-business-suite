import React, { useState } from "react";
import { Radio, Checkbox, Button } from "antd";

const BookingSummary = ({ data, formData, onNext, onBack }) => {
  const [smokingPref, setSmokingPref] = useState("non-smoking");
  const [bedPref, setBedPref] = useState("large");
  const [selectedMealPlans, setSelectedMealPlans] = useState([]);

  // Room Total calculation (နမူနာ)
  const roomTotal = 288000;
  const breakfastTotal = 0;
  const mealPlanTotal = selectedMealPlans.includes("default") ? 200000 : 0;
  const grandTotal = roomTotal + breakfastTotal + mealPlanTotal;

  const handleContinue = () => {
    onNext({
      smokingPref,
      bedPref,
      selectedMealPlans,
      roomTotal,
      breakfastTotal,
      mealPlanTotal,
      grandTotal,
    });
  };

  return (
    <div className="px-4 pb-10 space-y-4">
      <h2 className="text-base font-bold text-neutral-800 my-2">
        Booking Summary
      </h2>

      {/* Preference Section */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-neutral-700">Preference</h3>
        <div>
          <p className="text-[11px] text-neutral-500 mb-1">
            Smoking Preference
          </p>
          <Radio.Group
            onChange={(e) => setSmokingPref(e.target.value)}
            value={smokingPref}
            className="flex flex-col space-y-2"
          >
            <Radio value="non-smoking" className="text-xs">
              Non-smoking Room
            </Radio>
            <Radio value="smoking" className="text-xs">
              Smoking Room
            </Radio>
          </Radio.Group>
        </div>
        <div className="border-t border-neutral-100 pt-2">
          <p className="text-[11px] text-neutral-500 mb-1">Bed Preference</p>
          <Radio.Group
            onChange={(e) => setBedPref(e.target.value)}
            value={bedPref}
            className="flex flex-col space-y-2"
          >
            <Radio value="large" className="text-xs">
              Large Bed
            </Radio>
            <Radio value="twin" className="text-xs">
              Twin Bed
            </Radio>
          </Radio.Group>
        </div>
      </div>

      {/* Guest Info */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-neutral-700 mb-2">Guest Info</h3>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Name</span>
          <span className="font-semibold">
            {formData?.guests?.[0]?.name || "N/A"}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Phone</span>
          <span className="font-semibold">
            {formData?.guests?.[0]?.phone || "N/A"}
          </span>
        </div>
        <div className="flex justify-between text-xs border-t border-neutral-100 pt-2">
          <span className="text-neutral-500">Market</span>
          <span className="font-semibold uppercase">
            {formData?.guest_market || "LOCAL"}
          </span>
        </div>
      </div>

      {/* Room Info */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-neutral-700 mb-2">Room Info</h3>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Room Type</span>
          <span className="font-semibold">
            {data?.core_snapshot?.room_type?.name || "yyy"}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Check-in</span>
          <span className="font-semibold">
            {formData?.check_in?.format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Check-out</span>
          <span className="font-semibold">
            {formData?.check_out?.format("YYYY-MM-DD")}
          </span>
        </div>
      </div>

      {/* Total Charges */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-neutral-700 mb-2">
          Total Charges
        </h3>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Room Total</span>
          <span>MMK {roomTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">Breakfast Total</span>
          <span>MMK {breakfastTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs font-bold text-indigo-600 border-t border-neutral-100 pt-2">
          <span>Total Amount</span>
          <span>MMK {grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Meal Plans */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-neutral-700">Meal Plans</h3>
        <div className="border border-neutral-200 rounded-xl p-3 flex justify-between items-start">
          <Checkbox
            onChange={(e) => {
              if (e.target.checked)
                setSelectedMealPlans([...selectedMealPlans, "default"]);
              else
                setSelectedMealPlans(
                  selectedMealPlans.filter((p) => p !== "default"),
                );
            }}
          >
            <div>
              <p className="text-xs font-bold">default</p>
              <p className="text-[10px] text-neutral-400">
                - Service Duration - 06:30 to 10:00
              </p>
            </div>
          </Checkbox>
          <span className="text-xs font-bold text-indigo-600">MMK 200,000</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          onClick={onBack}
          className="h-11 rounded-xl bg-neutral-200 font-bold text-xs"
        >
          Back
        </Button>
        <Button
          type="primary"
          onClick={handleContinue}
          className="h-11 rounded-xl bg-indigo-600 font-bold text-xs"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;
