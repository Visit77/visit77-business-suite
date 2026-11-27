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
import { SmokingConditionCollapseForm } from "../components/form/SmokingConditionCollapseForm";

//non_smoking_property | designated_smoking_areas | smoking_room_available | designated_rooms_and_areas
const SMOKING_CONDITION_META = {
  non_smoking_property: {
    label: "Non-Smoking Property",
    badgeText: "Non-Smoking",
    badgeColor: "error",
  },
  designated_smoking_areas: {
    label: "Designated Smoking Areas",
    badgeText: "Designated Areas",
    badgeColor: "warning",
  },
  smoking_room_available: {
    label: "Smoking Room Available",
    badgeText: "Smoking Room",
    badgeColor: "processing",
  },
  designated_rooms_and_areas: {
    label: "Smoking Permitted in Designated Rooms and Areas",
    badgeText: "Rooms & Areas",
    badgeColor: "success",
  },
};

const SmokingCondition = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const [collapseOpenKey, setCollapseOpenKey] = useState(0);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getPolicy({
          business_id: businessId,
          policy_type: "smoking",
        }),
      );
    }
  }, [businessId, dispatch]);

  const { data, isPending } = useSelector(policySelector);
  const currentPolicy = Array.isArray(data) ? data[0] : data;

  const choiceKey = currentPolicy?.config?.choice ?? "non_smoking_property";
  const conditionMeta = SMOKING_CONDITION_META[choiceKey] ?? {
    label: "Not configured yet.",
    badgeText: "Unset",
    badgeColor: "default",
  };
  const additionalConditions =
    currentPolicy?.config?.additional_conditions ?? "";

  const formInitialValues = {
    smoking_condition: choiceKey,
    additional_conditions: additionalConditions,
  };

  const handleSaveCondition = (values) => {
    if (!currentPolicy?.id) {
      message.error("Policy record not found.");
      return;
    }

    const saveData = {
      business_id: businessId,
      policy_type: currentPolicy?.policy_type ?? "smoking",
      title: currentPolicy?.title ?? "Smoking Condition",
      description: currentPolicy?.description ?? "",
      config: {
        ...currentPolicy?.config,
        choice: values.smoking_condition,
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
        message.success("Smoking condition updated successfully.");
        dispatch(
          getPolicy({
            business_id: businessId,
            policy_type: "smoking",
          }),
        );
        setCollapseOpenKey((prev) => prev + 1);
      } else {
        message.error("Failed to update smoking condition.");
      }
    });
  };

  return (
    <div className=" mx-auto p-4 sm:p-6">
      {/* Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Smoking Condition
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage smoking rules and extra conditions for guests
          </p>
        </div>
        <Tag
          color={conditionMeta.badgeColor}
          className="rounded-full! px-3! py-0.5! font-medium! m-0!"
        >
          {conditionMeta.badgeText}
        </Tag>
      </div>

      {/* Current Condition Summary */}
      <div className="mb-4 rounded-xl bg-slate-50/90 border border-slate-200/80 p-4 space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Current Condition
          </div>
          <div className="text-sm font-semibold text-slate-800 mt-1">
            {conditionMeta.label}
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
      <SmokingConditionCollapseForm
        key={`${currentPolicy?.id ?? "smoking"}-${collapseOpenKey}`}
        initialValues={formInitialValues}
        submitting={isPending}
        onSave={handleSaveCondition}
        onCancel={() => {
          setCollapseOpenKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default SmokingCondition;
