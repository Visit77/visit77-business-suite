import React, { useState, useEffect, useMemo } from "react";
import { Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateMealPlan,
  getOneMealPlan,
  mealPlanSelector,
} from "../service/mealPlanSlice";
import _ from "lodash";
import MealPlanPackageForm from "../components/form/MealPlanPackageForm";

const EditMealPlanPackage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const businessId = useSelector(selectBusinessId);

  const [selectedMeals, setSelectedMeals] = useState([]);

  useEffect(() => {
    if (businessId && id) {
      dispatch(
        getOneMealPlan({
          id: id,
        }),
      );
    }
  }, [businessId, dispatch, id]);

  const { details: planPackageData, isPending: mealPlanPending } =
    useSelector(mealPlanSelector);

  useEffect(() => {
    if (planPackageData) {
      if (
        planPackageData?.components &&
        planPackageData.components.length > 0
      ) {
        setSelectedMeals(planPackageData.components);
      }

      const isCustomPrice =
        planPackageData?.package_pricing_mode === "custom_price";

      form.setFieldsValue({
        isSetNewPrice: isCustomPrice,
        local: {
          local_base_price: planPackageData?.local_base_price || 0,
          local_usd_display_price:
            planPackageData?.local_usd_display_price || 0,
        },
        foreigner: {
          foreign_base_price: planPackageData?.foreign_base_price || 0,
          foreign_usd_display_price:
            planPackageData?.foreign_usd_display_price || 0,
        },
      });
    }
  }, [planPackageData, form]);

  const handleMealCheck = (mealObj, checked) => {
    if (checked) {
      setSelectedMeals((prev) => [...prev, mealObj]);
    } else {
      setSelectedMeals((prev) => prev.filter((item) => item.id !== mealObj.id));
    }
  };

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
      id: planPackageData?.id || id,
      name: planPackageData?.name,
      business_id: businessId,
      included_meals: selectedMeals?.map((meal) => {
        return meal?.included_meals
          ? meal.included_meals[0]
          : meal.name.toLowerCase();
      }),
      ...price,
      meal_windows: meal_windows,
      is_default_for_room_type_breakfast:
        planPackageData?.is_default_for_room_type_breakfast || false,
      foreign_base_currency: "MMK",
      local_base_currency: "MMK",
      availability: planPackageData?.availability || "guest_only",
      plan_type: "package",
      is_active: planPackageData?.is_active ?? true,
      component_meal_plan_ids: selectedMeals?.map((meal) => meal?.id),
    };

    dispatch(
      updateMealPlan({
        id: planPackageData?.id || id,
        data: formattedValues,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Meal Plan Package updated successfully.");
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
        packageName={planPackageData?.name}
      />
    </div>
  );
};

export default EditMealPlanPackage;
