import React, { useEffect, useState } from "react";
import { Radio, Checkbox, Button, message } from "antd";
import { bookingSelector, getBookingDetails } from "../../service/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import PageLoading from "../PageLoading";
import {
  getMealPlan,
  getMealPlanForPackage,
  mealPlanSelector,
} from "../../service/mealPlanSlice";
import { updateCheckInInfo } from "../../service/actionSlice";
import _ from "lodash";

const BookingSummary = ({ booking, onNext, onBack, guest_market }) => {
  const [smokingPref, setSmokingPref] = useState("non_smoking");
  const [bedPref, setBedPref] = useState("large_bed");

  // Selection states
  const [selectedMealPlans, setSelectedMealPlans] = useState([]);
  const [selectedMealPackage, setSelectedMealPackage] = useState(null);

  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const { details: bookingData, isPending } = useSelector(bookingSelector);
  const {
    data: mealPlansData = [],
    isPending: mealPlanPending,
    packageMeal = [],
  } = useSelector(mealPlanSelector);

  const guestInfo = bookingData?.guests?.[0];

  // Disable conditions
  const isMealPlanDisabled = Boolean(selectedMealPackage);
  const isMealPackageDisabled = selectedMealPlans.length > 0;

  // Calculate Meal Total Price dynamically
  const selectedPlansTotal = (mealPlansData || [])
    .filter((plan) => selectedMealPlans.includes(plan.id))
    .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const selectedPkg = (packageMeal || []).find(
    (pkg) => pkg.id === selectedMealPackage,
  );
  const packageTotal = selectedPkg ? Number(selectedPkg.price || 0) : 0;

  const mealPlanTotal = selectedPlansTotal + packageTotal;

  const roomTotal = 288000;
  const breakfastTotal = 0;
  const grandTotal = roomTotal + breakfastTotal + mealPlanTotal;

  useEffect(() => {
    if (businessId) {
      dispatch(
        getMealPlan({
          business_id: businessId,
          guest_market: guest_market,
          plan_type: "single",
          core_active: true,
        }),
      );
      dispatch(
        getMealPlanForPackage({
          business_id: businessId,
          guest_market: guest_market,
          core_active: true,
        }),
      );
    }
  }, [businessId, guest_market, dispatch]);

  const handleMealPlanChange = (planId, checked) => {
    if (checked) {
      setSelectedMealPlans((prev) => [...prev, planId]);
    } else {
      setSelectedMealPlans((prev) => prev.filter((id) => id !== planId));
    }
  };

  const handlePackageChange = (e) => {
    setSelectedMealPackage(e.target.value);
  };

  const handleContinue = () => {
    const formData = new FormData();

    booking?.rooms.forEach((room, index) => {
      const ratePlanId = room?.room_type?.rate_plans?.find(
        (plan) => plan?.guest_market === values?.guest_market,
      )?.id;
      formData.append(
        `rooms[${index}][physical_room_id]`,
        room.assigned_physical_rooms?.[0]?.id || room?.id,
      );
      formData.append(
        `rooms[${index}][rate_plan_id]`,
        room?.rate_plan_id || ratePlanId,
      );

      formData.append(`rooms[${index}][extra_beds]`, room?.extra_bed || 0);

      formData.append(
        `rooms[${index}][preferences][preference_standard]`,
        bedPref,
      );
      formData.append(
        `rooms[${index}][preferences][smoking_type]`,
        smokingPref,
      );

      if (selectedMealPlans) {
        formData.append(
          `rooms[${index}][meal_plan_ids]`,
          JSON.stringify(selectedMealPlans),
        );
      } else {
        formData.append(
          `rooms[${index}][meal_plan_ids]`,
          JSON.stringify([selectedMealPackage]),
        );
      }

      formData.append(
        `rooms[${index}][breakfast_selected]`,
        room?.breakfast_selected,
      );
    });

    dispatch(
      updateCheckInInfo({
        business_id: businessId,
        booking_id: booking?.id,
        data: formData,
      }),
    )
      .then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          dispatch(
            getBookingDetails({
              business_id: businessId,
              booking_id: res?.payload?.data?.booking?.id,
            }),
          ).then((response) => {
            if (_.endsWith(response.type, "fulfilled")) {
              onNext();
              message.success("Success");
            } else {
              message.error("Error");
            }
          });
        }
      })
      .catch(() => message.error("Something went wrong!"))
      .finally(() => {});
  };

  if (isPending || mealPlanPending) {
    return <PageLoading message="Loading data..." />;
  }

  return (
    <div className="px-4 pb-10 space-y-4 bg-slate-50 min-h-screen">
      <h2 className="text-base font-medium text-neutral-800 my-2">
        Booking Summary
      </h2>

      {/* Preference Section */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
        <h3 className="text-xs font-medium text-neutral-700">Preference</h3>
        <div>
          <p className="text-[11px] text-neutral-500 mb-1 font-medium">
            Smoking Preference
          </p>
          <Radio.Group
            onChange={(e) => setSmokingPref(e.target.value)}
            value={smokingPref}
            className="flex flex-col space-y-2"
          >
            <Radio value="non_smoking" className="text-xs font-light">
              Non-smoking Room
            </Radio>
            <Radio value="smoking" className="text-xs font-light">
              Smoking Room
            </Radio>
          </Radio.Group>
        </div>
        <div className="border-t border-neutral-100 pt-2">
          <p className="text-[11px] text-neutral-500 mb-1 font-medium">
            Bed Preference
          </p>
          <Radio.Group
            onChange={(e) => setBedPref(e.target.value)}
            value={bedPref}
            className="flex flex-col space-y-2"
          >
            <Radio value="large_bed" className="text-xs font-light">
              Large Bed
            </Radio>
            <Radio value="twin_bed" className="text-xs font-light">
              Twin Bed
            </Radio>
          </Radio.Group>
        </div>
      </div>

      {/* Guest Info */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-medium text-neutral-700 mb-2">
          Guest Info
        </h3>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500 font-light">Name</span>
          <span className="font-semibold">{guestInfo?.name || "N/A"}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500 font-light">Phone</span>
          <span className="font-semibold">{guestInfo?.phone || "N/A"}</span>
        </div>
        <div className="flex justify-between text-xs border-t border-neutral-100 pt-2">
          <span className="text-neutral-500 font-light">Market</span>
          <span className="font-semibold uppercase">
            {bookingData?.guest_market || "LOCAL"}
          </span>
        </div>
      </div>

      {/* Room Info */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-medium text-neutral-700 mb-2">Room Info</h3>
        <div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-neutral-500 font-light">Room Type</span>
            <span className="font-semibold">
              {bookingData?.rooms
                ?.map((item) => `${item?.room_type_name}`)
                .join(" . ")}
            </span>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-neutral-500 font-light">Check-in</span>
            <span className="font-semibold">{bookingData?.check_in}</span>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-neutral-500 font-light">Check-out</span>
            <span className="font-semibold">{bookingData?.check_out}</span>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-neutral-500 font-light">Stay</span>
            <span className="font-semibold">{bookingData?.nights}</span>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-neutral-500 font-light">Room Count</span>
            <span className="font-semibold">{bookingData?.rooms?.length}</span>
          </div>
        </div>
      </div>

      {/* Total Charges */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-2">
        <h3 className="text-xs font-medium text-neutral-700 mb-2">
          Total Charges
        </h3>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500 font-light">Room Total</span>
          <span>MMK {roomTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500 font-light">Breakfast Total</span>
          <span>MMK {breakfastTotal.toLocaleString()}</span>
        </div>
        {mealPlanTotal > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500 font-light">Meal Plan Total</span>
            <span>MMK {mealPlanTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-bold text-indigo-600 border-t border-neutral-100 pt-2">
          <span className="font-medium">Total Amount</span>
          <span>MMK {grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Meal Plans Section */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Meal Plans</h3>
          <p className="text-xs text-neutral-600">
            Select one or more meal plans
          </p>
        </div>

        <div className="space-y-3">
          {(mealPlansData || []).map((plan) => (
            <div
              key={plan.id}
              className={`border border-neutral-200 rounded-2xl p-3 flex justify-between items-start ${
                isMealPlanDisabled
                  ? "opacity-50 cursor-not-allowed bg-neutral-50"
                  : ""
              }`}
            >
              <Checkbox
                disabled={isMealPlanDisabled}
                checked={selectedMealPlans.includes(plan.id)}
                onChange={(e) =>
                  handleMealPlanChange(plan.id, e.target.checked)
                }
                className="w-full flex items-start"
              >
                <div className="ml-1">
                  <p className="text-xs font-bold text-neutral-800">
                    {plan.name || plan.title}
                  </p>

                  <p className="text-[11px] text-neutral-600 font-medium">
                    - Service Duration —{" "}
                    {plan.effective_meal_windows?.breakfast && (
                      <>
                        {plan.effective_meal_windows?.breakfast?.start}-
                        {plan.effective_meal_windows?.breakfast?.end}
                      </>
                    )}
                    {plan.effective_meal_windows?.lunch && (
                      <>
                        {plan.effective_meal_windows?.lunch?.start}-
                        {plan.effective_meal_windows?.lunch?.end}
                      </>
                    )}
                    {plan.effective_meal_windows?.other_meal && (
                      <>
                        {plan.effective_meal_windows?.other_meal?.start}-
                        {plan.effective_meal_windows?.other_meal?.end}
                      </>
                    )}
                    {plan.effective_meal_windows?.other_meal && (
                      <>
                        {plan.effective_meal_windows?.other_meal?.start}-
                        {plan.effective_meal_windows?.other_meal?.end}
                      </>
                    )}
                  </p>

                  {plan.description && (
                    <p className="text-[11px] text-neutral-600 font-medium">
                      - ({plan.description})
                    </p>
                  )}
                </div>
              </Checkbox>
              <span className="text-xs font-bold text-indigo-600 whitespace-nowrap pl-2">
                MMK{" "}
                {guest_market === "local"
                  ? plan?.local_base_price
                  : plan?.foreign_base_price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Packages Section */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">
            Meal Packages
          </h3>
          <p className="text-xs text-neutral-600">Select a meal package</p>
        </div>

        <Radio.Group
          onChange={handlePackageChange}
          value={selectedMealPackage}
          disabled={isMealPackageDisabled}
          className="w-full space-y-3 flex flex-col"
        >
          {(packageMeal || []).map((pkg) => (
            <div
              key={pkg.id}
              className={`border border-neutral-200 rounded-2xl p-3 ${
                isMealPackageDisabled
                  ? "opacity-50 cursor-not-allowed bg-neutral-50"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <Radio
                  value={pkg.id}
                  className="text-xs font-bold text-neutral-800"
                >
                  {pkg.name || pkg.title}
                </Radio>
                <span className="text-xs font-bold text-indigo-600">
                  MMK{" "}
                  {guest_market === "local"
                    ? pkg?.local_base_price
                    : pkg?.foreign_base_price}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 font-medium">
                {pkg.components?.map((meal) => {
                  return (
                    <div>
                      <span className="mr-1.5 text-xs">🍽️</span>

                      {meal?.meal_windows?.breakfast && (
                        <>
                          <span className=" mr-1.5">{meal?.name}</span>(
                          {meal?.meal_windows?.breakfast?.start}&nbsp;to&nbsp;
                          {meal?.meal_windows?.breakfast?.end})
                        </>
                      )}
                      {meal?.meal_windows?.lunch && (
                        <>
                          <span className=" mr-1.5">{meal?.name}</span>(
                          {meal?.meal_windows?.lunch?.start}&nbsp;to&nbsp;
                          {meal?.meal_windows?.lunch?.end})
                        </>
                      )}
                      {meal?.meal_windows?.other_meal && (
                        <>
                          <span className=" mr-1.5">{meal?.name}</span>(
                          {meal?.meal_windows?.other_meal?.start}&nbsp;to&nbsp;
                          {meal?.meal_windows?.other_meal?.end})
                        </>
                      )}
                    </div>
                  );
                })}
              </p>
            </div>
          ))}
        </Radio.Group>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          onClick={onBack}
          className="h-11 rounded-xl bg-neutral-200 border-none font-bold text-xs"
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
