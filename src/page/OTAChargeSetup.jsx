import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import ChargeTaxModal from "../components/modal/ChargeTaxModal";
import OtherChargeModal from "../components/modal/OtherChargeModal";
import ChargeCard from "../components/card/ChargeCard";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  createOtaInvoiceCharge,
  getOTAInvoiceCharge,
  invoiceChargeSelector,
  updateOtaInvoiceCharge,
} from "../service/invoiceChargeSlice";
import _ from "lodash";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full border-2 border-dashed border-[#4f46e5] rounded-xl p-4 flex items-center justify-center text-[#4f46e5] font-semibold text-lg hover:bg-indigo-50/50 transition-all"
    >
      <PlusOutlined className="mr-2 text-lg" /> Add
    </button>
  );
};

const OTAChargeSetup = () => {
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ota, isPending } = useSelector(invoiceChargeSelector);

  useEffect(() => {
    if (businessId) {
      dispatch(
        getOTAInvoiceCharge({
          business_id: businessId,
        }),
      );
    }
  }, [businessId, dispatch]);

  // Modal Controls
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [otherModalTitle, setOtherModalTitle] = useState("");
  const [otherModalTarget, setOtherModalTarget] = useState(""); // 'charge' or 'tax'
  const [editingOtherItem, setEditingOtherItem] = useState(null);
  const openOtherModal = (target, title, itemToEdit = null) => {
    setOtherModalTarget(target);
    setOtherModalTitle(title);
    setEditingOtherItem(itemToEdit);
    setIsOtherModalOpen(true);
  };
  // Extracting data from Redux ota object based on invoiceCharge.txt structure
  const serviceChargeData = ota?.service_charge?.[0] || null;
  const taxData = ota?.tax?.[0] || null;
  const otherChargesList = ota?.other_charge || [];
  const otherTaxesList = ota?.other_tax || [];

  const handleSaveService = async (values) => {
    const actionToDispatch = serviceChargeData?.id
      ? updateOtaInvoiceCharge({
          business_id: businessId,
          id: serviceChargeData.id,
          data: {
            ...values,
            charge_type: "service",
            charge_kind: "service_charge",
            title: "Service",
          },
        })
      : createOtaInvoiceCharge({
          business_id: businessId,
          data: {
            ...values,
            charge_type: "service",
            charge_kind: "service_charge",
            title: "Service",
          },
        });

    dispatch(actionToDispatch).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Successfully updated service charge!");
        dispatch(getOTAInvoiceCharge({ business_id: businessId }));
      } else {
        message.error("Failed to update service charge.");
      }
    });
  };

  const handleSaveTax = async (values) => {
    const actionToDispatch = taxData?.id
      ? updateOtaInvoiceCharge({
          business_id: businessId,
          id: taxData.id,
          data: {
            ...values,
            charge_type: "tax",
            charge_kind: "tax",
            title: "Tax",
          },
        })
      : createOtaInvoiceCharge({
          business_id: businessId,
          data: {
            ...values,
            charge_type: "tax",
            charge_kind: "tax",
            title: "Tax",
          },
        });

    dispatch(actionToDispatch).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Successfully updated tax!");
        dispatch(getOTAInvoiceCharge({ business_id: businessId }));
      } else {
        message.error("Failed to update tax.");
      }
    });
  };

  const handleSaveOther = (values) => {
    const isEditing = Boolean(editingOtherItem?.id);

    const payload = {
      ...values,
      charge_type: otherModalTarget === "other_tax" ? "tax" : "service",
      charge_kind: otherModalTarget,
    };

    const actionToDispatch = isEditing
      ? updateOtaInvoiceCharge({
          business_id: businessId,
          id: editingOtherItem.id,
          data: payload,
        })
      : createOtaInvoiceCharge({
          business_id: businessId,
          data: payload,
        });

    dispatch(actionToDispatch).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success(
          `Successfully ${isEditing ? "updated" : "created"} ${
            otherModalTarget === "other_tax" ? "tax" : "charge"
          }!`,
        );
        dispatch(getOTAInvoiceCharge({ business_id: businessId }));
        setEditingOtherItem(null);
      } else {
        message.error(
          `Failed to ${isEditing ? "update" : "create"} ${
            otherModalTarget === "other_tax" ? "tax" : "charge"
          }.`,
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-white mx-auto">
      {/* Header Info */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Set up fixed charges for OTA Invoice / Receipt
        </h3>
        <p className="text-sm text-gray-500 m-0">
          All descriptions and amounts will appear on the invoice and receipt.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6 px-5 pb-10">
        {/* 1. Service Charge Section */}
        <div>
          <div className="px-4 py-2.5 -mx-5 mb-4">
            <h4 className="text-sm font-bold text-gray-800 m-0">
              Service Charge
            </h4>
          </div>
          {serviceChargeData && serviceChargeData ? (
            <ChargeCard
              title="Service Charge"
              type={serviceChargeData?.mode}
              value={
                serviceChargeData?.mode === "percentage"
                  ? serviceChargeData?.value
                  : serviceChargeData?.value
              }
              onEdit={() => setIsServiceModalOpen(true)}
            />
          ) : (
            <AddButton onClick={() => setIsServiceModalOpen(true)} />
          )}
        </div>

        {/* 2. Other Charge Description Section */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">
            Other Charge Description
          </h4>
          <div className="space-y-3">
            {otherChargesList.map((item, idx) => (
              <ChargeCard
                key={item.id || idx}
                title={item.title}
                type={item.mode}
                value={item.value}
                onEdit={() =>
                  openOtherModal(
                    "other_charge",
                    "Other Charge Description",
                    item,
                  )
                }
              />
            ))}
            <AddButton
              onClick={() =>
                openOtherModal("other_charge", "Other Charge Description", null)
              }
            />
          </div>
        </div>

        {/* 3. Tax Section */}
        <div>
          <div className="px-4 py-2.5 -mx-5 mb-4">
            <h4 className="text-sm font-bold text-gray-800 m-0">Tax</h4>
          </div>
          {taxData ? (
            <ChargeCard
              title="Tax"
              type={taxData.mode}
              value={taxData.value}
              onEdit={() => setIsTaxModalOpen(true)}
            />
          ) : (
            <AddButton onClick={() => setIsTaxModalOpen(true)} />
          )}
        </div>

        {/* 4. Other Tax Description Section */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">
            Other Tax Description
          </h4>
          <div className="space-y-3">
            {otherTaxesList.map((item, idx) => (
              <ChargeCard
                key={item.id || idx}
                title={item.title}
                type={item.mode}
                value={item.value}
                onEdit={() =>
                  openOtherModal("other_tax", "Other Tax Description", item)
                }
              />
            ))}
            <AddButton
              onClick={() =>
                openOtherModal("other_tax", "Other Tax Description", null)
              }
            />
          </div>
        </div>
      </div>

      {/* Service Charge Modal */}
      <ChargeTaxModal
        visible={isServiceModalOpen}
        title="Service Charge"
        initialData={serviceChargeData}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveService}
      />

      {/* Tax Modal */}
      <ChargeTaxModal
        visible={isTaxModalOpen}
        title="Tax"
        initialData={taxData}
        onClose={() => setIsTaxModalOpen(false)}
        onSave={handleSaveTax}
      />

      {/* Other Charge / Other Tax Modal */}
      <OtherChargeModal
        visible={isOtherModalOpen}
        title={otherModalTitle}
        initialData={editingOtherItem}
        onClose={() => {
          setIsOtherModalOpen(false);
          setEditingOtherItem(null);
        }}
        onSave={handleSaveOther}
      />
    </div>
  );
};

export default OTAChargeSetup;
