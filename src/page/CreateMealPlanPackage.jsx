import React, { useState, useMemo } from "react";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { createMealPlan } from "../service/mealPlanSlice";
import _ from "lodash";
import MealPlanPackageForm from "../components/form/MealPlanPackageForm";

const CreateMealPlanPackage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const businessId = useSelector(selectBusinessId);
  const { included_meals } = location?.state || {};

  const [selectedMeals, setSelectedMeals] = useState([]);

  const handleMealCheck = (mealObj, checked) => {
    if (checked) {
      setSelectedMeals((prev) => [...prev, mealObj]);
    } else {
      setSelectedMeals((prev) => prev.filter((item) => item.id !== mealObj.id));
    }
  };

  // Dynamic Total Calculation
  const calculatedTotals = useMemo(() => {
    return selectedMeals.reduce(
      (totals, meal) => {
        totals.local_base_price += Number(meal.local_base_price || 0);
        totals.local_usd_display_price += Number(
          meal.local_usd_display_price || 0,
        );
        totals.foreign_base_price += Number(meal.foreign_base_price || 0);
        totals.foreign_usd_display_price += Number(
          meal.foreign_usd_display_price || 0,
        );
        return totals;
      },
      {
        local_base_price: 0,
        local_usd_display_price: 0,
        foreign_base_price: 0,
        foreign_usd_display_price: 0,
      },
    );
  }, [selectedMeals]);

  const handleFinish = (values) => {
    const formData = {
      ...values,
    };
    const meal_windows = selectedMeals?.reduce((acc, meal) => {
      if (meal?.meal_windows) {
        return { ...acc, ...meal.meal_windows };
      }
      return acc;
    }, {});

    let price;
    if (values?.isSetNewPrice) {
      price = {
        ...values?.local,
        ...values?.foreigner,
        package_pricing_mode: "custom_price",
      };
    } else {
      price = {
        ...calculatedTotals,
        package_pricing_mode: "sum_default_prices",
      };
    }

    const formattedValues = {
      ...formData,
      name: included_meals,
      business_id: businessId,
      included_meals: selectedMeals?.map((meal) => {
        return meal?.included_meals[0];
      }),
      ...price,
      meal_windows: meal_windows,
      is_default_for_room_type_breakfast: false,
      foreign_base_currency: "MMK",
      local_base_currency: "MMK",
      availability: "guest_only",
      plan_type: "package",
      is_active: true,
      component_meal_plan_ids: selectedMeals?.map((meal) => {
        return meal?.id;
      }),
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

  const handleCancel = () => {
    form.resetFields();
    setSelectedMeals([]);
    navigate(-1);
  };

  return (
    <div>
      <MealPlanPackageForm
        form={form}
        handleFinish={handleFinish}
        handleCancel={handleCancel}
        selectedMeals={selectedMeals}
        handleMealCheck={handleMealCheck}
        calculatedTotals={calculatedTotals}
      />
    </div>
  );
};

export default CreateMealPlanPackage;
