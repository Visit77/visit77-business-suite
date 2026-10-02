import React, { useEffect } from "react";
import MealPlanForm from "../components/form/MealPlanForm";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getOneMealPlan,
  mealPlanSelector,
  updateMealPlan,
} from "../service/mealPlanSlice";
import _ from "lodash";
import { convertTo24Hour, parseTimeString } from "../utils/utils";

const EditMealPlan = () => {
  const businessId = useSelector(selectBusinessId);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { included_meals } = location?.state || {};

  useEffect(() => {
    if (businessId && id) {
      dispatch(
        getOneMealPlan({
          id: id,
        }),
      );
    }
  }, [businessId, dispatch, id]);

  const { details: mealPlanData, isPending: mealPlanPending } =
    useSelector(mealPlanSelector);

  const initialValues = {
    name: mealPlanData?.name || "",
    serviceStartTime: parseTimeString(
      mealPlanData?.meal_windows?.[included_meals]?.start || "06:30 AM",
    ),
    serviceEndTime: parseTimeString(
      mealPlanData?.meal_windows?.[included_meals]?.end,
      "10:00 AM",
    ),
    local_base_price: mealPlanData?.local_base_price || "",
    local_usd_display_price: mealPlanData?.local_usd_display_price || "",
    foreign_base_price: mealPlanData?.foreign_base_price || "",
    foreign_usd_display_price: mealPlanData?.foreign_usd_display_price || "",
    description: mealPlanData?.description || "",
  };

  const handleFinish = (values) => {
    const mealType = included_meals || mealPlanData?.included_meals?.[0];

    const formattedValues = {
      ...values,
      id: mealPlanData?.id,
      business_id: businessId,
      included_meals: mealPlanData?.included_meals || [`${mealType}`],
      is_default_for_room_type_breakfast:
        mealPlanData?.is_default_for_room_type_breakfast ?? false,
      foreign_base_currency: mealPlanData?.foreign_base_currency || "MMK",
      local_base_currency: mealPlanData?.local_base_currency || "MMK",
      meal_windows: {
        [mealType]: {
          start: convertTo24Hour(values.serviceStartTime.format("hh:mm A")),
          end: convertTo24Hour(values.serviceEndTime.format("hh:mm A")),
        },
      },
    };

    dispatch(
      updateMealPlan({
        id: mealPlanData?.id,
        data: formattedValues,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Meal Plan updated successfully.");
        navigate(-1);
      }
    });
  };

  return (
    <div>
      <MealPlanForm
        handleFinish={handleFinish}
        initialValues={initialValues}
        isEdit={true}
      />
    </div>
  );
};

export default EditMealPlan;
