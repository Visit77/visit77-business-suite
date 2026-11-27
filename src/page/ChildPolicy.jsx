import { Collapse, message } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  getPolicy,
  policySelector,
  updatePolicy,
} from "../service/policySlice";
import { ChildPolicyForm } from "../components/form/ChildPolicyForm";

const CHARGE_TYPE_LABELS = {
  free: "Free of Charge",
  half_adult_rate: "50% of Adult Rate",
  same_as_adult: "100% of Adult Rate",
};

const formatRuleHeading = (rule) => {
  if (
    rule?.age_from === 0 &&
    rule?.age_to !== null &&
    rule?.age_to !== undefined
  ) {
    return `Under ${rule.age_to} year(s) old`;
  }
  if (rule?.age_to === null || rule?.age_to === undefined) {
    return `Above ${rule?.age_from} year(s) old`;
  }
  return `Between ${rule?.age_from} to ${rule?.age_to} year(s) old`;
};

const parseRulesToFormValues = (config) => {
  const rules = Array.isArray(config?.rules) ? config.rules : [];

  const underRule = rules.find(
    (r) => r?.age_from === 0 && r?.age_to !== null && r?.age_to !== undefined,
  );
  const betweenRule = rules.find(
    (r) => r?.age_from > 0 && r?.age_to !== null && r?.age_to !== undefined,
  );
  const aboveRule = rules.find(
    (r) => r?.age_to === null || r?.age_to === undefined,
  );

  return {
    under_rule: {
      enabled: rules.length > 0 ? Boolean(underRule) : true,
      age_to: underRule?.age_to ?? 4,
      charge_type: underRule?.charge_type ?? "free",
    },
    between_rule: {
      enabled: rules.length > 0 ? Boolean(betweenRule) : true,
      age_from: betweenRule?.age_from ?? 5,
      age_to: betweenRule?.age_to ?? 13,
      charge_type: betweenRule?.charge_type ?? "half_adult_rate",
    },
    above_rule: {
      enabled: rules.length > 0 ? Boolean(aboveRule) : true,
      age_from: aboveRule?.age_from ?? 14,
      charge_type: aboveRule?.charge_type ?? "same_as_adult",
    },
    additional_conditions: config?.additional_conditions ?? "",
  };
};

const ChildPolicy = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getPolicy({
          business_id: businessId,
          policy_type: "child",
        }),
      );
    }
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(policySelector);
  const currentPolicy = Array.isArray(data)
    ? (data.find((item) => item?.policy_type === "child") ?? data[0])
    : data;

  const rules = Array.isArray(currentPolicy?.config?.rules)
    ? currentPolicy.config.rules
    : [];
  const additionalConditions =
    currentPolicy?.config?.additional_conditions ?? "";

  const formInitialValues = parseRulesToFormValues(currentPolicy?.config);

  const handleSavePolicy = (values) => {
    if (!currentPolicy?.id) {
      message.error("Policy record not found.");
      return;
    }

    const saveData = {
      business_id: businessId,
      policy_type: currentPolicy?.policy_type ?? "child",
      title: currentPolicy?.title ?? "Child Policy",
      description: currentPolicy?.description ?? "",
      config: {
        ...currentPolicy?.config,
        rules: values.rules,
        additional_conditions: values.additional_conditions,
      },
      is_active: currentPolicy?.is_active ?? true,
      is_configured: true,
      is_general_condition: currentPolicy?.is_general_condition ?? true,
    };

    dispatch(
      updatePolicy({
        id: currentPolicy.id,
        data: saveData,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Child policy updated successfully.");
        dispatch(
          getPolicy({
            business_id: businessId,
            policy_type: "child",
          }),
        );
        setIsEditing(false);
      } else {
        message.error("Failed to update child policy.");
      }
    });
  };

  return (
    <div className="l mx-auto p-4 sm:p-6">
      {/* Header with Edit Policy action */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">Child Policy</h2>
      </div>

      {/* Summary View + Collapse Edit Form */}
      <div className="space-y-4">
        {rules.length > 0 ? (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={`${rule?.age_from}-${rule?.age_to}-${index}`}
                className="rounded-xl bg-slate-50/90 p-4 border border-slate-100"
              >
                <div className="text-sm font-bold text-blue-900">
                  {formatRuleHeading(rule)}
                </div>
                <div className="text-sm font-medium text-slate-800 mt-1">
                  {CHARGE_TYPE_LABELS[rule?.charge_type] ?? rule?.charge_type}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50/90 p-4 border border-slate-100 text-sm text-slate-500">
            No child policy rules configured yet.
          </div>
        )}

        <div className="border-t border-slate-100 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Additional Conditions
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1 whitespace-pre-line">
            {additionalConditions || "No additional conditions."}
          </div>
        </div>

        <Collapse
          activeKey={isEditing ? ["edit-child-policy"] : []}
          onChange={(keys) =>
            setIsEditing(Array.isArray(keys) && keys.length > 0)
          }
          expandIconPlacement="end"
          className="rounded-xl! font-medium! overflow-hidden border border-slate-200 bg-white [&_.ant-collapse-header]:bg-slate-50! [&_.ant-collapse-header]:px-4! [&_.ant-collapse-header]:py-3.5! [&_.ant-collapse-content-box]:p-4!"
          items={[
            {
              key: "edit-child-policy",
              label: (
                <div className="flex items-center justify-between pr-2">
                  <span className="text-base font-bold text-slate-900">
                    Edit Child Policy
                  </span>
                </div>
              ),
              children: (
                <ChildPolicyForm
                  initialValues={formInitialValues}
                  submitting={isPending}
                  onSave={handleSavePolicy}
                  onCancel={() => setIsEditing(false)}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ChildPolicy;
