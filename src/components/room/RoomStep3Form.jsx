import React, { useState } from "react";
import { Form, Input, Checkbox, Select } from "antd";

const RoomStep3Form = () => {
  const [extraBedAvailable, setExtraBedAvailable] = useState(false);

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
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          EXTRA BED CHARGE
        </h2>

        <div className="flex items-center justify-between">
          <Form.Item
            name="has_extra_bed"
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

          <Form.Item name="extra_bed_count" initialValue="1" className="mb-0">
            <Select disabled={!extraBedAvailable} className="w-20 h-9 text-xs">
              {[1, 2, 3, 4, 5].map((num) => (
                <Select.Option key={num} value={String(num)}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      {/* 3. MEAL PLAN CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          MEAL PLAN
        </h2>

        <Form.Item
          name="meal_plan"
          initialValue={["breakfast_included"]}
          className="mb-0"
        >
          <Checkbox.Group className="w-full flex flex-col space-y-3">
            <Checkbox
              value="breakfast_included"
              className="text-xs font-medium text-slate-700"
            >
              Breakfast Included in Room Price
            </Checkbox>
            <Checkbox
              value="no_breakfast"
              className="text-xs font-medium text-slate-700"
            >
              No Breakfast
            </Checkbox>
            <Checkbox
              value="breakfast_price"
              className="text-xs font-medium text-slate-700"
            >
              Breakfast Price
            </Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export default RoomStep3Form;
