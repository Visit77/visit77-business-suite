import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getMealPlan, mealPlanSelector } from "../service/mealPlanSlice";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { MEAL_SECTIONS } from "../utils/utils";

const MealPlanList = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const {
    data: mealPlansData = [],
    isPending: mealPlanPending,
    packageMeal = [],
  } = useSelector(mealPlanSelector);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getMealPlan({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch]);

  const groupedMealPlans = useMemo(() => {
    const groups = {
      default_breakfast: [],
      other_breakfast: [],
      lunch: [],
      dinner: [],
      other_meal: [],
      drinks: [],
    };

    mealPlansData.forEach((item) => {
      const mealType = item.included_meals?.[0];

      if (mealType === "breakfast") {
        if (item.is_default_for_room_type_breakfast) {
          groups.default_breakfast.push(item);
        } else {
          groups.other_breakfast.push(item);
        }
      } else if (mealType === "lunch") {
        groups.lunch.push(item);
      } else if (mealType === "dinner") {
        groups.dinner.push(item);
      } else if (mealType === "drinks") {
        groups.drinks.push(item);
      } else {
        groups.other_meal.push(item);
      }
    });

    return groups;
  }, [mealPlansData]);

  const getServiceDuration = (item) => {
    const mealType = item.included_meals?.[0];
    const window = item.meal_windows?.[mealType];
    return window ? `${window.start} to ${window.end}` : "-";
  };
  const navigate = useNavigate();

  return (
    <>
      {/* Grouped Meal Items Loop */}
      <div className="space-y-6!">
        {MEAL_SECTIONS.map((section) => {
          const items = groupedMealPlans[section.key] || [];

          return (
            <div key={section.key} className="w-full!">
              <h3
                onClick={() => {
                  if (items?.length === 0) {
                    navigate("/meal-plan/create/", {
                      state: {
                        included_meals: section.key,
                      },
                    });
                  }
                }}
                className={`text-base! font-bold! text-gray-900! mb-2! ${
                  items?.length === 0
                    ? "bg-neutral-100! rounded-md! p-3! cursor-pointer! hover:bg-neutral-200! transition-colors!"
                    : ""
                }`}
              >
                {section.title}
              </h3>

              {items.length > 0 ? (
                <div className="space-y-3!">
                  {items.map((item) => {
                    const duration = getServiceDuration(item);
                    const isDefaultBreakfast =
                      item.is_default_for_room_type_breakfast;

                    return (
                      <Card
                        key={item.id}
                        className="border! border-gray-200! rounded-xl! shadow-sm! bg-white! transition-all!"
                      >
                        <div className="flex! justify-between! items-start!">
                          <div className="space-y-1!">
                            {/* Meal Name */}
                            <p className="font-bold! text-gray-900! text-base! m-0!">
                              - {item.name}
                            </p>

                            {/* Price Info */}
                            <p className="text-gray-600! text-sm! m-0!">
                              - Local — {item.local_base_currency}{" "}
                              {item.local_base_price}, Foreigner — USD{" "}
                              {item.foreign_usd_display_price}
                            </p>

                            {/* Service Duration */}
                            <p className="text-gray-600! text-sm! m-0!">
                              - Service Duration — {duration}
                            </p>

                            {/* Description (If exists) */}
                            {item.description && (
                              <p className="text-gray-500! text-sm! m-0!">
                                - ({item.description})
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex! items-center! gap-3!">
                            <button className="text-indigo-900! hover:text-indigo-700! bg-transparent! border-0! cursor-pointer! text-base!">
                              <EditOutlined />
                            </button>

                            {!isDefaultBreakfast && (
                              <button className="text-red-500! hover:text-red-700! bg-transparent! border-0! cursor-pointer! text-base!">
                                <DeleteOutlined />
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <div className="mt-6!">
        <Button
          type="outline"
          icon={<PlusOutlined />}
          className="w-full! h-12! rounded-xl! border-indigo-200! text-indigo-900! font-semibold! hover:border-indigo-400! hover:text-indigo-700!"
        >
          Add Other Meal Plan
        </Button>
      </div>
    </>
  );
};

export default MealPlanList;
