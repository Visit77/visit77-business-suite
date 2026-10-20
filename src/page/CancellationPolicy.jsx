import React, { useEffect, useState } from "react";
import { Button, message, Select } from "antd";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getPolicy,
  policySelector,
  updatePolicy,
} from "../service/policySlice";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const CancellationPolicy = () => {
  const [selectedPolicy, setSelectedPolicy] = useState("non_refundable");
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (businessId) {
      dispatch(
        getPolicy({
          business_id: businessId,
          policy_type: "cancellation",
        }),
      );
    }
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(policySelector);

  const [lessRefund, setLessRefund] = useState("0%");
  const [moreRefund, setMoreRefund] = useState("0%");

  const [lessHours, setLessHours] = useState("24h");
  const [moreHours, setMoreHours] = useState("24h");

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      const policyConfig = data[0]?.config;
      if (policyConfig) {
        setSelectedPolicy(policyConfig.type || "non_refundable");
        setDescription(policyConfig.description || "");

        if (policyConfig.type === "partial_refund") {
          if (policyConfig.less_than_rule) {
            setLessHours(
              `${policyConfig.less_than_rule.hours_before_check_in}h`,
            );
            setLessRefund(`${policyConfig.less_than_rule.refund_percent}%`);
          }
          if (
            policyConfig.more_than_rules &&
            policyConfig.more_than_rules.length > 0
          ) {
            if (policyConfig.more_than_rules[0]) {
              setLessHours(
                `${policyConfig.more_than_rules[0].hours_before_check_in}h`,
              );
              setLessRefund(
                `${policyConfig.more_than_rules[0].refund_percent}%`,
              );
            }
            if (policyConfig.more_than_rules[1]) {
              setMoreHours(
                `${policyConfig.more_than_rules[1].hours_before_check_in}h`,
              );
              setMoreRefund(
                `${policyConfig.more_than_rules[1].refund_percent}%`,
              );
            }
          }
        }
      }
    }
  }, [data]);

  const refundOptions = Array.from({ length: 11 }, (_, i) => {
    const value = `${i * 10}%`;
    return { value: i * 10, label: value };
  });

  const hourOptions = [
    { value: "6", label: "6h" },
    { value: "12", label: "12h" },
    { value: "24", label: "24h" },
    { value: "48", label: "48h" },
    { value: "72", label: "72h" },
    { value: "96", label: "96h" },
    { value: "120", label: "120h" },
  ];

  const handleSave = () => {
    const saveData = {
      business_id: businessId,
      policy_type: "cancellation",
      title: "Cancellation Policy",
      config: {
        type: selectedPolicy,

        less_than_rule:
          selectedPolicy === "partial_refund"
            ? {
                hours_before_check_in: 24,
                refund_percent: 0,
              }
            : null,
        more_than_rules:
          selectedPolicy === "partial_refund"
            ? [
                {
                  hours_before_check_in: parseInt(lessHours),
                  refund_percent: parseInt(lessRefund),
                },
                {
                  hours_before_check_in: parseInt(moreHours),
                  refund_percent: parseInt(moreRefund),
                },
              ]
            : null,
        description: description,
      },

      is_active: true,
      is_general_condition: false,
      rank: 2,
    };
    console.log("Saved Data:", saveData);

    dispatch(
      updatePolicy({
        id: data[0]?.id,
        data: saveData,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Policy create Successful.");
      }
    });
  };

  return (
    <div>
      <h2 className="text-lg font-medium! text-neutral-800 mb-4 ">
        Cancellation Policy
      </h2>

      <div className="space-y-3">
        {/* 1. non_refundable */}
        <div
          onClick={() => setSelectedPolicy("non_refundable")}
          className={`flex items-center p-3.5 rounded-lg border cursor-pointer transition-all ${
            selectedPolicy === "non_refundable"
              ? "border-indigo-600 bg-indigo-50/30"
              : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <input
            type="radio"
            name="cancellationGroup"
            checked={selectedPolicy === "non_refundable"}
            onChange={() => setSelectedPolicy("non_refundable")}
            className="w-4 h-4 text-indigo-600 cursor-pointer"
          />
          <span className="ml-3 font-medium text-neutral-700">
            Non Refundable
          </span>
        </div>

        {/* 2. Free Cancellation */}
        <div
          onClick={() => setSelectedPolicy("full_refund")}
          className={`flex items-center p-3.5 rounded-lg border cursor-pointer transition-all ${
            selectedPolicy === "full_refund"
              ? "border-indigo-600 bg-indigo-50/30"
              : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <input
            type="radio"
            name="cancellationGroup"
            checked={selectedPolicy === "full_refund"}
            onChange={() => setSelectedPolicy("full_refund")}
            className="w-4 h-4 text-indigo-600 cursor-pointer"
          />
          <span className="ml-3 font-medium text-neutral-700">
            Free Cancellation (Full Refund)
          </span>
        </div>

        {/* 3. Refund (Less than & More than ပေါင်းထားသော Radio Card) */}
        <div
          onClick={() => setSelectedPolicy("partial_refund")}
          className={`p-4 rounded-lg border transition-all ${
            selectedPolicy === "partial_refund"
              ? "border-indigo-600 bg-indigo-50/30"
              : "border-neutral-200 bg-neutral-50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <input
              type="radio"
              name="cancellationGroup"
              checked={selectedPolicy === "partial_refund"}
              onChange={() => setSelectedPolicy("partial_refund")}
              className="w-4 h-4 text-indigo-600 cursor-pointer"
            />
            <span className="font-semibold text-neutral-800">Refund</span>
          </div>

          {/* Inner Options Container */}
          <div className="ml-7 space-y-4">
            {/* Less than [Hours] */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <span className="text-sm font-medium text-neutral-600 w-16">
                Refund
              </span>
              <Select
                value={lessRefund}
                onChange={(val) => setLessRefund(val)}
                options={refundOptions}
                disabled={selectedPolicy !== "partial_refund"}
                className="w-24"
              />
              <span className="text-sm text-neutral-600">Less than</span>
              <Select
                value={lessHours}
                onChange={(val) => setLessHours(val)}
                options={hourOptions}
                disabled={selectedPolicy !== "partial_refund"}
                className="w-24"
              />
              <span className="text-sm text-neutral-600 font-medium!">
                before check-in
              </span>
            </div>

            {/* More than [Hours] */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <span className="text-sm font-medium text-neutral-600 w-16">
                Refund
              </span>
              <Select
                value={moreRefund}
                onChange={(val) => setMoreRefund(val)}
                options={refundOptions}
                disabled={selectedPolicy !== "partial_refund"}
                className="w-24"
              />
              <span className="text-sm text-neutral-600 font-medium!">
                More than
              </span>
              <Select
                value={moreHours}
                onChange={(val) => setMoreHours(val)}
                options={hourOptions}
                disabled={true}
                className="w-24"
              />
              <span className="text-sm text-neutral-600 font-medium!">
                before check-in
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Description */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          Cancellation Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium!"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          block
          size="large"
          className="h-12 text-base font-medium rounded-lg"
          onChange={() => {
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          block
          size="large"
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-medium rounded-lg"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CancellationPolicy;
