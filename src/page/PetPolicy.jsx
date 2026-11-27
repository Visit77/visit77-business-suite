import { message, Tag } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PetPolicyCollapseForm } from "../components/form/PetPolicyCollapseForm";
import { selectBusinessId } from "../service/businessSlice";
import {
  getPolicy,
  policySelector,
  updatePolicy,
} from "../service/policySlice";

const PET_POLICY_META = {
  not_allowed: {
    label: "Pets Are Not Allowed.",
    badgeText: "Not Allowed",
    badgeColor: "error",
  },
  allowed: {
    label: "Pets Are Allowed.",
    badgeText: "Allowed",
    badgeColor: "success",
  },
  allowed_with_restrictions: {
    label: "Pets Allowed with Restrictions.",
    badgeText: "With Restrictions",
    badgeColor: "warning",
  },
};

const PetPolicy = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [collapseOpenKey, setCollapseOpenKey] = useState(0);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getPolicy({
          business_id: businessId,
          policy_type: "pet",
        }),
      );
    }
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(policySelector);
  const currentPolicy = Array.isArray(data) ? data[0] : data;

  const choiceKey = currentPolicy?.config?.choice ?? "not_allowed";
  const policyMeta = PET_POLICY_META[choiceKey] ?? {
    label: "Not configured yet.",
    badgeText: "Unset",
    badgeColor: "default",
  };
  const additionalConditions =
    currentPolicy?.config?.additional_conditions ?? "";

  const formInitialValues = {
    pet_policy: choiceKey,
    additional_conditions: additionalConditions,
  };

  const handleSavePolicy = (values) => {
    if (!currentPolicy?.id) {
      message.error("Policy record not found.");
      return;
    }

    const saveData = {
      business_id: businessId,
      policy_type: currentPolicy?.policy_type ?? "pet",
      title: currentPolicy?.title ?? "Pet Policy",
      description: currentPolicy?.description ?? "",
      config: {
        ...currentPolicy?.config,
        choice: values.pet_policy,
        additional_conditions: values.additional_conditions?.trim() ?? "",
      },
      is_active: currentPolicy?.is_active ?? true,
      is_configured: true,
      is_general_condition: false,
    };

    dispatch(
      updatePolicy({
        id: currentPolicy.id,
        data: saveData,
      }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Policy updated successfully.");
        dispatch(
          getPolicy({
            business_id: businessId,
            policy_type: "pet",
          }),
        );
        setCollapseOpenKey((prev) => prev + 1);
      } else {
        message.error("Failed to update policy.");
      }
    });
  };

  return (
    <div className="mx-auto p-4 sm:p-6">
      {/* Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Pet Policy</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage pet allowance rules and extra conditions for guests
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
      <div className="mb-4 rounded-xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Current Policy
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1">
            {policyMeta.label}
          </div>
        </div>

        <div className="border-t border-slate-200/70 pt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Additional Conditions
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1 whitespace-pre-line">
            {additionalConditions
              ? additionalConditions
              : "No additional conditions."}
          </div>
        </div>
      </div>

      {/* Collapsible Edit Form */}
      <PetPolicyCollapseForm
        key={`${currentPolicy?.id ?? "pet"}-${collapseOpenKey}`}
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

export default PetPolicy;
