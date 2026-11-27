import { message, Tag } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  getPolicy,
  policySelector,
  updatePolicy,
} from "../service/policySlice";
import { CancellationPolicyCollapseForm } from "../components/form/CancellationPolicyCollapseForm";

const CANCELLATION_META = {
  non_refundable: {
    label: "Non Refundable",
    badgeText: "Non Refundable",
    badgeColor: "error",
  },
  full_refund: {
    label: "Free Cancellation (Full Refund)",
    badgeText: "Full Refund",
    badgeColor: "success",
  },
  partial_refund: {
    label: "Partial Refund",
    badgeText: "Partial Refund",
    badgeColor: "warning",
  },
};

const CancellationPolicy = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [collapseOpenKey, setCollapseOpenKey] = useState(0);

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
  const currentPolicy = Array.isArray(data)
    ? (data.find((item) => item?.policy_type === "cancellation") ?? data[0])
    : data;

  const policyConfig = currentPolicy?.config ?? {};
  const policyType = policyConfig?.type ?? "non_refundable";

  const policyMeta = CANCELLATION_META[policyType] ?? {
    label: "Not configured yet.",
    badgeText: "Unset",
    badgeColor: "default",
  };

  const lessRule = policyConfig?.more_than_rules?.[0];
  const moreRule = policyConfig?.more_than_rules?.[1];

  const lessRefund = lessRule?.refund_percent ?? 0;
  const lessHours = lessRule?.hours_before_check_in ?? 24;
  const moreRefund = moreRule?.refund_percent ?? 0;
  const moreHours = moreRule?.hours_before_check_in ?? 24;
  const description = policyConfig?.description ?? "";

  const formInitialValues = {
    type: policyType,
    lessRefund,
    lessHours,
    moreRefund,
    moreHours,
    description,
  };

  const handleSavePolicy = (values) => {
    const policyId =
      currentPolicy?.id ?? (Array.isArray(data) ? data[0]?.id : null);
    if (!policyId) {
      message.error("Policy record not found.");
      return;
    }

    const saveData = {
      business_id: businessId,
      policy_type: "cancellation",
      title: "Cancellation Policy",
      config: {
        type: values.type,
        less_than_rule:
          values.type === "partial_refund"
            ? {
                hours_before_check_in: 24,
                refund_percent: 0,
              }
            : null,
        more_than_rules:
          values.type === "partial_refund"
            ? [
                {
                  hours_before_check_in: parseInt(values.lessHours, 10),
                  refund_percent: parseInt(values.lessRefund, 10),
                },
                {
                  hours_before_check_in: parseInt(values.moreHours, 10),
                  refund_percent: parseInt(values.moreRefund, 10),
                },
              ]
            : null,
        description: values.description ?? "",
      },
      is_active: true,
      is_general_condition: false,
      rank: 2,
    };

    dispatch(
      updatePolicy({
        id: policyId,
        data: saveData,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Policy create Successful.");
        dispatch(
          getPolicy({
            business_id: businessId,
            policy_type: "cancellation",
          }),
        );
        setCollapseOpenKey((prev) => prev + 1);
      } else {
        message.error("Failed to update cancellation policy.");
      }
    });
  };

  return (
    <div className="mx-auto p-4 sm:p-6">
      {/* Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Cancellation Policy
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage cancellation refund rules and conditions for bookings
          </p>
        </div>
        <Tag
          color={policyMeta.badgeColor}
          className="rounded-full! px-3! py-0.5! font-medium! m-0!"
        >
          {policyMeta.badgeText}
        </Tag>
      </div>

      {/* Current Policy Summary */}
      <div className="mb-4 mt-4 rounded-xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Current Policy
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1">
            {policyMeta.label}
          </div>

          {policyType === "partial_refund" && (
            <div className="mt-2 space-y-1 text-xs font-medium text-slate-700">
              <div>
                • Refund {lessRefund}% Less than {lessHours}h before check-in
              </div>
              <div>
                • Refund {moreRefund}% More than {moreHours}h before check-in
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/70 pt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Cancellation Description
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1 whitespace-pre-line">
            {description ? description : "No description."}
          </div>
        </div>
      </div>

      {/* Collapsible Edit Form */}
      <CancellationPolicyCollapseForm
        key={`${currentPolicy?.id ?? "cancellation"}-${collapseOpenKey}`}
        initialValues={formInitialValues}
        submitting={isPending}
        onSave={handleSavePolicy}
        onCancel={() => {
          setCollapseOpenKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default CancellationPolicy;
