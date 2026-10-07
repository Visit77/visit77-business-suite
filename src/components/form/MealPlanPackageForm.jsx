import React, { useEffect } from "react";
import { Form, Checkbox, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import { getMealPlan, mealPlanSelector } from "../../service/mealPlanSlice";

const MealPlanPackageForm = ({
  form,
  handleFinish,
  handleCancel,
  selectedMeals = [],
  handleMealCheck,
  calculatedTotals,
  packageName,
}) => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const { data: mealPlansData = [], isPending: mealPlanPending } =
    useSelector(mealPlanSelector);

  // Form ထဲက isSetNewPrice တန်ဖိုးကို တိုက်ရိုက် စောင့်ကြည့်မည်
  const isSetNewPrice = Form.useWatch("isSetNewPrice", form);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getMealPlan({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch]);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          isSetNewPrice: false,
        }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-3">{packageName}</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose Meals
          </label>

          {mealPlanPending ? (
            <div className="text-sm text-gray-500 py-2">
              Loading meal plans...
            </div>
          ) : mealPlansData.length > 0 ? (
            <div className="space-y-3">
              {mealPlansData.map((meal) => {
                const isChecked = selectedMeals.some(
                  (item) => item.id === meal.id,
                );
                return (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between"
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => handleMealCheck(meal, e.target.checked)}
                      className="text-gray-800 font-medium"
                    >
                      {meal.name}
                    </Checkbox>
                    <span className="text-sm font-semibold text-gray-700">
                      - {meal.local_base_currency || "MMK"}{" "}
                      {meal.local_base_price}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-400 py-2">
              No meal plans available
            </div>
          )}
        </div>

        {selectedMeals.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 my-3">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              {packageName} Price ({selectedMeals.length} items)
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-800">
              <span>Local Total:</span>
              <span>
                MMK {calculatedTotals.local_base_price.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        <div className="text-center text-gray-400 my-3 text-sm font-medium">
          or
        </div>

        <Form.Item
          name="isSetNewPrice"
          valuePropName="checked"
          className="mb-4"
        >
          <Checkbox className="text-base font-bold text-gray-900">
            Set New Price
          </Checkbox>
        </Form.Item>

        {/* isSetNewPrice အမှန်တကယ် true ဖြစ်မှသာ input များ ပေါ်မည် */}
        {isSetNewPrice && (
          <div className="space-y-5 transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-2">
                For Local <span className="text-red-500">*</span>
              </span>

              <div className="space-y-3">
                <Form.Item
                  name={["local", "local_base_price"]}
                  className="m-0"
                  rules={[
                    {
                      required: isSetNewPrice,
                      message: "Please enter MMK price",
                    },
                  ]}
                >
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="w-12 inline-block font-semibold text-gray-700 text-center">
                        MMK
                      </span>
                    }
                    className="rounded-lg overflow-hidden border-gray-200 bg-gray-100"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name={["local", "local_usd_display_price"]}
                  className="m-0"
                >
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="w-12 inline-block font-semibold text-gray-700 text-center">
                        USD
                      </span>
                    }
                    className="rounded-lg overflow-hidden border-gray-200 bg-gray-100"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-2">
                For Foreigner
              </span>

              <div className="space-y-3">
                <Form.Item
                  name={["foreigner", "foreign_base_price"]}
                  className="m-0"
                >
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="w-12 inline-block font-semibold text-gray-700 text-center">
                        MMK
                      </span>
                    }
                    className="rounded-lg overflow-hidden border-gray-200 bg-gray-100"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name={["foreigner", "foreign_usd_display_price"]}
                  className="m-0"
                >
                  <Input
                    placeholder="Type ..."
                    addonBefore={
                      <span className="w-12 inline-block font-semibold text-gray-700 text-center">
                        USD
                      </span>
                    }
                    className="rounded-lg overflow-hidden border-gray-200 bg-gray-100"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        )}
      </Form>

      <div className="flex gap-3 pt-6 mt-auto">
        <Button
          size="large"
          className="w-1/2 h-12 rounded-xl bg-gray-200 border-none text-gray-700 font-bold hover:bg-gray-300"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          className="w-1/2 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-none"
          onClick={() => form.submit()}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default MealPlanPackageForm;
