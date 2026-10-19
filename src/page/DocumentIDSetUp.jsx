import React, { useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  getDocumentCode,
  invoiceChargeSelector,
} from "../service/invoiceChargeSlice";

const DocumentIDSetUp = () => {
  const navigate = useNavigate();

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

  return (
    <div className="">
      <div>
        {/* Header Title */}
        <h1 className="text-xl font-bold text-slate-800 mb-6">
          Set up Invoice, Receipt & Reservation IDs
        </h1>

        <div className="space-y-6">
          {/* Invoice ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Invoice ID
            </label>
            <div className="text-base text-slate-800 font-medium">
              {documentCode?.code}-INV-26-000123
            </div>
            <hr className="mt-4 border-slate-100" />
          </div>

          {/* Receipt ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Receipt ID
            </label>
            <div className="text-base text-slate-800 font-medium">
              {documentCode?.code}-REC-26-000123
            </div>
            <hr className="mt-4 border-slate-100" />
          </div>

          {/* Reservation ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Reservation ID
            </label>
            <div className="text-base text-slate-800 font-medium">
              {documentCode?.code}-RES-26-000123
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="pt-6 mt-auto">
        <Button
          type="primary"
          block
          size="large"
          onClick={() => {
            navigate(`/document/id-setup/edit`);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-medium rounded-lg"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default DocumentIDSetUp;
