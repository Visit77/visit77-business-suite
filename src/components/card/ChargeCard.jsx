import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Edit01Icon } from "@hugeicons/core-free-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOtaInvoiceCharge,
  deletePMSInvoiceCharge,
} from "../../service/invoiceChargeSlice";
import _ from "lodash";
import { message } from "antd";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import { selectBusinessId } from "../../service/businessSlice";

const ChargeCard = ({ title, type, value, onEdit, item, content }) => {
  const getSubtext = () => {
    if (type === "included") return "Included";
    if (type === "percentage") return `${value}% `;
    if (type === "fixed") return `${value} MMK`;
    return "";
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const onDelete = () => {
    setIsModalOpen(true);
  };
  const businessId = useSelector(selectBusinessId);

  return (
    <div className="bg-[#f8f9fa] p-4 rounded-xl flex justify-between items-center border border-gray-100 shadow-sm">
      <div>
        <h4 className="text-gray-700 font-semibold text-base mb-1">{title}</h4>
        <p className="text-gray-900 font-bold text-lg m-0">{getSubtext()}</p>
      </div>
      <div>
        <button
          onClick={onEdit}
          className="text-[#4f46e5] hover:text-[#3730a3] text-xl p-2 rounded-full hover:bg-indigo-50 transition-all"
        >
          <HugeiconsIcon icon={Edit01Icon} />
        </button>
        {item && (
          <button
            onClick={onDelete}
            className="text-red-700 hover:text-red-800 text-xl p-2 rounded-full hover:bg-indigo-50 transition-all"
          >
            <HugeiconsIcon icon={Delete01Icon} />
          </button>
        )}
      </div>
      <DeleteConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsDeleting(true);
          if (content == "pms") {
            dispatch(
              deletePMSInvoiceCharge({ id: item?.id, business_id: businessId }),
            ).then((response) => {
              if (_.endsWith(response.type, "fulfilled")) {
                message.success("Success");
              } else {
                message.error("Error");
              }
            });
          } else {
            dispatch(
              deleteOtaInvoiceCharge({ id: item?.id, business_id: businessId }),
            ).then((response) => {
              if (_.endsWith(response.type, "fulfilled")) {
                message.success("Success");
              } else {
                message.error("Error");
              }
            });
          }

          setIsDeleting(false);
          setIsModalOpen(false);
        }}
        loading={isDeleting}
        title={`Delete ${title} ?`}
      />
    </div>
  );
};

export default ChargeCard;
