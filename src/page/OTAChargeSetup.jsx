import React, { useState } from "react";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import ChargeTaxModal from "../components/modal/ChargeTaxModal";
import OtherChargeModal from "../components/modal/OtherChargeModal";
import ChargeCard from "../components/card/ChargeCard";

const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className=" w-full  border-2  border-dashed  border-[#4f46e5]  rounded-xl  p-4  flex  items-center  justify-center  text-[#4f46e5]  font-semibold  text-lg hover: bg-indigo-50/50  transition-all"
    >
      <PlusOutlined className=" mr-2  text-lg" /> Add
    </button>
  );
};

const OTAChargeSetup = () => {
  // Service Charge State
  const [serviceCharge, setServiceCharge] = useState({ type: "included" });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Tax State
  const [tax, setTax] = useState(null);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  // Other Charges & Other Taxes List State
  const [otherCharges, setOtherCharges] = useState([]);
  const [otherTaxes, setOtherTaxes] = useState([]);

  // Other Modal Control
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [otherModalTitle, setOtherModalTitle] = useState("");
  const [otherModalTarget, setOtherModalTarget] = useState("charge"); // 'charge' or 'tax'

  const openOtherModal = (target, title) => {
    setOtherModalTarget(target);
    setOtherModalTitle(title);
    setIsOtherModalOpen(true);
  };

  const handleSaveOther = (data) => {
    if (otherModalTarget === "charge") {
      setOtherCharges([...otherCharges, data]);
    } else {
      setOtherTaxes([...otherTaxes, data]);
    }
  };

  return (
    <div className=" min-h-screen  bg-white   mx-auto  ">
      {/* Header Info */}
      <div className=" p-5">
        <h3 className=" text-base  font-bold  text-gray-900  mb-1">
          Set up fixed charges for OTA Invoice / Receipt
        </h3>
        <p className=" text-sm  text-gray-500  m-0">
          All descriptions and amounts will appear on the invoice and receipt.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className=" space-y-6  px-5  pb-10">
        {/* 1. Service Charge Section */}
        <div>
          <div className="  px-4  py-2.5  -mx-5  mb-4">
            <h4 className=" text-sm  font-bold  text-gray-800  m-0">
              Service Charge
            </h4>
          </div>
          <ChargeCard
            title="Service Charge"
            type={serviceCharge.type}
            value={
              serviceCharge.type === "percentage"
                ? serviceCharge.percentage
                : serviceCharge.fixAmount
            }
            onEdit={() => setIsServiceModalOpen(true)}
          />
        </div>

        {/* 2. Other Charge Description Section */}
        <div>
          <h4 className=" text-sm  font-bold  text-gray-800  mb-3">
            Other Charge Description
          </h4>
          <div className=" space-y-3">
            {otherCharges.map((item, idx) => (
              <ChargeCard
                key={idx}
                title={item.title}
                type={item.type}
                value={
                  item.type === "percentage" ? item.percentage : item.fixAmount
                }
                onEdit={() => {}}
              />
            ))}
            <AddButton
              onClick={() =>
                openOtherModal("charge", "Other Charge Description")
              }
            />
          </div>
        </div>

        {/* 3. Tax Section */}
        <div>
          <div className="   px-4  py-2.5  -mx-5  mb-4">
            <h4 className=" text-sm  font-bold  text-gray-800  m-0">Tax</h4>
          </div>
          {tax ? (
            <ChargeCard
              title="Tax"
              type={tax.type}
              value={tax.type === "percentage" ? tax.percentage : tax.fixAmount}
              onEdit={() => setIsTaxModalOpen(true)}
            />
          ) : (
            <AddButton onClick={() => setIsTaxModalOpen(true)} />
          )}
        </div>

        {/* 4. Other Tax Description Section */}
        <div>
          <h4 className=" text-sm  font-bold  text-gray-800  mb-3">
            Other Tax Description
          </h4>
          <div className=" space-y-3">
            {otherTaxes.map((item, idx) => (
              <ChargeCard
                key={idx}
                title={item.title}
                type={item.type}
                value={
                  item.type === "percentage" ? item.percentage : item.fixAmount
                }
                onEdit={() => {}}
              />
            ))}
            <AddButton
              onClick={() => openOtherModal("tax", "Other Tax Description")}
            />
          </div>
        </div>
      </div>

      {/* Service Charge Modal */}
      <ChargeTaxModal
        visible={isServiceModalOpen}
        title="Service Charge"
        initialData={serviceCharge}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={(data) => setServiceCharge(data)}
      />

      {/* Tax Modal */}
      <ChargeTaxModal
        visible={isTaxModalOpen}
        title="Tax"
        initialData={tax}
        onClose={() => setIsTaxModalOpen(false)}
        onSave={(data) => setTax(data)}
      />

      {/* Other Charge / Other Tax Modal */}
      <OtherChargeModal
        visible={isOtherModalOpen}
        title={otherModalTitle}
        onClose={() => setIsOtherModalOpen(false)}
        onSave={handleSaveOther}
      />
    </div>
  );
};

export default OTAChargeSetup;
