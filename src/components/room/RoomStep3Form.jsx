import React, { useEffect, useState } from "react";
import { Form, Input, Checkbox, Select, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getMealPlan, mealPlanSelector } from "../../service/mealPlanSlice";

const RoomStep3Form = ({ form, businessId }) => {
  const [extraBedAvailable, setExtraBedAvailable] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState(
    "included_in_room_price",
  );
  const [breakfastPricingType, setBreakfastPricingType] = useState(
    "hotel_default_price",
  );

  const dispatch = useDispatch();

  const breakfastPlanType = Form.useWatch("breakfast_plan_type", form);

  useEffect(() => {
    if (breakfastPlanType === "breakfast_price" && businessId) {
      dispatch(
        getMealPlan({
          business_id: businessId,
          is_default_for_room_type_breakfast: true,
        }),
      );
    }
  }, [breakfastPlanType, businessId, dispatch]);

  const { data: mealPlan, isPending: isStandardPending } =
    useSelector(mealPlanSelector);

  return (
    <div className="space-y-4">
      {/* 1. ROOM PRICE CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          ROOM PRICE
        </h2>

        {/* For Local */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-700">
            For Local <span className="text-red-500">*</span>
          </span>
          <div className="space-y-2">
            <Form.Item name="local_mmk" className="mb-0">
              <Input
                placeholder="Type ..."
                addonBefore={
                  <span className="text-xs font-medium text-slate-600 px-1">
                    MMK
                  </span>
                }
                className="rounded-xl h-10 text-xs bg-slate-50/50"
              />
            </Form.Item>
            <Form.Item name="local_usd" className="mb-0">
              <Input
                placeholder="Type ..."
                addonBefore={
                  <span className="text-xs font-medium text-slate-600 px-1">
                    USD
                  </span>
                }
                className="rounded-xl h-10 text-xs bg-slate-50/50"
              />
            </Form.Item>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* For Foreigner */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-700">
            For Foreigner <span className="text-red-500">*</span>
          </span>
          <div className="space-y-2">
            <Form.Item name="foreigner_mmk" className="mb-0">
              <Input
                placeholder="Type ..."
                addonBefore={
                  <span className="text-xs font-medium text-slate-600 px-1">
                    MMK
                  </span>
                }
                className="rounded-xl h-10 text-xs bg-slate-50/50"
              />
            </Form.Item>
            <Form.Item name="foreigner_usd" className="mb-0">
              <Input
                placeholder="Type ..."
                addonBefore={
                  <span className="text-xs font-medium text-slate-600 px-1">
                    USD
                  </span>
                }
                className="rounded-xl h-10 text-xs bg-slate-50/50"
              />
            </Form.Item>
          </div>
        </div>
      </div>

      {/* 2. EXTRA BED CHARGE CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          EXTRA BED CHARGE
        </h2>

        <div className="flex items-center justify-between">
          <Form.Item
            name="extra_bed_available"
            valuePropName="checked"
            className="mb-0"
          >
            <Checkbox
              onChange={(e) => setExtraBedAvailable(e.target.checked)}
              className="text-xs font-medium text-slate-700"
            >
              Extra Bed Available
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="extra_bed_quantity"
            initialValue="1"
            className="mb-0"
          >
            <Select disabled={!extraBedAvailable} className="w-20 h-9 text-xs">
              {[1, 2, 3, 4, 5].map((num) => (
                <Option key={num} value={String(num)}>
                  {num}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {extraBedAvailable && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700">
                For Local <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2">
                <Form.Item name="extra_bed_local_base_price" className="mb-0">
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="text-xs font-medium text-slate-600 px-1">
                        MMK
                      </span>
                    }
                    className="rounded-xl h-10 text-xs bg-slate-50/50"
                  />
                </Form.Item>
                <Form.Item
                  name="extra_bed_local_usd_display_price"
                  className="mb-0"
                >
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="text-xs font-medium text-slate-600 px-1">
                        USD
                      </span>
                    }
                    className="rounded-xl h-10 text-xs bg-slate-50/50"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-700">
                For Foreigner <span className="text-red-500">*</span>
              </span>
              <div className="space-y-2">
                <Form.Item name="extra_bed_foreign_base_price" className="mb-0">
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="text-xs font-medium text-slate-600 px-1">
                        MMK
                      </span>
                    }
                    className="rounded-xl h-10 text-xs bg-slate-50/50"
                  />
                </Form.Item>
                <Form.Item
                  name="extra_bed_foreign_usd_display_price"
                  className="mb-0"
                >
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="text-xs font-medium text-slate-600 px-1">
                        USD
                      </span>
                    }
                    className="rounded-xl h-10 text-xs bg-slate-50/50"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MEAL PLAN CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          MEAL PLAN
        </h2>

        {/* Main Meal Plan Type */}
        <Form.Item
          name="breakfast_plan_type"
          initialValue="included_in_room_price"
          className="mb-0"
        >
          <Radio.Group
            onChange={(e) => {
              setSelectedMealPlan(e.target.value);
            }}
            className="w-full flex flex-col space-y-3"
          >
            <Radio
              value="included_in_room_price"
              className="text-xs font-medium text-slate-700"
            >
              Breakfast Included in Room Price
            </Radio>
            <Radio
              value="no_breakfast"
              className="text-xs font-medium text-slate-700"
            >
              No Breakfast
            </Radio>
            <Radio
              value="breakfast_price"
              className="text-xs font-medium text-slate-700"
            >
              Breakfast Price
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Sub Option: Breakfast Pricing Type */}
        {selectedMealPlan === "breakfast_price" && (
          <div className="pl-6 space-y-3 pt-1">
            <Form.Item
              name="breakfast_pricing_type"
              initialValue="hotel_default_price"
              className="mb-0"
            >
              <Radio.Group
                onChange={(e) => setBreakfastPricingType(e.target.value)}
                className="flex flex-col space-y-3"
              >
                <Radio
                  value="hotel_default_price"
                  className="text-xs font-medium text-slate-700"
                >
                  Use Hotel Default
                </Radio>
                <Radio
                  value="custom_price"
                  className="text-xs font-medium text-slate-700"
                >
                  Custom
                </Radio>
              </Radio.Group>
            </Form.Item>

            {/* Show Hotel Default Info Cards */}
            {breakfastPricingType === "hotel_default_price" && (
              <div className="space-y-2 pl-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px]">Local Guest</p>
                    <p className="font-bold text-blue-600">
                      +MMK {mealPlan?.[0]?.local_base_price}
                    </p>
                  </div>
                  <p className="font-bold text-blue-600">
                    +USD {mealPlan?.[0]?.local_usd_display_price}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px]">
                      Foreigner Guest
                    </p>
                    <p className="font-bold text-blue-600">
                      +MMK {mealPlan?.[0]?.foreign_base_price}
                    </p>
                  </div>
                  <p className="font-bold text-blue-600">
                    +USD {mealPlan?.[0]?.foreign_usd_display_price}
                  </p>
                </div>
              </div>
            )}

            {/* Show Custom Inputs */}
            {breakfastPricingType === "custom_price" && (
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-700">
                    For Local <span className="text-red-500">*</span>
                  </span>
                  <div className="space-y-2">
                    <Form.Item
                      name="breakfast_custom_local_base_price"
                      className="mb-0"
                    >
                      <Input
                        placeholder="Type ..."
                        addonBefore={
                          <span className="text-xs font-medium text-slate-600 px-1">
                            MMK
                          </span>
                        }
                        className="rounded-xl h-10 text-xs bg-slate-50/50"
                      />
                    </Form.Item>
                    <Form.Item
                      name="breakfast_custom_local_usd_display_price"
                      className="mb-0"
                    >
                      <Input
                        placeholder="Type ..."
                        addonBefore={
                          <span className="text-xs font-medium text-slate-600 px-1">
                            USD
                          </span>
                        }
                        className="rounded-xl h-10 text-xs bg-slate-50/50"
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-700">
                    For Foreigner <span className="text-red-500">*</span>
                  </span>
                  <div className="space-y-2">
                    <Form.Item
                      name="breakfast_custom_foreign_base_price"
                      className="mb-0"
                    >
                      <Input
                        placeholder="Type ..."
                        addonBefore={
                          <span className="text-xs font-medium text-slate-600 px-1">
                            MMK
                          </span>
                        }
                        className="rounded-xl h-10 text-xs bg-slate-50/50"
                      />
                    </Form.Item>
                    <Form.Item
                      name="breakfast_custom_foreign_usd_display_price"
                      className="mb-0"
                    >
                      <Input
                        placeholder="Type ..."
                        addonBefore={
                          <span className="text-xs font-medium text-slate-600 px-1">
                            USD
                          </span>
                        }
                        className="rounded-xl h-10 text-xs bg-slate-50/50"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomStep3Form;
