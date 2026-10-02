import React from "react";
import MealPlanForm from "../components/form/MealPlanForm";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { createMealPlan } from "../service/mealPlanSlice";
import _ from "lodash";
import { convertTo24Hour } from "../utils/utils";

const CreateMealPlan = () => {
  const businessId = useSelector(selectBusinessId);
  const location = useLocation();
  const { included_meals } = location?.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      business_id: businessId,
      included_meals: [`${included_meals}`],
      is_default_for_room_type_breakfast: false,
      foreign_base_currency: "MMK",
      local_base_currency: "MMK",
      meal_windows: {
        [included_meals]: {
          start: convertTo24Hour(values.serviceStartTime.format("hh:mm A")),
          end: convertTo24Hour(values.serviceEndTime.format("hh:mm A")),
        },
      },
    };
    dispatch(
      createMealPlan({
        data: formattedValues,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Meal Plan create Successful.");
        navigate(-1);
      }
    });
  };

  return (
    <div>
      <MealPlanForm handleFinish={handleFinish} />
    </div>
  );
};

export default CreateMealPlan;
