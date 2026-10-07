import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  deleteMealPlan,
  getMealPlan,
  getMealPlanForPackage,
  mealPlanSelector,
} from "../service/mealPlanSlice";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { MEAL_PLAN_PACKAGE_SECTIONS, MEAL_SECTIONS } from "../utils/utils";
import DeleteConfirmModal from "../components/modal/DeleteConfirmModal";
import _ from "lodash";

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
      dispatch(
        getMealPlanForPackage({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch]);

  const groupedMealPlans = useMemo(() => {
    const groups = {
      default_breakfast: [],
      breakfast: [],
      lunch: [],
      dinner: [],
      other_meal: [],
      drinks: [],
    };

    mealPlansData.forEach((item) => {
      const mealType = item.included_meals?.[0];

      if (mealType === "breakfast") {
        if (item.is_default_for_room_type_breakfast == true) {
          groups.default_breakfast.push(item);
        } else {
          groups.breakfast.push(item);
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

  const groupedPlanPackage = useMemo(() => {
    const groups = {
      half_board: [],
      full_board: [],
      all_inclusive: [],
    };

    packageMeal?.forEach((item) => {
      const mealType = item?.name;

      if (mealType === "Half Board") {
        groups.half_board.push(item);
      } else if (mealType === "Full Board") {
        groups.full_board.push(item);
      } else if (mealType === "All Inclusive") {
        groups.all_inclusive.push(item);
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState();

  const onDelete = () => {
    setIsModalOpen(true);
  };

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
                            <button
                              onClick={() => {
                                navigate(`/meal-plan/update/${item?.id}`, {
                                  state: {
                                    included_meals: section.key,
                                  },
                                });
                              }}
                              className="text-primary-900! hover:text-primary-700! bg-transparent! border-0! cursor-pointer! text-base!"
                            >
                              <EditOutlined />
                            </button>

                            {!isDefaultBreakfast && (
                              <button
                                onClick={() => {
                                  setSelectedMealPlan(item);
                                  onDelete();
                                }}
                                className="text-red-500! hover:text-red-700! bg-transparent! border-0! cursor-pointer! text-base!"
                              >
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
          className="w-full! h-12! rounded-xl! bg-white! border-primary-900! text-primary-900! font-semibold! hover:border-primary-400! hover:text-primary-700!"
          onClick={() => {
            navigate("/meal-plan/create/", {
              state: {
                included_meals: "other_meal",
              },
            });
          }}
        >
          Add Other Meal Plan
        </Button>
      </div>

      <div className=" mt-6">
        <h1 className="text-base! font-bold! text-gray-900! mb-2! ">
          Create Meal Package
        </h1>
        <div className=" mt-3">
          {MEAL_PLAN_PACKAGE_SECTIONS.map((section) => {
            const items = groupedPlanPackage[section.key] || [];

            return (
              <div key={section.key} className="w-full! mt-2">
                <h3
                  onClick={() => {
                    if (items?.length === 0) {
                      navigate("/meal-plan/package/", {
                        state: {
                          included_meals: section.title,
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
                                {item.name}- {item?.local_base_currency}{" "}
                                {item.effective_local_base_price}
                              </p>

                              {/* Service Duration */}
                              <>
                                {item?.components?.map((obj) => {
                                  const service_time =
                                    obj.meal_windows?.[
                                      obj?.included_meals?.[0]
                                    ];

                                  return (
                                    <p className="text-neutral-700 text-md! m-0!">
                                      {obj?.name} —{" "}
                                      {`${service_time.start} to ${service_time.end}`}
                                    </p>
                                  );
                                })}
                              </>

                              {/* Description (If exists) */}
                              {item.description && (
                                <p className="text-gray-500! text-sm! m-0!">
                                  - ({item.description})
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex! items-center! gap-3!">
                              <button
                                onClick={() => {
                                  navigate(
                                    `/meal-plan/package/${item?.id}/update/`,
                                    {
                                      state: {
                                        included_meals: section.key,
                                      },
                                    },
                                  );
                                }}
                                className="text-primary-900! hover:text-primary-700! bg-transparent! border-0! cursor-pointer! text-base!"
                              >
                                <EditOutlined />
                              </button>

                              {/* {!isDefaultBreakfast && (
                                <button
                                  onClick={() => {
                                    setSelectedMealPlan(item);
                                    onDelete();
                                  }}
                                  className="text-red-500! hover:text-red-700! bg-transparent! border-0! cursor-pointer! text-base!"
                                >
                                  <DeleteOutlined />
                                </button>
                              )} */}
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
      </div>

      <DeleteConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsDeleting(true);
          dispatch(deleteMealPlan(selectedMealPlan?.id)).then((response) => {
            if (_.endsWith(response.type, "fulfilled")) {
              message.success("Success");
            } else {
              message.error("Error");
            }
          });
          setIsDeleting(false);
          setIsModalOpen(false);
          setSelectedMealPlan();
        }}
        loading={isDeleting}
        title={`Delete ${selectedMealPlan?.name} ?`}
      />
    </>
  );
};

export default MealPlanList;
