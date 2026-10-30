import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  getOTARoomHistory,
  otaManagementSelector,
} from "../service/otaManagementSlice";
import { useParams } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import { Divider, Empty } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileDownIcon } from "@hugeicons/core-free-icons";

const OTARoomHistory = () => {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { id: room_id } = useParams();
  const { history, isPending } = useSelector(otaManagementSelector);
  useEffect(() => {
    if (businessId) {
      dispatch(
        getOTARoomHistory({
          business_id: businessId,
          room_id,
        }),
      );
    }
  }, [businessId, dispatch]);
  if (isPending) {
    return <PageLoading />;
  }

  const handleDownload = ({ url }) => {
    if (url) {
      window.open(`${url}`, "_blank");
    } else {
      message.warning("Receipt PDF မရှိပါ။");
    }
  };

  return (
    <div>
      <div>
        <p className=" font-semibold">
          #{history?.physical_room?.room_number} &nbsp;
          <span className=" text-green-500">
            Active OTA : {history?.physical_room?.active_ota_bookings}
          </span>
        </p>
        <p className=" text-neutral-400 font-medium text-sm mt-3">
          {history?.physical_room?.room_standard?.name} •{" "}
          {history?.physical_room?.bed_type?.name} •{" "}
          {history?.physical_room?.room_view?.name}
        </p>
      </div>
      <Divider />
      {history?.ota_records?.length > 0 ? (
        <>
          {history?.ota_records?.map((record) => {
            return (
              <div
                className=" bg-neutral-200 p-3 rounded-md"
                key={record?.assignment_id}
              >
                <div className=" flex justify-between items-center">
                  <div className=" font-semibold">
                    {record?.invoices?.[0]?.invoice_number}{" "}
                    <div className=" text-sm">
                      {record?.check_in} - {record?.check_out}
                    </div>
                  </div>
                  <div className=" font-semibold">
                    Night
                    <div className=" text-sm">{record?.nights}</div>
                  </div>
                  <div className=" font-semibold">
                    Guests
                    <div className=" text-sm">
                      {record?.adults}A, {record?.children}C
                    </div>
                  </div>
                </div>
                <Divider variant="dashed" dashed />
                <div className=" flex justify-between items-center">
                  <div className=" font-semibold">
                    {record?.contact_name}{" "}
                    <div className=" font-blod text-neutral-700">
                      {record?.contact_phone}
                    </div>
                  </div>
                  <div className=" text-primary-500 font-semibold flex items-center">
                    {record?.currency}&nbsp;
                    {record?.amount}
                    <button
                      className="ml-2"
                      onClick={() =>
                        handleDownload({
                          url: record?.invoices?.[0]?.invoice_pdf_url,
                        })
                      }
                    >
                      <HugeiconsIcon icon={FileDownIcon} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default OTARoomHistory;
