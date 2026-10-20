import React, { useEffect, useState } from "react";
import { Input, Button, message } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getDocumentCode,
  invoiceChargeSelector,
  updateDocumentCode,
} from "../service/invoiceChargeSlice";
import PageLoading from "../components/PageLoading";
import _ from "lodash";

const EditDocumentIDSetUp = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const { documentCode, isPending } = useSelector(invoiceChargeSelector);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getDocumentCode({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch]);

  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    if (documentCode?.code) {
      setPrefix(documentCode.code);
    }
  }, [documentCode]);

  const handlePrefixChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    if (value.length <= 8) {
      setPrefix(value);
    }
  };

  const handleSave = () => {
    dispatch(
      updateDocumentCode({ business_id: businessId, data: { code: prefix } }),
    ).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Successfully updated!");
      } else {
        message.error("Failed to update.");
      }
    });
  };

  if (isPending) {
    return <PageLoading />;
  }
  return (
    <div className="">
      <div>
        {/* Header Title & Subtitle */}
        <h1 className="text-xl font-bold text-neutral-800 mb-1">
          Set up Invoice, Receipt & Reservation IDs
        </h1>
        <p className="text-sm text-neutral-500 mb-4">
          Up to 4 Capital Alphabets
        </p>

        {/* Info Banner */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3.5 mb-6 flex items-start gap-3">
          <InfoCircleFilled className="text-blue-600 text-lg mt-0.5" />
          <p className="text-xs text-neutral-600 leading-relaxed">
            You can use the first letters of your hotel name.
            <br />
            E.g. GRVH for Golden River View Hotel.
          </p>
        </div>

        {/* Input Form Fields */}
        <div className="space-y-6">
          {/* Invoice ID Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Invoice ID
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={prefix}
                onChange={handlePrefixChange}
                placeholder="NNH"
                className="w-28! text-center font-bold text-neutral-800 bg-neutral-50 border-neutral-300 rounded-md py-2 text-base"
              />
              <span className="text-base font-medium text-neutral-700">
                -INV-26-000123
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-neutral-400 text-xs">
              <InfoCircleFilled className="text-xs text-neutral-400!" />
              <span>"INV" represents "Invoice".</span>
            </div>
            <hr className="mt-4 border-neutral-100" />
          </div>

          {/* Receipt ID Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Receipt ID
            </label>
            <div className="flex items-center gap-2">
              <div className="w-28 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-center font-bold text-neutral-800 text-base">
                {prefix || "----"}
              </div>
              <span className="text-base font-medium text-neutral-700">
                -REC-26-000123
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-neutral-400 text-xs">
              <InfoCircleFilled className="text-xs text-neutral-400!" />
              <span>"REC" represents "Receipt".</span>
            </div>
            <hr className="mt-4 border-neutral-100" />
          </div>

          {/* Reservation ID Field */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Reservation ID
            </label>
            <div className="flex items-center gap-2">
              <div className="w-28 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-center font-bold text-neutral-800 text-base">
                {prefix || "----"}
              </div>
              <span className="text-base font-medium text-neutral-700">
                -RES-26-000123
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-neutral-400 text-xs">
              <InfoCircleFilled className="text-xs text-neutral-400!" />
              <span>"RES" represents "Reservation".</span>
            </div>
            <hr className="mt-4 border-neutral-100" />
          </div>
        </div>

        {/* Footer Info Text */}
        <p className="text-xs text-neutral-500 mt-6 leading-relaxed">
          The number "26" represents the year 2026. This will update to "27" on
          January 1, 2027.
        </p>
      </div>

      {/* Save Button */}
      <div className="pt-6 mt-auto">
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

export default EditDocumentIDSetUp;
