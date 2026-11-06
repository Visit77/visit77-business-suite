import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import {
  getRemittanceDetails,
  getRemittanceFile,
  otaRevenueSelector,
} from "../service/otaRevenueSlice";
import { useParams } from "react-router-dom";
import { Table, Button, message } from "antd";

import PageLoading from "../components/PageLoading";
import { FileDownloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import _ from "lodash";

const RemittanceDetails = () => {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { id } = useParams();

  useEffect(() => {
    if (businessId && id) {
      dispatch(getRemittanceDetails({ business_id: businessId, id }));
    }
  }, [businessId, id, dispatch]);
  const { remittanceDetails, isPending } = useSelector(otaRevenueSelector);
  const remittance = remittanceDetails?.remittance;

  if (isPending) {
    return <PageLoading />;
  }
  return (
    <div className="bg-neutral-50 min-h-screen p-4">
      {/* Export Button */}

      <div className="my-4 flex justify-between items-center">
        <div className=" font-medium text-lg">
          Details ( {remittance?.reference} )
        </div>
        <Button
          size="large"
          className="flex items-center justify-center gap-2 text-emerald-600 border-emerald-500 hover:text-emerald-700 hover:border-emerald-600 font-medium h-12 rounded-lg"
          icon={
            <HugeiconsIcon
              icon={FileDownloadIcon}
              className="w-5 h-5 text-emerald-600"
            />
          }
          onClick={() =>
            // excel export
            dispatch(
              getRemittanceFile({
                business_id: businessId,
                url: `api/v1/admin/remittances/${id}/export/`,
              }),
            ).then((response) => {
              if (_.endsWith(response.type, "fulfilled")) {
                const data = response.payload.data;

                const blob = new Blob([data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `remittance-${remittance?.reference}.xlsx`;
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
              } else {
                message.error("Error");
              }
            })
          }
        >
          Export Excel File
        </Button>
      </div>

      {remittance?.grouped_items?.map((group, groupIdx) => {
        if (!group?.date_groups || group.date_groups.length === 0) return null;

        return (
          <div key={groupIdx} className="mb-6">
            <h2 className="text-base font-bold text-blue-600 mb-3">
              {group?.label}
            </h2>

            {group?.date_groups?.map((dateGroup, dateIdx) => {
              const dataSource = dateGroup?.items || [];

              const columns = [
                {
                  title: "TIME",
                  dataIndex: "effective_time",
                  key: "effective_time",
                  width: 90,
                  render: (text) => (
                    <span className="text-xs font-normal text-gray-700">
                      {text}
                    </span>
                  ),
                },
                {
                  title: "BOOKING ID",
                  dataIndex: "booking_code",
                  key: "booking_code",
                  width: 140,
                  render: (text) => (
                    <span className="text-xs font-medium text-gray-800">
                      {text}
                    </span>
                  ),
                },
                {
                  title: (
                    <div className="leading-tight">
                      <div>CHECK-IN</div>
                      <div>CHECK-OUT</div>
                    </div>
                  ),
                  key: "check_dates",
                  width: 120,
                  render: (_, record) => (
                    <div className="text-xs text-gray-700 leading-snug">
                      <div>{record.check_in}</div>
                      <div>{record.check_out}</div>
                    </div>
                  ),
                },
                {
                  title: (
                    <div className="text-right leading-tight">
                      <div>AMOUNT</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        {remittance?.currency}
                      </div>
                    </div>
                  ),
                  dataIndex: "amount",
                  key: "amount",
                  align: "right",
                  width: 90,
                  render: (text) => (
                    <span className="text-xs font-medium text-gray-800">
                      {text?.toLocaleString()}
                    </span>
                  ),
                },
                {
                  title: (
                    <div className="text-right leading-tight">
                      <div>REFUND</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        {remittance?.currency}
                      </div>
                    </div>
                  ),
                  dataIndex: "refund_amount",
                  key: "refund_amount",
                  align: "right",
                  width: 90,
                  render: (text) => (
                    <span className="text-xs font-medium text-gray-800">
                      {text ? text.toLocaleString() : ""}
                    </span>
                  ),
                },
              ];

              return (
                <div key={dateIdx} className="mb-4 overflow-x-auto">
                  <div className="bg-neutral-200 text-neutral-800 font-semibold px-3 py-1.5 text-xs rounded-t">
                    {dateGroup?.date}
                  </div>

                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    className="border-b border-gray-100"
                    components={{
                      header: {
                        cell: (props) => (
                          <th
                            {...props}
                            className="bg-neutral-100 text-gray-600 font-semibold text-[11px] py-2 px-3 border-none"
                          />
                        ),
                      },
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default RemittanceDetails;
